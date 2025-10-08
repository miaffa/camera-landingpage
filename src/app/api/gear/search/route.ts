import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gearListings } from "@/db/schema/gear";
import { users } from "@/db/schema/user";
import { eq, and, or, ilike, sql } from "drizzle-orm";
import { cachedGearQuery } from "@/lib/cache/cached-query";

// GET /api/gear/search - Search for available gear
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 items
    const offset = parseInt(searchParams.get('offset') || '0');

    // Use cached query for gear search
    const result = await cachedGearQuery(limit, offset, async () => {
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

      // Get total count for pagination
      const totalCountResult = await db
        .select({ count: sql`count(*)` })
        .from(gearListings)
        .leftJoin(users, eq(gearListings.ownerId, users.id))
        .where(and(...conditions));
      
      const totalCount = Number(totalCountResult[0]?.count || 0);

      // Fetch paginated gear with owner information
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
        .orderBy(gearListings.createdAt)
        .limit(limit)
        .offset(offset);

      return {
        data: gearData,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: Math.floor(offset / limit) + 1
        }
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching gear:", error);
    return NextResponse.json(
      { error: "Failed to search gear" },
      { status: 500 }
    );
  }
}