import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { getStripeClient } from "@/lib/stripe/client";

export async function POST() {
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

    // Check if user already has a Stripe customer ID
    if (userData.stripeCustomerId) {
      return NextResponse.json({ 
        message: "User already has a Stripe customer account",
        customerId: userData.stripeCustomerId 
      });
    }

    const stripe = getStripeClient();

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: userData.email,
      name: userData.name || undefined,
      metadata: {
        userId: userData.id,
      },
    });

    // Update user with Stripe customer ID
    await db
      .update(users)
      .set({
        stripeCustomerId: customer.id,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      message: "Stripe customer account created successfully",
      customerId: customer.id,
    });

  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe customer account" },
      { status: 500 }
    );
  }
}
