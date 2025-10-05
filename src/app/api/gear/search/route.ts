import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gearListings } from "@/db/schema/gear";
import { users } from "@/db/schema/user";
import { eq, and, or, ilike } from "drizzle-orm";

// GET /api/gear/search - Search for available gear
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Build the where conditions
    const conditions = [eq(gearListings.isAvailable, true)];

    if (query) {
      conditions.push(
        or(
          ilike(gearListings.name, `%${query}%`),
          ilike(gearListings.description, `%${query}%`),
          ilike(gearListings.category, `%${query}%`)
        )!
      );
    }

    if (category) {
      conditions.push(ilike(gearListings.category, `%${category}%`));
    }

    if (location) {
      conditions.push(ilike(gearListings.location, `%${location}%`));
    }

    if (minPrice) {
      conditions.push(eq(gearListings.pricePerDay, `>=${minPrice}`));
    }

    if (maxPrice) {
      conditions.push(eq(gearListings.pricePerDay, `<=${maxPrice}`));
    }

    // Fetch gear with owner information
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
      .where(and(...conditions))
      .orderBy(gearListings.createdAt);

    return NextResponse.json(gearData);
  } catch (error) {
    console.error("Error searching gear:", error);
    return NextResponse.json(
      { error: "Failed to search gear" },
      { status: 500 }
    );
  }
}