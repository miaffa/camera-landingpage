import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripeClient } from "@/lib/stripe/client";
import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_RENTAL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const stripe = getStripeClient();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("Received Stripe webhook event:", event.type);

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      
      case "payment_intent.canceled":
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      
      case "transfer.created":
        await handleTransferCreated(event.data.object as Stripe.Transfer);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error("No booking ID in payment intent metadata");
      return;
    }

    // Update booking status to paid
    const statusHistory = [{
      status: "paid" as const,
      timestamp: new Date(),
      note: "Payment completed via Stripe webhook"
    }];

    await db
      .update(bookings)
      .set({
        status: "paid",
        paymentStatus: "paid",
        statusHistory,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    console.log(`Booking ${bookingId} marked as paid`);
  } catch (error) {
    console.error("Error handling payment intent succeeded:", error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error("No booking ID in payment intent metadata");
      return;
    }

    // Update booking status to cancelled due to payment failure
    const statusHistory = [{
      status: "cancelled" as const,
      timestamp: new Date(),
      note: "Payment failed - booking cancelled"
    }];

    await db
      .update(bookings)
      .set({
        status: "cancelled",
        paymentStatus: "failed",
        statusHistory,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    console.log(`Booking ${bookingId} cancelled due to payment failure`);
  } catch (error) {
    console.error("Error handling payment intent failed:", error);
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error("No booking ID in payment intent metadata");
      return;
    }

    // Update booking status to cancelled
    const statusHistory = [{
      status: "cancelled" as const,
      timestamp: new Date(),
      note: "Payment cancelled - booking cancelled"
    }];

    await db
      .update(bookings)
      .set({
        status: "cancelled",
        paymentStatus: "cancelled",
        statusHistory,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId));

    console.log(`Booking ${bookingId} cancelled due to payment cancellation`);
  } catch (error) {
    console.error("Error handling payment intent cancelled:", error);
  }
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  try {
    // Find booking by transfer metadata or payment intent
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.stripePaymentIntentId, transfer.metadata.payment_intent_id))
      .limit(1);

    if (booking.length === 0) {
      console.error("No booking found for transfer:", transfer.id);
      return;
    }

    // Update booking with transfer ID
    await db
      .update(bookings)
      .set({
        stripeTransferId: transfer.id,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, booking[0].id));

    console.log(`Transfer ${transfer.id} recorded for booking ${booking[0].id}`);
  } catch (error) {
    console.error("Error handling transfer created:", error);
  }
}
