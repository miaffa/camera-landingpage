import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { TaggedUser, TaggedGear, PostCreateResponse } from "@/lib/types/index";
import { eq, desc, and } from "drizzle-orm";
import { uploadMultiplePostImages, deletePostImage } from "@/lib/supabase/storage";

// GET /api/app/posts - Get user's posts
export const GET = withAuthRequired(async (request: NextRequest, { session }) => {
  try {
    const userPosts = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        images: posts.images,
        location: posts.location,
        taggedUsers: posts.taggedUsers,
        taggedGear: posts.taggedGear,
        likesCount: posts.likesCount,
        commentsCount: posts.commentsCount,
        sharesCount: posts.sharesCount,
        isPublic: posts.isPublic,
        isArchived: posts.isArchived,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        // Author information
        authorName: users.name,
        authorUsername: users.email, // Using email as username for now
        authorAvatar: users.image,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.authorId, session.user.id))
      .orderBy(desc(posts.createdAt));

    return NextResponse.json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
});

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

    // Upload images to Supabase Storage (if configured)
    let imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        console.log(`Uploading ${imageFiles.length} images for user ${session.user.id}`);
        const uploadResults = await uploadMultiplePostImages(
          imageFiles,
          `temp-${Date.now()}`, // Temporary post ID, will be updated after post creation
          session.user.id
        );
        imageUrls = uploadResults.map(result => result.url);
        console.log(`Successfully uploaded images:`, imageUrls);
      } catch (error) {
        console.error("Error uploading images:", error);
        // If Supabase is not configured, fall back to storing file names
        if (error instanceof Error && error.message.includes('not configured')) {
          console.warn("Supabase not configured, storing file names instead of URLs");
          imageUrls = imageFiles.map(file => file.name);
        } else {
          return NextResponse.json(
            { error: `Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
          );
        }
      }
    }

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

// PUT /api/app/posts - Update existing post
export const PUT = withAuthRequired(async (request: NextRequest, { session }) => {
  try {
    const formData = await request.formData();
    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;
    const location = formData.get("location") as string;
    const taggedUsers = formData.get("taggedUsers") as string;
    const taggedGear = formData.get("taggedGear") as string;
    const existingImages = formData.get("existingImages") as string;
    const removedImages = formData.get("removedImages") as string;
    
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Verify the post belongs to the user
    const existingPost = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.authorId, session.user.id)))
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

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
            const path = urlParts.slice(-3).join('/'); // Get the last 3 parts (posts/userId/filename)
            await deletePostImage(path);
          } catch (error) {
            console.error("Error deleting image:", error);
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
        console.log(`Uploading ${imageFiles.length} new images for post ${postId}`);
        const uploadResults = await uploadMultiplePostImages(
          imageFiles,
          postId,
          session.user.id
        );
        newImageUrls = uploadResults.map(result => result.url);
        console.log(`Successfully uploaded new images:`, newImageUrls);
      } catch (error) {
        console.error("Error uploading new images:", error);
        return NextResponse.json(
          { error: `Failed to upload new images: ${error instanceof Error ? error.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

    // Combine existing images (minus removed ones) with new images
    const finalImageUrls = [
      ...existingImageUrls.filter(url => !removedImageUrls.includes(url)),
      ...newImageUrls
    ];

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );
    }

    // Update the post
    const updatedPost = await db
      .update(posts)
      .set({
        content: content.trim(),
        images: finalImageUrls,
        location: location || null,
        taggedUsers: usersArray.map(user => user.id),
        taggedGear: gearArray.map(gear => gear.id),
        updatedAt: new Date(),
      })
      .where(and(eq(posts.id, postId), eq(posts.authorId, session.user.id)))
      .returning();

    const response: PostCreateResponse = {
      message: "Post updated successfully",
      post: updatedPost[0]
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
});
