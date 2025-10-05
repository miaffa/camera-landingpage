import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { bookings, rentalMessages } from "@/db/schema/bookings";
import { gearListings } from "@/db/schema/gear";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { z } from "zod";

// Validation schemas
const createBookingSchema = z.object({
  gearId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  renterMessage: z.string().optional(),
  pickupLocation: z.string().optional(),
  returnLocation: z.string().optional(),
});

const updateBookingStatusSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(["pending", "approved", "paid", "active", "returned", "completed", "cancelled", "disputed"]),
  message: z.string().optional(),
});

// GET /api/bookings - Get user's bookings (as renter or owner)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "rented" or "owned"
    const status = searchParams.get("status"); // Filter by status

    // Build where conditions
    const whereConditions = [];
    
    // Filter by user role
    if (type === "rented") {
      whereConditions.push(eq(bookings.renterId, session.user.id));
    } else if (type === "owned") {
      whereConditions.push(eq(bookings.ownerId, session.user.id));
    } else {
      // Get all bookings where user is either renter or owner
      whereConditions.push(
        or(
          eq(bookings.renterId, session.user.id),
          eq(bookings.ownerId, session.user.id)
        )
      );
    }

    // Filter by status if provided
    if (status) {
      whereConditions.push(eq(bookings.status, status as "pending" | "approved" | "paid" | "active" | "returned" | "completed" | "cancelled" | "disputed"));
    }

    const userBookings = await db
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
        status: bookings.status,
        renterMessage: bookings.renterMessage,
        ownerMessage: bookings.ownerMessage,
        pickupLocation: bookings.pickupLocation,
        returnLocation: bookings.returnLocation,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        // Gear details
        gearName: gearListings.name,
        gearCategory: gearListings.category,
        gearImages: gearListings.images,
        gearCondition: gearListings.condition,
      })
      .from(bookings)
      .leftJoin(gearListings, eq(bookings.gearId, gearListings.id))
      .where(and(...whereConditions))
      .orderBy(bookings.createdAt);

    return NextResponse.json(userBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create new booking request
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Get gear details
    const gear = await db
      .select()
      .from(gearListings)
      .where(eq(gearListings.id, validatedData.gearId))
      .limit(1);

    if (gear.length === 0) {
      return NextResponse.json(
        { error: "Gear not found" },
        { status: 404 }
      );
    }

    const gearData = gear[0];

    // Check if user is trying to rent their own gear
    if (gearData.ownerId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot rent your own gear" },
        { status: 400 }
      );
    }

    // Check if gear is available
    if (!gearData.isAvailable) {
      return NextResponse.json(
        { error: "Gear is not available for rental" },
        { status: 400 }
      );
    }

    // Check for date conflicts
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);

    // Check if dates are valid
    if (startDate >= endDate) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Check for existing bookings in this date range
    const conflictingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.gearId, validatedData.gearId),
          or(
            // New booking starts during existing booking
            and(
              gte(bookings.startDate, startDate),
              lte(bookings.startDate, endDate)
            ),
            // New booking ends during existing booking
            and(
              gte(bookings.endDate, startDate),
              lte(bookings.endDate, endDate)
            ),
            // New booking encompasses existing booking
            and(
              lte(bookings.startDate, startDate),
              gte(bookings.endDate, endDate)
            )
          ),
          or(
            eq(bookings.status, "pending"),
            eq(bookings.status, "approved"),
            eq(bookings.status, "paid"),
            eq(bookings.status, "active")
          )
        )
      );

    if (conflictingBookings.length > 0) {
      return NextResponse.json(
        { error: "Gear is not available for the selected dates" },
        { status: 400 }
      );
    }

    // Calculate pricing
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = parseFloat(gearData.pricePerDay);
    const totalAmount = dailyRate * totalDays;
    const platformFee = totalAmount * 0.10; // 10% platform fee
    const ownerAmount = totalAmount - (platformFee / 2); // 5% from owner
    const renterAmount = totalAmount + (platformFee / 2); // 5% from renter

    // Create booking
    const newBooking = await db.insert(bookings).values({
      renterId: session.user.id,
      ownerId: gearData.ownerId,
      gearId: validatedData.gearId,
      startDate,
      endDate,
      totalDays,
      dailyRate: dailyRate.toString(),
      totalAmount: totalAmount.toString(),
      platformFee: platformFee.toString(),
      ownerAmount: ownerAmount.toString(),
      renterAmount: renterAmount.toString(),
      renterMessage: validatedData.renterMessage,
      pickupLocation: validatedData.pickupLocation,
      returnLocation: validatedData.returnLocation,
      status: "pending",
      statusHistory: [{
        status: "pending",
        timestamp: new Date(),
        note: "Booking request created"
      }],
    }).returning();

    // Create initial message in rentalMessages table
    if (validatedData.renterMessage) {
      await db.insert(rentalMessages).values({
        bookingId: newBooking[0].id,
        senderId: session.user.id,
        message: validatedData.renterMessage,
        messageType: "text",
        isSystemMessage: false,
      });
    }

    // Also create a system message about the booking
    await db.insert(rentalMessages).values({
      bookingId: newBooking[0].id,
      senderId: session.user.id,
      message: `Booking request created for ${gearData.name} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      messageType: "system",
      isSystemMessage: true,
    });

    return NextResponse.json(newBooking[0], { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PUT /api/bookings - Update booking status
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateBookingStatusSchema.parse(body);

    // Get booking details
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, validatedData.bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = booking[0];

    // Check if user has permission to update this booking
    if (bookingData.renterId !== session.user.id && bookingData.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this booking" },
        { status: 403 }
      );
    }

    // Update status and add to history
    const statusHistory = [
      ...(bookingData.statusHistory || []),
      {
        status: validatedData.status,
        timestamp: new Date(),
        note: validatedData.message || `Status changed to ${validatedData.status}`
      }
    ];

    const updatedBooking = await db
      .update(bookings)
      .set({
        status: validatedData.status,
        statusHistory,
        updatedAt: new Date(),
        ...(validatedData.status === "approved" && { approvedAt: new Date() }),
        ...(validatedData.status === "paid" && { paidAt: new Date() }),
        ...(validatedData.status === "active" && { pickupAt: new Date() }),
        ...(validatedData.status === "returned" && { returnAt: new Date() }),
        ...(validatedData.status === "completed" && { completedAt: new Date() }),
      })
      .where(eq(bookings.id, validatedData.bookingId))
      .returning();

    return NextResponse.json(updatedBooking[0]);
  } catch (error) {
    console.error("Error updating booking:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
