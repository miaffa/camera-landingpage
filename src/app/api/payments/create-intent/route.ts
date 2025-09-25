import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import { requireUser } from '@/lib/auth/requireUser';
import { db } from '@/db';
import { rentalRequests } from '@/db/schema/rental';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    const { rentalRequestId, amount } = await request.json();

    if (!rentalRequestId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify rental request exists and belongs to user
    const rentalRequest = await db
      .select()
      .from(rentalRequests)
      .where(eq(rentalRequests.id, rentalRequestId))
      .limit(1);

    if (!rentalRequest[0]) {
      return NextResponse.json(
        { error: 'Rental request not found' },
        { status: 404 }
      );
    }

    if (rentalRequest[0].renterId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create or get Stripe customer
    let customerId = (user as { stripeCustomerId?: string }).stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: (user as { name?: string }).name || user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;
      
      // Update user with customer ID
      // Note: You'll need to add this to your user update logic
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        rentalRequestId,
        renterId: user.id,
        ownerId: rentalRequest[0].ownerId,
      },
      description: `Rental payment for ${rentalRequest[0].gearName}`,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
