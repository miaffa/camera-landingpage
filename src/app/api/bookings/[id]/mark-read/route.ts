import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { rentalMessages } from "@/db/schema/bookings";
import { eq, and, isNull } from "drizzle-orm";

// POST /api/bookings/[id]/mark-read - Mark all messages in a conversation as read
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

    // Mark all unread messages in this conversation as read
    await db
      .update(rentalMessages)
      .set({
        readAt: new Date(),
      })
      .where(
        and(
          eq(rentalMessages.bookingId, bookingId),
          isNull(rentalMessages.readAt) // Only unread messages
        )
      );

    return NextResponse.json({
      success: true,
      message: "Messages marked as read"
    });

  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
