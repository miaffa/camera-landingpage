import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { gearListings } from "@/db/schema/gear";
import { eq, and } from "drizzle-orm";
import { uploadMultipleGearImages, deleteGearImage } from "@/lib/supabase/storage";

// GET /api/gear - Get user's gear listings
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userGear = await db
      .select()
      .from(gearListings)
      .where(eq(gearListings.ownerId, session.user.id))
      .orderBy(gearListings.createdAt);

    return NextResponse.json(userGear);
  } catch (error) {
    console.error("Error fetching user gear:", error);
    return NextResponse.json(
      { error: "Failed to fetch gear listings" },
      { status: 500 }
    );
  }
}

// POST /api/gear - Create new gear listing
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if this is a multipart form (with images) or JSON
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      // Handle multipart form data with images
      const formData = await request.formData();
      
      const name = formData.get("name") as string;
      const category = formData.get("category") as string;
      const description = formData.get("description") as string;
      const price = formData.get("price") as string;
      const condition = formData.get("condition") as string;
      const location = formData.get("location") as string;
      const availability = formData.get("availability") as string;

      // Validate required fields
      if (!name || !category || !price || !condition) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Handle image uploads
      const imageFiles: File[] = [];
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("image") && value instanceof File) {
          imageFiles.push(value);
        }
      }

      // Upload images to Supabase Storage (if configured)
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          console.log(`Uploading ${imageFiles.length} gear images for user ${session.user.id}`);
          const uploadResults = await uploadMultipleGearImages(
            imageFiles,
            `temp-${Date.now()}`, // Temporary gear ID, will be updated after gear creation
            session.user.id
          );
          imageUrls = uploadResults.map(result => result.url);
          console.log(`Successfully uploaded gear images:`, imageUrls);
        } catch (error) {
          console.error("Error uploading gear images:", error);
          // If Supabase is not configured, fall back to storing file names
          if (error instanceof Error && error.message.includes('not configured')) {
            console.warn("Supabase not configured, storing file names instead of URLs");
            imageUrls = imageFiles.map(file => file.name);
          } else {
            return NextResponse.json(
              { error: `Failed to upload gear images: ${error instanceof Error ? error.message : 'Unknown error'}` },
              { status: 500 }
            );
          }
        }
      }

      // Parse availability if provided
      let availabilityData = null;
      if (availability) {
        try {
          availabilityData = JSON.parse(availability);
        } catch (e) {
          console.warn("Failed to parse availability data");
        }
      }

      const newGear = await db.insert(gearListings).values({
        name,
        category,
        description: description || "",
        pricePerDay: price.toString(),
        condition,
        location: location || "",
        images: imageUrls, // Now stores URLs or filenames
        availableFrom: availabilityData?.startDate ? new Date(availabilityData.startDate) : null,
        availableUntil: availabilityData?.endDate ? new Date(availabilityData.endDate) : null,
        isAvailable: availabilityData?.available ?? true,
        ownerId: session.user.id,
      }).returning();

      return NextResponse.json(newGear[0], { status: 201 });
    } else {
      // Handle JSON data (no images)
      const body = await request.json();
      const {
        name,
        category,
        description,
        price,
        condition,
        location,
        images,
        availability,
      } = body;

      // Validate required fields
      if (!name || !category || !price || !condition) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const newGear = await db.insert(gearListings).values({
        name,
        category,
        description: description || "",
        pricePerDay: price.toString(),
        condition,
        location: location || "",
        images: images || [],
        availableFrom: availability?.startDate ? new Date(availability.startDate) : null,
        availableUntil: availability?.endDate ? new Date(availability.endDate) : null,
        isAvailable: availability?.available ?? true,
        ownerId: session.user.id,
      }).returning();

      return NextResponse.json(newGear[0], { status: 201 });
    }
  } catch (error) {
    console.error("Error creating gear:", error);
    return NextResponse.json(
      { error: "Failed to create gear listing" },
      { status: 500 }
    );
  }
}

// PUT /api/gear - Update existing gear listing
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const gearId = formData.get("gearId") as string;
    
    if (!gearId) {
      return NextResponse.json(
        { error: "Gear ID is required" },
        { status: 400 }
      );
    }

    // Verify the gear belongs to the user
    const existingGear = await db
      .select()
      .from(gearListings)
      .where(and(eq(gearListings.id, gearId), eq(gearListings.ownerId, session.user.id)))
      .limit(1);

    if (existingGear.length === 0) {
      return NextResponse.json(
        { error: "Gear not found or unauthorized" },
        { status: 404 }
      );
    }

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const condition = formData.get("condition") as string;
    const location = formData.get("location") as string;
    const availability = formData.get("availability") as string;
    const existingImages = formData.get("existingImages") as string;
    const removedImages = formData.get("removedImages") as string;

    // Validate required fields
    if (!name || !category || !price || !condition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse existing images
    let existingImageUrls: string[] = [];
    if (existingImages) {
      try {
        existingImageUrls = JSON.parse(existingImages) as string[];
      } catch (error) {
        console.error("Error parsing existing images:", error);
      }
    }

    // Parse removed images and delete them from storage
    let removedImageUrls: string[] = [];
    if (removedImages) {
      try {
        removedImageUrls = JSON.parse(removedImages) as string[];
        // Delete removed images from storage
        for (const imageUrl of removedImageUrls) {
          try {
            // Extract path from URL for deletion
            const urlParts = imageUrl.split('/');
            const path = urlParts.slice(-3).join('/'); // Get the last 3 parts (gear/userId/filename)
            await deleteGearImage(path);
          } catch (error) {
            console.error("Error deleting gear image:", error);
          }
        }
      } catch (error) {
        console.error("Error parsing removed images:", error);
      }
    }

    // Handle new image uploads
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image") && value instanceof File) {
        imageFiles.push(value);
      }
    }

    // Upload new images to Supabase Storage
    let newImageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        console.log(`Uploading ${imageFiles.length} new gear images for gear ${gearId}`);
        const uploadResults = await uploadMultipleGearImages(
          imageFiles,
          gearId,
          session.user.id
        );
        newImageUrls = uploadResults.map(result => result.url);
        console.log(`Successfully uploaded new gear images:`, newImageUrls);
      } catch (error) {
        console.error("Error uploading new gear images:", error);
        return NextResponse.json(
          { error: `Failed to upload new gear images: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

    // Combine existing images (minus removed ones) with new images
    const finalImageUrls = [
      ...existingImageUrls.filter(url => !removedImageUrls.includes(url)),
      ...newImageUrls
    ];

    // Parse availability if provided
    let availabilityData = null;
    if (availability) {
      try {
        availabilityData = JSON.parse(availability);
      } catch (e) {
        console.warn("Failed to parse availability data");
      }
    }

    // Update the gear listing
    const updatedGear = await db
      .update(gearListings)
      .set({
        name,
        category,
        description: description || "",
        pricePerDay: price.toString(),
        condition,
        location: location || "",
        images: finalImageUrls,
        availableFrom: availabilityData?.startDate ? new Date(availabilityData.startDate) : null,
        availableUntil: availabilityData?.endDate ? new Date(availabilityData.endDate) : null,
        isAvailable: availabilityData?.available ?? true,
        updatedAt: new Date(),
      })
      .where(and(eq(gearListings.id, gearId), eq(gearListings.ownerId, session.user.id)))
      .returning();

    return NextResponse.json(updatedGear[0]);

  } catch (error) {
    console.error("Error updating gear:", error);
    return NextResponse.json(
      { error: "Failed to update gear listing" },
      { status: 500 }
    );
  }
}
