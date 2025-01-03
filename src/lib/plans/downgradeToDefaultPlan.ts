import { db } from "@/db";
import { plans } from "@/db/schema/plans";
import { eq } from "drizzle-orm";
import APIError from "../api/errors";
import updatePlan from "./updatePlan";

const downgradeToDefaultPlan = async ({ userId }: { userId: string }) => {
  const defaultPlan = await db
    .select()
    .from(plans)
    .where(eq(plans.default, true));

  if (!defaultPlan.length) {
    throw new APIError("Default plan not found");
  }

  const defaultPlanId = defaultPlan[0].id;

  await updatePlan({
    userId,
    newPlanId: defaultPlanId,
    sendEmail: false,
  });
  // Send Update Plan Email
};

export default downgradeToDefaultPlan;
