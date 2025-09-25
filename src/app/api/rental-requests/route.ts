import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth/requireUser';
import { db } from '@/db';
import { rentalRequests } from '@/db/schema/rental';
import { gear } from '@/db/schema/gear';
import { profiles } from '@/db/schema/user';
import { eq, or } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const {
      gearId,
      startDate,
      endDate,
      pickupLocation,
      deliveryAddress,
      deliveryRequested,
      totalCost,
    } = body;

    // Validate required fields
    if (!gearId || !startDate || !endDate || !totalCost) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get gear details to find owner
    const gearItem = await db
      .select({
        id: gear.id,
        name: gear.name,
        images: gear.images,
        userId: gear.userId,
      })
      .from(gear)
      .where(eq(gear.id, gearId))
      .limit(1);

    if (!gearItem[0]) {
      return NextResponse.json(
        { error: 'Gear not found' },
        { status: 404 }
      );
    }

    // Check if user is trying to rent their own gear
    if (gearItem[0].userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot rent your own gear' },
        { status: 400 }
      );
    }

    // Create rental request
    const rentalRequest = await db
      .insert(rentalRequests)
      .values({
        gearId,
        renterId: user.id,
        ownerId: gearItem[0].userId,
        gearName: gearItem[0].name,
        gearImage: gearItem[0].images?.[0] || null,
        totalCost: totalCost.toString(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        pickupLocation,
        deliveryAddress: deliveryRequested ? deliveryAddress : null,
        deliveryRequested: deliveryRequested || false,
        status: 'pending',
      })
      .returning();

    return NextResponse.json(rentalRequest[0]);
  } catch (error) {
    console.error('Error creating rental request:', error);
    return NextResponse.json(
      { error: 'Failed to create rental request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, sent, received

    let whereCondition;
    if (type === 'sent') {
      whereCondition = eq(rentalRequests.renterId, user.id);
    } else if (type === 'received') {
      whereCondition = eq(rentalRequests.ownerId, user.id);
    } else {
      // all - both sent and received
      whereCondition = or(
        eq(rentalRequests.renterId, user.id),
        eq(rentalRequests.ownerId, user.id)
      );
    }

    const requests = await db
      .select({
        id: rentalRequests.id,
        gearId: rentalRequests.gearId,
        gearName: rentalRequests.gearName,
        gearImage: rentalRequests.gearImage,
        totalCost: rentalRequests.totalCost,
        status: rentalRequests.status,
        startDate: rentalRequests.startDate,
        endDate: rentalRequests.endDate,
        pickupLocation: rentalRequests.pickupLocation,
        deliveryRequested: rentalRequests.deliveryRequested,
        createdAt: rentalRequests.createdAt,
        // Owner info
        ownerId: profiles.id,
        ownerName: profiles.fullName,
        ownerUsername: profiles.username,
        ownerAvatar: profiles.avatarUrl,
        ownerVerified: profiles.isVerified,
      })
      .from(rentalRequests)
      .leftJoin(profiles, eq(rentalRequests.ownerId, profiles.id))
      .where(whereCondition);

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching rental requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rental requests' },
      { status: 500 }
    );
  }
}
