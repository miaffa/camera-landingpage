import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

// GET /api/posts - Get all public posts for feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const allPosts = await db
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
        authorUsername: users.email, // Use email as username for now
        authorAvatar: users.image, // Use image field
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(and(
        eq(posts.isPublic, true),
        eq(posts.isArchived, false)
      ))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
