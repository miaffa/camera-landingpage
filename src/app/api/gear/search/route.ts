import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { gearListings } from "@/db/schema/gear";
import { users } from "@/db/schema/user";
import { eq, and, gte, lte, or, ilike, sql } from "drizzle-orm";
import { z } from "zod";

// Validation schema
const searchGearSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  location: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0),
});

// GET /api/gear/search - Search for available gear
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate search parameters
    const searchData = {
      query: searchParams.get("query") || undefined,
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
      maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
      location: searchParams.get("location") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0,
    };

    const validatedData = searchGearSchema.parse(searchData);

    // Build search query
    let whereConditions = [eq(gearListings.isAvailable, true)];

    // Text search
    if (validatedData.query) {
      whereConditions.push(
        or(
          ilike(gearListings.name, `%${validatedData.query}%`),
          ilike(gearListings.description, `%${validatedData.query}%`),
          ilike(gearListings.category, `%${validatedData.query}%`)
        )!
      );
    }

    // Category filter
    if (validatedData.category) {
      whereConditions.push(eq(gearListings.category, validatedData.category));
    }

    // Price range filter
    if (validatedData.minPrice !== undefined) {
      whereConditions.push(gte(gearListings.pricePerDay, validatedData.minPrice.toString()));
    }
    if (validatedData.maxPrice !== undefined) {
      whereConditions.push(lte(gearListings.pricePerDay, validatedData.maxPrice.toString()));
    }

    // Location filter
    if (validatedData.location) {
      whereConditions.push(ilike(gearListings.location, `%${validatedData.location}%`));
    }

    // Date availability filter
    if (validatedData.startDate && validatedData.endDate) {
      const startDate = new Date(validatedData.startDate);
      const endDate = new Date(validatedData.endDate);

      // Check for conflicting bookings
      const conflictingBookings = await db
        .select({ gearId: bookings.gearId })
        .from(bookings)
        .where(
          and(
            or(
              // New search dates overlap with existing booking
              and(
                gte(bookings.startDate, startDate),
                lte(bookings.startDate, endDate)
              ),
              and(
                gte(bookings.endDate, startDate),
                lte(bookings.endDate, endDate)
              ),
              and(
                lte(bookings.startDate, startDate),
                gte(bookings.endDate, endDate)
              )
            ),
            or(
              eq(bookings.status, "pending"),
              eq(bookings.status, "approved"),
              eq(bookings.status, "paid"),
              eq(bookings.status, "active")
            )
          )
        );

      const conflictingGearIds = conflictingBookings.map(b => b.gearId);
      if (conflictingGearIds.length > 0) {
        whereConditions.push(sql`${gearListings.id} NOT IN (${sql.join(conflictingGearIds, sql`, `)})`);
      }
    }

    // Execute search query
    const searchResults = await db
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
        // Owner details
        ownerId: gearListings.ownerId,
        ownerName: users.name,
        ownerImage: users.image,
      })
      .from(gearListings)
      .leftJoin(users, eq(gearListings.ownerId, users.id))
      .where(and(...whereConditions))
      .orderBy(gearListings.createdAt)
      .limit(validatedData.limit)
      .offset(validatedData.offset);

    // Debug logging
    console.log("🔍 [GearSearch] Search results:", searchResults.length);
    searchResults.forEach(gear => {
      console.log(`🔍 [GearSearch] ${gear.name}: isAvailable=${gear.isAvailable}, availableFrom=${gear.availableFrom}, availableUntil=${gear.availableUntil}`);
    });

    // Get total count for pagination
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(gearListings)
      .leftJoin(users, eq(gearListings.ownerId, users.id))
      .where(and(...whereConditions));

    return NextResponse.json({
      results: searchResults,
      pagination: {
        total: totalCount[0]?.count || 0,
        limit: validatedData.limit,
        offset: validatedData.offset,
        hasMore: (totalCount[0]?.count || 0) > validatedData.offset + validatedData.limit,
      },
    });
  } catch (error) {
    console.error("Error searching gear:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to search gear" },
      { status: 500 }
    );
  }
}
