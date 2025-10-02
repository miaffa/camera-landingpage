import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { TaggedUser, TaggedGear, PostCreateResponse } from "@/lib/types/index";

export const POST = withAuthRequired(async (request: NextRequest, { session }) => {
  try {
    const formData = await request.formData();
    const content = formData.get("content") as string;
    const location = formData.get("location") as string;
    const taggedUsers = formData.get("taggedUsers") as string;
    const taggedGear = formData.get("taggedGear") as string;
    
    // Parse tagged users from JSON string
    let usersArray: TaggedUser[] = [];
    if (taggedUsers) {
      try {
        usersArray = JSON.parse(taggedUsers) as TaggedUser[];
      } catch (error) {
        console.error("Error parsing tagged users:", error);
        return NextResponse.json(
          { error: "Invalid tagged users format" },
          { status: 400 }
        );
      }
    }
    
    // Parse tagged gear from JSON string
    let gearArray: TaggedGear[] = [];
    if (taggedGear) {
      try {
        gearArray = JSON.parse(taggedGear) as TaggedGear[];
      } catch (error) {
        console.error("Error parsing tagged gear:", error);
        return NextResponse.json(
          { error: "Invalid tagged gear format" },
          { status: 400 }
        );
      }
    }

    // Handle image uploads
    const imageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("image") && value instanceof File) {
        imageFiles.push(value);
      }
    }

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );
    }

    // TODO: Upload images to storage (e.g., Supabase Storage, S3)
    // For now, we'll just store the file names
    const imageUrls = imageFiles.map(file => file.name);

    // Create the post
    const newPost = await db
      .insert(posts)
      .values({
        authorId: session.user.id,
        content: content.trim(),
        images: imageUrls,
        location: location || null,
        taggedUsers: usersArray.map(user => user.id), // Convert to string array of IDs
        taggedGear: gearArray.map(gear => gear.id), // Convert to string array of IDs
        // createdAt and updatedAt are handled by defaultNow() in schema
      })
      .returning();

    const response: PostCreateResponse = {
      message: "Post created successfully",
      post: newPost[0]
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
});
