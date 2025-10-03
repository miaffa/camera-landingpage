import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, rentalMessages } from "@/db/schema/bookings";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Validation schema
const sendMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  attachments: z.array(z.string().url()).optional(),
  messageType: z.enum(["text", "image", "system"]).default("text"),
});

// GET /api/bookings/[id]/messages - Get messages for a booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bookingId } = await params;

    // Verify user has access to this booking
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

    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to view messages for this booking" },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await db
      .select()
      .from(rentalMessages)
      .where(eq(rentalMessages.bookingId, bookingId))
      .orderBy(rentalMessages.createdAt);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/bookings/[id]/messages - Send a message
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
    const validatedData = sendMessageSchema.parse(body);

    // Verify user has access to this booking
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

    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to send messages for this booking" },
        { status: 403 }
      );
    }

    // Create message
    const newMessage = await db.insert(rentalMessages).values({
      bookingId,
      senderId: session.user.id,
      message: validatedData.message,
      attachments: validatedData.attachments || [],
      messageType: validatedData.messageType,
    }).returning();

    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid message data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
