import withAuthRequired from "@/lib/auth/withAuthRequired";
import { NextResponse } from "next/server";
import { MeResponse } from "./types";
import { cachedUserWithPlanQuery } from "@/lib/cache/cached-query";

export const GET = withAuthRequired(async (req, context) => {
  const { session, getCurrentPlan } = context;

  // Get current plan with caching (now optimized with single JOIN query)
  const currentPlan = await cachedUserWithPlanQuery(session.user.id, async () => {
    return await getCurrentPlan();
  }) as Awaited<ReturnType<typeof getCurrentPlan>>;

  // Use session user data instead of making another database query
  // The session already contains the user data we need
  return NextResponse.json<MeResponse>({
    currentPlan,
    user: session.user,
  });
});
