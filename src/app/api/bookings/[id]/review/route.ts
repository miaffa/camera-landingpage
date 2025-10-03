import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, reviews } from "@/db/schema/bookings";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Validation schema
const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  communicationRating: z.number().min(1).max(5).optional(),
  gearConditionRating: z.number().min(1).max(5).optional(),
  timelinessRating: z.number().min(1).max(5).optional(),
});

// POST /api/bookings/[id]/review - Create review for completed booking
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = params.id;
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Get booking details
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Check if user is part of this booking
    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to review this booking" },
        { status: 403 }
      );
    }

    // Check if booking is completed
    if (bookingData.status !== "completed") {
      return NextResponse.json(
        { error: "Can only review completed bookings" },
        { status: 400 }
      );
    }

    // Determine who is being reviewed
    const revieweeId = bookingData.renterId === session.user.id 
      ? bookingData.ownerId 
      : bookingData.renterId;

    // Check if user has already reviewed this booking
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.bookingId, bookingId),
          eq(reviews.reviewerId, session.user.id)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this booking" },
        { status: 400 }
      );
    }

    // Create review
    const newReview = await db.insert(reviews).values({
      bookingId,
      reviewerId: session.user.id,
      revieweeId,
      rating: validatedData.rating,
      comment: validatedData.comment,
      communicationRating: validatedData.communicationRating,
      gearConditionRating: validatedData.gearConditionRating,
      timelinessRating: validatedData.timelinessRating,
    }).returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid review data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

// GET /api/bookings/[id]/review - Get review for booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = params.id;

    // Get booking details
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Check if user is part of this booking
    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to view reviews for this booking" },
        { status: 403 }
      );
    }

    // Get reviews for this booking
    const bookingReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.bookingId, bookingId));

    return NextResponse.json(bookingReviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
