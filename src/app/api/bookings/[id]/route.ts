import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, rentalMessages } from "@/db/schema/bookings";
import { eq, and } from "drizzle-orm";

// GET /api/bookings/[id] - Get specific booking details
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

    // Get booking with all related data
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

    // Check if user has permission to view this booking
    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to view this booking" },
        { status: 403 }
      );
    }

    // Get messages for this booking
    const messages = await db
      .select()
      .from(rentalMessages)
      .where(eq(rentalMessages.bookingId, bookingId))
      .orderBy(rentalMessages.createdAt);

    return NextResponse.json({
      ...bookingData,
      messages
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(
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

    // Check if user has permission to cancel this booking
    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to cancel this booking" },
        { status: 403 }
      );
    }

    // Only allow cancellation if booking is pending or approved
    if (!["pending", "approved"].includes(bookingData.status)) {
      return NextResponse.json(
        { error: "Cannot cancel booking in current status" },
        { status: 400 }
      );
    }

    // Update booking status to cancelled
    const statusHistory = [
      ...bookingData.statusHistory,
      {
        status: "cancelled" as const,
        timestamp: new Date(),
        note: "Booking cancelled by user"
      }
    ];

    const updatedBooking = await db
      .update(bookings)
      .set({
        status: "cancelled",
        statusHistory,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return NextResponse.json(updatedBooking[0]);
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
