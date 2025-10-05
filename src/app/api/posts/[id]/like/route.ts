import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postLikes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

// POST /api/posts/[id]/like - Like a post
export const POST = withAuthRequired(async (req, context) => {
  const { session } = context;
  const params = await context.params;
  const postId = params.id as string;

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID is required" },
      { status: 400 }
    );
  }

  try {
    const userId = session.user.id;

    // Check if post exists
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if user already liked this post
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      return NextResponse.json(
        { error: "Post already liked" },
        { status: 400 }
      );
    }

    // Add like
    await db.insert(postLikes).values({
      postId,
      userId,
    });

    // Update likes count
    await db
      .update(posts)
      .set({
        likesCount: (post[0]?.likesCount || 0) + 1,
      })
      .where(eq(posts.id, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
});

// DELETE /api/posts/[id]/like - Unlike a post
export const DELETE = withAuthRequired(async (req, context) => {
  const { session } = context;
  const params = await context.params;
  const postId = params.id as string;

  if (!postId) {
    return NextResponse.json(
      { error: "Post ID is required" },
      { status: 400 }
    );
  }

  try {
    const userId = session.user.id;

    // Check if post exists
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if user has liked this post
    const existingLike = await db
      .select()
      .from(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike.length === 0) {
      return NextResponse.json(
        { error: "Post not liked" },
        { status: 400 }
      );
    }

    // Remove like
    await db
      .delete(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      );

    // Update likes count
    await db
      .update(posts)
      .set({
        likesCount: Math.max(0, (post[0]?.likesCount || 0) - 1),
      })
      .where(eq(posts.id, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unliking post:", error);
    return NextResponse.json(
      { error: "Failed to unlike post" },
      { status: 500 }
    );
  }
});
