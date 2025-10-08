import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

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

    // Check if user is authorized (renter or owner)
    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this booking" },
        { status: 403 }
      );
    }

    // Update booking status to paid
    const statusHistory = [
      ...(Array.isArray(bookingData.statusHistory) ? bookingData.statusHistory : []),
      {
        status: "paid" as const,
        timestamp: new Date(),
        note: "Payment completed manually"
      }
    ];

    const updatedBooking = await db
      .update(bookings)
      .set({
        status: "paid",
        paymentStatus: "paid",
        statusHistory,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    return NextResponse.json({
      message: "Booking marked as paid",
      booking: updatedBooking[0]
    });
  } catch (error) {
    console.error("Error marking booking as paid:", error);
    return NextResponse.json(
      { error: "Failed to mark booking as paid" },
      { status: 500 }
    );
  }
}
