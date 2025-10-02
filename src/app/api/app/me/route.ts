import withAuthRequired from "@/lib/auth/withAuthRequired";
import { NextResponse } from "next/server";
import { MeResponse } from "./types";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GET = withAuthRequired(async (req, context) => {
  const { session, getCurrentPlan } = context;

  const currentPlan = await getCurrentPlan();

  // Fetch fresh user data from database instead of using session
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (user.length === 0) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json<MeResponse>({
    currentPlan,
    user: user[0],
  });
});
