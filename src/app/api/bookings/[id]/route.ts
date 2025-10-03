import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { gearListings } from "@/db/schema/gear";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";

// GET /api/bookings/[id] - Get booking details
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

    // Get booking with gear and user details
    const booking = await db
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
        platformFee: bookings.platformFee,
        ownerAmount: bookings.ownerAmount,
        renterAmount: bookings.renterAmount,
        renterMessage: bookings.renterMessage,
        pickupLocation: bookings.pickupLocation,
        returnLocation: bookings.returnLocation,
        status: bookings.status,
        statusHistory: bookings.statusHistory,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        // Gear details
        gearName: gearListings.name,
        gearCategory: gearListings.category,
        gearDescription: gearListings.description,
        gearPricePerDay: gearListings.pricePerDay,
        gearCondition: gearListings.condition,
        gearLocation: gearListings.location,
        gearImages: gearListings.images,
        // Renter details
        renterName: users.name,
        renterEmail: users.email,
        renterImage: users.image,
      })
      .from(bookings)
      .leftJoin(gearListings, eq(bookings.gearId, gearListings.id))
      .leftJoin(users, eq(bookings.renterId, users.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Check if user has access to this booking
    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to view this booking" },
        { status: 403 }
      );
    }

    return NextResponse.json(bookingData);

  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}