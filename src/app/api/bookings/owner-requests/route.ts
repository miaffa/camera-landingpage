import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { gearListings } from "@/db/schema/gear";
import { users } from "@/db/schema/user";
import { eq, desc } from "drizzle-orm";

// GET /api/bookings/owner-requests - Get all booking requests for the current user's gear
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all bookings where current user is the owner
    const ownerBookings = await db
      .select({
        id: bookings.id,
        renterId: bookings.renterId,
        ownerId: bookings.ownerId,
        gearId: bookings.gearId,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalDays: bookings.totalDays,
        dailyRate: bookings.dailyRate,
        totalAmount: bookings.totalAmount,
        renterMessage: bookings.renterMessage,
        status: bookings.status,
        createdAt: bookings.createdAt,
        // Renter details
        renterName: users.name,
        renterEmail: users.email,
        renterImage: users.image,
        // Gear details
        gearName: gearListings.name,
        gearCategory: gearListings.category,
        gearImages: gearListings.images,
      })
      .from(bookings)
      .leftJoin(gearListings, eq(bookings.gearId, gearListings.id))
      .leftJoin(users, eq(bookings.renterId, users.id))
      .where(eq(bookings.ownerId, session.user.id))
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json(ownerBookings);

  } catch (error) {
    console.error("Error fetching owner booking requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking requests" },
      { status: 500 }
    );
  }
}
