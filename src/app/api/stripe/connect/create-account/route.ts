import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { getStripeClient } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = user[0];

    // Check if user already has a Connect account
    if (userData.stripeConnectAccountId) {
      return NextResponse.json({ 
        error: "User already has a Stripe Connect account",
        accountId: userData.stripeConnectAccountId 
      }, { status: 400 });
    }

    const stripe = getStripeClient();

    // Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // You might want to make this dynamic based on user location
      email: userData.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual', // or 'company' based on user preference
      individual: {
        email: userData.email,
        first_name: userData.name?.split(' ')[0] || 'Unknown',
        last_name: userData.name?.split(' ').slice(1).join(' ') || 'User',
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'daily', // Daily payouts to owners
          },
        },
      },
    });

    // Update user with Connect account ID
    await db
      .update(users)
      .set({
        stripeConnectAccountId: account.id,
        stripeConnectAccountStatus: 'pending',
        stripeConnectOnboardingComplete: false,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      accountId: account.id,
      status: 'pending',
      message: 'Stripe Connect account created successfully'
    });

  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe Connect account" },
      { status: 500 }
    );
  }
}
