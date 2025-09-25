import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { posts } from "@/db/schema/posts";
import { gear, postGear } from "@/db/schema/gear";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createMockSession } from "@/lib/mock-session";

const createPostSchema = z.object({
  caption: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().min(1), // Accept relative URLs like "/uploads/filename.jpg"
  images: z.array(z.string().min(1)).optional(), // Accept relative URLs
  imageAlt: z.string().optional(),
  gearIds: z.array(z.string()).optional(),
  taggedUsers: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Posts API - Starting request");
    
    // Development bypass - set to true to disable authentication
    const BYPASS_AUTH = true;
    
    let session = await auth();
    console.log("🚀 Posts API - Original session:", session);
    
    if (BYPASS_AUTH && (!session?.user?.id)) {
      console.log("🚀 Posts API - Creating mock session");
      // Create a mock session for development
      session = createMockSession() as any;
    }
    
    console.log("🚀 Posts API - Current session:", session);
    
    if (!session?.user?.id) {
      console.log("🚀 Posts API - No user ID, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log("🚀 Posts API - Authentication passed, processing post");

    const body = await request.json();
    console.log("🚀 Posts API - Request body:", JSON.stringify(body, null, 2));
    
    const validatedData = createPostSchema.parse(body);
    console.log("🚀 Posts API - Validated data:", JSON.stringify(validatedData, null, 2));

    // Create the post
    console.log("🚀 Posts API - Attempting to insert post into database...");
    console.log("🚀 Posts API - User ID:", session.user.id);
    console.log("🚀 Posts API - Image URL:", validatedData.imageUrl);
    
    // Debug: Check the exact values being inserted
    const insertValues = {
      userId: session.user.id,
      caption: validatedData.caption,
      location: validatedData.location,
      imageUrl: validatedData.imageUrl,
      imageAlt: validatedData.imageAlt,
    };
    console.log("🚀 Posts API - Insert values:", JSON.stringify(insertValues, null, 2));
    console.log("🚀 Posts API - DATABASE_URL:", process.env.DATABASE_URL);
    
    const [newPost] = await db
      .insert(posts)
      .values(insertValues)
      .returning();

    console.log("🚀 Posts API - Post created successfully:", newPost.id);

    // Link gear if provided
    if (validatedData.gearIds && validatedData.gearIds.length > 0) {
      // Verify gear belongs to user
      const userGear = await db
        .select({ id: gear.id })
        .from(gear)
        .where(eq(gear.userId, session.user.id));

      const validGearIds = userGear.map(g => g.id);
      const gearToLink = validatedData.gearIds.filter(id => validGearIds.includes(id));

      if (gearToLink.length > 0) {
        await db.insert(postGear).values(
          gearToLink.map(gearId => ({
            postId: newPost.id,
            gearId: gearId,
          }))
        );
      }
    }

    return NextResponse.json({
      id: newPost.id,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
