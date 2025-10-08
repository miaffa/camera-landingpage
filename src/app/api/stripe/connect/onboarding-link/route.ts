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

    // Check if user has a Connect account
    if (!userData.stripeConnectAccountId) {
      return NextResponse.json({ 
        error: "User does not have a Stripe Connect account. Create one first." 
      }, { status: 400 });
    }

    const stripe = getStripeClient();

    // Get the base URL - use NEXTAUTH_URL or fallback to localhost for development
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // Ensure the URL starts with http:// or https://
    const validBaseUrl = baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`;

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: userData.stripeConnectAccountId,
      refresh_url: `${validBaseUrl}/app/profile?tab=payments&refresh=true`,
      return_url: `${validBaseUrl}/app/profile?tab=payments&success=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      url: accountLink.url,
      expires_at: accountLink.expires_at,
    });

  } catch (error) {
    console.error("Error creating onboarding link:", error);
    return NextResponse.json(
      { error: "Failed to create onboarding link" },
      { status: 500 }
    );
  }
}
