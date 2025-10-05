import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gearListings } from "@/db/schema/gear";
import { users } from "@/db/schema/user";
import { eq, inArray } from "drizzle-orm";

// GET /api/gear/batch - Get multiple gear items by IDs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json({ error: "No gear IDs provided" }, { status: 400 });
    }

    const gearIds = idsParam.split(',').filter(id => id.trim());
    
    if (gearIds.length === 0) {
      return NextResponse.json({});
    }

    // Fetch gear data for all provided IDs
    const gearData = await db
      .select({
        id: gearListings.id,
        name: gearListings.name,
        category: gearListings.category,
        description: gearListings.description,
        pricePerDay: gearListings.pricePerDay,
        condition: gearListings.condition,
        location: gearListings.location,
        images: gearListings.images,
        availableFrom: gearListings.availableFrom,
        availableUntil: gearListings.availableUntil,
        isAvailable: gearListings.isAvailable,
        createdAt: gearListings.createdAt,
        updatedAt: gearListings.updatedAt,
        // Owner details
        ownerId: gearListings.ownerId,
        ownerName: users.name,
        ownerEmail: users.email,
        ownerImage: users.image,
      })
      .from(gearListings)
      .leftJoin(users, eq(gearListings.ownerId, users.id))
      .where(inArray(gearListings.id, gearIds));

    // Convert array to object keyed by gear ID for easy lookup
    const gearDataMap = gearData.reduce((acc, gear) => {
      acc[gear.id] = gear;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(gearDataMap);
  } catch (error) {
    console.error("Error fetching gear batch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch gear data" },
      { status: 500 }
    );
  }
}
