import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, rentalMessages } from "@/db/schema/bookings";
import { users } from "@/db/schema/user";
import { eq, and, desc, or, isNull, sql } from "drizzle-orm";

// GET /api/messages/conversations - Get user's conversations from bookings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all bookings where user is either renter or owner
    const userBookings = await db
      .select({
        id: bookings.id,
        renterId: bookings.renterId,
        ownerId: bookings.ownerId,
        gearId: bookings.gearId,
        status: bookings.status,
        createdAt: bookings.createdAt,
        // Renter details
        renterName: users.name,
        renterEmail: users.email,
        renterImage: users.image,
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.renterId, users.id))
      .where(
        and(
          or(
            eq(bookings.renterId, session.user.id),
            eq(bookings.ownerId, session.user.id)
          )
        )
      )
      .orderBy(desc(bookings.createdAt));

    // Get owner details for each booking
    const conversations = await Promise.all(
      userBookings.map(async (booking) => {
        // Get owner details
        const ownerDetails = await db
          .select({
            name: users.name,
            email: users.email,
            image: users.image,
          })
          .from(users)
          .where(eq(users.id, booking.ownerId))
          .limit(1);

        // Get last message for this booking
        const lastMessage = await db
          .select({
            message: rentalMessages.message,
            createdAt: rentalMessages.createdAt,
            senderId: rentalMessages.senderId,
          })
          .from(rentalMessages)
          .where(eq(rentalMessages.bookingId, booking.id))
          .orderBy(desc(rentalMessages.createdAt))
          .limit(1);

        // Get unread count for this booking (messages from the other person)
        const otherPersonId = session.user.id === booking.renterId ? booking.ownerId : booking.renterId;
        const unreadCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(rentalMessages)
          .where(
            and(
              eq(rentalMessages.bookingId, booking.id),
              eq(rentalMessages.senderId, otherPersonId), // Messages from the other person
              isNull(rentalMessages.readAt) // Not read yet
            )
          );

        const owner = ownerDetails[0];
        const lastMsg = lastMessage[0];

        return {
          id: booking.id,
          bookingId: booking.id,
          // Show the other person's details (not the current user)
          name: session.user.id === booking.renterId ? owner?.name : booking.renterName,
          email: session.user.id === booking.renterId ? owner?.email : booking.renterEmail,
          avatar: session.user.id === booking.renterId ? owner?.image : booking.renterImage,
          lastMessage: lastMsg?.message || "Booking request sent",
          timestamp: lastMsg?.createdAt || booking.createdAt,
          unreadCount: unreadCount[0]?.count || 0,
          isOnline: false, // We don't track online status yet
          status: booking.status,
        };
      })
    );

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
