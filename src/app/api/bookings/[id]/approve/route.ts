import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, rentalMessages } from "@/db/schema/bookings";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Validation schema
const approveBookingSchema = z.object({
  action: z.enum(["approve", "reject"]),
  message: z.string().optional(),
});

// POST /api/bookings/[id]/approve - Approve or reject a booking
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
    const body = await request.json();
    const validatedData = approveBookingSchema.parse(body);

    // Get the booking
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

    // Check if user is the owner of the gear
    if (bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to approve this booking" },
        { status: 403 }
      );
    }

    // Check if booking is still pending
    if (bookingData.status !== "pending") {
      return NextResponse.json(
        { error: "Booking is no longer pending" },
        { status: 400 }
      );
    }

    const newStatus = validatedData.action === "approve" ? "approved" : "cancelled";
    const statusNote = validatedData.action === "approve" 
      ? "Booking approved by owner" 
      : "Booking rejected by owner";

    // Update booking status
    const updatedBooking = await db
      .update(bookings)
      .set({
        status: newStatus,
        statusHistory: [
          ...(bookingData.statusHistory || []),
          {
            status: newStatus,
            timestamp: new Date(),
            note: statusNote,
          }
        ],
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    // Add system message about the decision
    await db.insert(rentalMessages).values({
      bookingId: bookingId,
      senderId: session.user.id,
      message: validatedData.action === "approve" 
        ? `✅ Booking approved! The renter can now proceed with payment.`
        : `❌ Booking rejected. ${validatedData.message || "No reason provided."}`,
      messageType: "system",
      isSystemMessage: true,
    });

    // Add owner's message if provided
    if (validatedData.message) {
      await db.insert(rentalMessages).values({
        bookingId: bookingId,
        senderId: session.user.id,
        message: validatedData.message,
        messageType: "text",
        isSystemMessage: false,
      });
    }

    return NextResponse.json({
      success: true,
      booking: updatedBooking[0],
      message: `Booking ${validatedData.action}d successfully`
    });

  } catch (error) {
    console.error("Error approving booking:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process booking request" },
      { status: 500 }
    );
  }
}
