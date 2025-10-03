import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, users, reviews } from "@/db/schema/bookings";
import { gearListings } from "@/db/schema/gear";
import { eq, and, or, gte, lte } from "drizzle-orm";
import { sql } from "drizzle-orm";

// GET /api/gear/[id] - Get gear details with availability and reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gearId = params.id;

    // Get gear details with owner information
    const gear = await db
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
      .where(eq(gearListings.id, gearId))
      .limit(1);

    if (gear.length === 0) {
      return NextResponse.json(
        { error: "Gear not found" },
        { status: 404 }
      );
    }

    const gearData = gear[0];

    // Get owner's average rating
    const ownerReviews = await db
      .select({
        avgRating: sql<number>`avg(${reviews.rating})`,
        totalReviews: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(eq(reviews.revieweeId, gearData.ownerId));

    // Get recent bookings for this gear (for availability reference)
    const recentBookings = await db
      .select({
        id: bookings.id,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        status: bookings.status,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.gearId, gearId),
          or(
            eq(bookings.status, "pending"),
            eq(bookings.status, "approved"),
            eq(bookings.status, "paid"),
            eq(bookings.status, "active")
          )
        )
      )
      .orderBy(bookings.startDate);

    // Get gear reviews
    const gearReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        communicationRating: reviews.communicationRating,
        gearConditionRating: reviews.gearConditionRating,
        timelinessRating: reviews.timelinessRating,
        createdAt: reviews.createdAt,
        reviewerName: users.name,
        reviewerImage: users.image,
      })
      .from(reviews)
      .leftJoin(bookings, eq(reviews.bookingId, bookings.id))
      .leftJoin(users, eq(reviews.reviewerId, users.id))
      .where(
        and(
          eq(bookings.gearId, gearId),
          eq(reviews.isPublic, true)
        )
      )
      .orderBy(reviews.createdAt)
      .limit(10);

    return NextResponse.json({
      ...gearData,
      ownerRating: {
        average: ownerReviews[0]?.avgRating || 0,
        totalReviews: ownerReviews[0]?.totalReviews || 0,
      },
      recentBookings,
      reviews: gearReviews,
    });
  } catch (error) {
    console.error("Error fetching gear details:", error);
    return NextResponse.json(
      { error: "Failed to fetch gear details" },
      { status: 500 }
    );
  }
}
