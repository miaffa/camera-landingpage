import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { getStripeClient } from "@/lib/stripe/client";

export async function GET(request: NextRequest) {
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

    // If no Connect account, return null
    if (!userData.stripeConnectAccountId) {
      return NextResponse.json({
        hasAccount: false,
        accountId: null,
        status: null,
        onboardingComplete: false,
      });
    }

    const stripe = getStripeClient();

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(userData.stripeConnectAccountId);

    // Update user with latest status
    await db
      .update(users)
      .set({
        stripeConnectAccountStatus: account.details_submitted ? 'active' : 'pending',
        stripeConnectOnboardingComplete: account.details_submitted || false,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      hasAccount: true,
      accountId: userData.stripeConnectAccountId,
      status: account.details_submitted ? 'active' : 'pending',
      onboardingComplete: account.details_submitted || false,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: account.requirements,
    });

  } catch (error) {
    console.error("Error fetching account status:", error);
    return NextResponse.json(
      { error: "Failed to fetch account status" },
      { status: 500 }
    );
  }
}
