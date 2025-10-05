import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gearSaves } from "@/db/schema/gear";
import { eq, and } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

export const POST = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const params = await context.params;
    const gearId = params.id as string;
    const userId = session.user.id;

    console.log("Saving gear:", { gearId, userId });

    if (!gearId) {
      return NextResponse.json({ error: "Gear ID is required" }, { status: 400 });
    }

    // Check if already saved
    const existingSave = await db
      .select()
      .from(gearSaves)
      .where(and(eq(gearSaves.userId, userId), eq(gearSaves.gearId, gearId)))
      .limit(1);

    if (existingSave.length > 0) {
      return NextResponse.json({ error: "Gear already saved" }, { status: 400 });
    }

    // Save the gear
    await db.insert(gearSaves).values({
      userId,
      gearId,
    });

    console.log("Gear saved successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving gear:", error);
    return NextResponse.json(
      { error: "Failed to save gear", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
});

export const DELETE = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const params = await context.params;
    const gearId = params.id as string;
    const userId = session.user.id;

    if (!gearId) {
      return NextResponse.json({ error: "Gear ID is required" }, { status: 400 });
    }

    // Remove the save
    await db
      .delete(gearSaves)
      .where(and(eq(gearSaves.userId, userId), eq(gearSaves.gearId, gearId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsaving gear:", error);
    return NextResponse.json(
      { error: "Failed to unsave gear" },
      { status: 500 }
    );
  }
});
