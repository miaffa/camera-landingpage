import { NextResponse } from "next/server";
import { db } from "@/db";
import { gearSaves, gearListings } from "@/db/schema/gear";
import { users } from "@/db/schema/user";
import { eq, desc } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

export const GET = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const userId = session.user.id;

    // Fetch saved gear with owner information
    const savedGear = await db
      .select({
        id: gearListings.id,
        name: gearListings.name,
        category: gearListings.category,
        description: gearListings.description,
        pricePerDay: gearListings.pricePerDay,
        condition: gearListings.condition,
        location: gearListings.location,
        images: gearListings.images,
        isAvailable: gearListings.isAvailable,
        createdAt: gearListings.createdAt,
        updatedAt: gearListings.updatedAt,
        // Owner details
        ownerId: gearListings.ownerId,
        ownerName: users.name,
        ownerEmail: users.email,
        ownerImage: users.image,
        // Save details
        savedAt: gearSaves.createdAt,
      })
      .from(gearSaves)
      .innerJoin(gearListings, eq(gearSaves.gearId, gearListings.id))
      .leftJoin(users, eq(gearListings.ownerId, users.id))
      .where(eq(gearSaves.userId, userId))
      .orderBy(desc(gearSaves.createdAt));

    return NextResponse.json(savedGear);
  } catch (error) {
    console.error("Error fetching saved gear:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved gear" },
      { status: 500 }
    );
  }
});
