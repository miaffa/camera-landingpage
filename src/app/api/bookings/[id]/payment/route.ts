import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, users } from "@/db/schema/bookings";
import { eq } from "drizzle-orm";
import { getStripeClient } from "@/lib/stripe/client";
import { z } from "zod";

// Validation schema
const createPaymentIntentSchema = z.object({
  paymentMethodId: z.string().optional(),
});

// POST /api/bookings/[id]/payment - Create payment intent for booking
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = params.id;
    const body = await request.json();
    const validatedData = createPaymentIntentSchema.parse(body);

    // Get booking details
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Check if user is the renter
    if (bookingData.renterId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to pay for this booking" },
        { status: 403 }
      );
    }

    // Check if booking is in correct status for payment
    if (bookingData.status !== "approved") {
      return NextResponse.json(
        { error: "Booking is not approved for payment" },
        { status: 400 }
      );
    }

    // Get renter's Stripe customer ID
    const renter = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (renter.length === 0 || !renter[0].stripeCustomerId) {
      return NextResponse.json(
        { error: "Renter must have a Stripe customer account" },
        { status: 400 }
      );
    }

    // Get owner's Stripe customer ID
    const owner = await db
      .select()
      .from(users)
      .where(eq(users.id, bookingData.ownerId))
      .limit(1);

    if (owner.length === 0 || !owner[0].stripeCustomerId) {
      return NextResponse.json(
        { error: "Owner must have a Stripe customer account" },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    const totalAmount = Math.round(parseFloat(bookingData.renterAmount) * 100); // Convert to cents

    // Create payment intent with application fee (platform fee)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      customer: renter[0].stripeCustomerId,
      application_fee_amount: Math.round(parseFloat(bookingData.platformFee) * 100),
      transfer_data: {
        destination: owner[0].stripeCustomerId, // Transfer to owner's account
      },
      metadata: {
        bookingId,
        renterId: session.user.id,
        ownerId: bookingData.ownerId,
        gearId: bookingData.gearId,
      },
      ...(validatedData.paymentMethodId && {
        payment_method: validatedData.paymentMethodId,
        confirm: true,
      }),
    });

    // Update booking with payment intent ID
    await db
      .update(bookings)
      .set({
        stripePaymentIntentId: paymentIntent.id,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id]/payment - Confirm payment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = params.id;

    // Get booking details
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Check if user is the renter
    if (bookingData.renterId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to confirm payment for this booking" },
        { status: 403 }
      );
    }

    if (!bookingData.stripePaymentIntentId) {
      return NextResponse.json(
        { error: "No payment intent found for this booking" },
        { status: 400 }
      );
    }

    // Verify payment with Stripe
    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(
      bookingData.stripePaymentIntentId
    );

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Update booking status to paid
    const statusHistory = [
      ...bookingData.statusHistory,
      {
        status: "paid" as const,
        timestamp: new Date(),
        note: "Payment completed successfully"
      }
    ];

    const updatedBooking = await db
      .update(bookings)
      .set({
        status: "paid",
        paymentStatus: "paid",
        statusHistory,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return NextResponse.json(updatedBooking[0]);
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
