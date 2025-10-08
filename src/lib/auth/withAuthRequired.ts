import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { plans } from "@/db/schema/plans";
import { MeResponse } from "@/app/api/app/me/types";

interface WithManagerHandler {
  (
    req: NextRequest,
    context: {
      session: NonNullable<
        Session & {
          user: MeResponse["user"];
        }
      >;
      getCurrentPlan: () => Promise<MeResponse["currentPlan"]>;
      params: Promise<Record<string, unknown>>;
    }
  ): Promise<NextResponse | Response>;
}

const withAuthRequired = (handler: WithManagerHandler) => {
  return async (
    req: NextRequest,
    context: {
      params: Promise<Record<string, unknown>>;
    }
  ) => {
    const session = await auth();

    if (!session || !session.user || !session.user.id || !session.user.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to perform this action",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const getCurrentPlan = async () => {
      // Single optimized query with JOIN to get user and plan data
      const userWithPlan = await db
        .select({
          userId: users.id,
          planId: users.planId,
          planName: plans.name,
          planCodename: plans.codename,
          planQuotas: plans.quotas,
          planDefault: plans.default,
        })
        .from(users)
        .leftJoin(plans, eq(users.planId, plans.id))
        .where(eq(users.id, userId))
        .limit(1);

      if (!userWithPlan.length || !userWithPlan[0].planId) {
        return null;
      }

      return {
        id: userWithPlan[0].planId,
        name: userWithPlan[0].planName,
        codename: userWithPlan[0].planCodename,
        quotas: userWithPlan[0].planQuotas,
        default: userWithPlan[0].planDefault,
      };
    };

    return await handler(req, {
      ...context,
      // @ts-expect-error - session is typed correctly, but user is not
      // althogh it is checked above
      session: session,
      getCurrentPlan,
    });
  };
};

export default withAuthRequired;
