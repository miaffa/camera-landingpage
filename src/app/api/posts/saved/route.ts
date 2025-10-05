import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postSaves, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

// GET /api/posts/saved - Get user's saved posts
export const GET = withAuthRequired(async (req, context) => {
  const { session } = context;

  try {
    const userId = session.user.id;

    // Get saved posts with post details and author information
    const savedPosts = await db
      .select({
        // Post details
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
        authorUsername: users.email, // Use email as username for now
        authorAvatar: users.image, // Use image field
        // Save information
        savedAt: postSaves.createdAt,
      })
      .from(postSaves)
      .innerJoin(posts, eq(postSaves.postId, posts.id))
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(postSaves.userId, userId))
      .orderBy(desc(postSaves.createdAt));

    return NextResponse.json(savedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved posts" },
      { status: 500 }
    );
  }
});
