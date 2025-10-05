import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postSaves } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

// POST /api/posts/[id]/save - Save a post
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

    // Check if user already saved this post
    const existingSave = await db
      .select()
      .from(postSaves)
      .where(
        and(
          eq(postSaves.postId, postId),
          eq(postSaves.userId, userId)
        )
      )
      .limit(1);

    if (existingSave.length > 0) {
      return NextResponse.json(
        { error: "Post already saved" },
        { status: 400 }
      );
    }

    // Add save
    await db.insert(postSaves).values({
      postId,
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json(
      { error: "Failed to save post" },
      { status: 500 }
    );
  }
});

// DELETE /api/posts/[id]/save - Unsave a post
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

    // Check if user has saved this post
    const existingSave = await db
      .select()
      .from(postSaves)
      .where(
        and(
          eq(postSaves.postId, postId),
          eq(postSaves.userId, userId)
        )
      )
      .limit(1);

    if (existingSave.length === 0) {
      return NextResponse.json(
        { error: "Post not saved" },
        { status: 400 }
      );
    }

    // Remove save
    await db
      .delete(postSaves)
      .where(
        and(
          eq(postSaves.postId, postId),
          eq(postSaves.userId, userId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unsaving post:", error);
    return NextResponse.json(
      { error: "Failed to unsave post" },
      { status: 500 }
    );
  }
});
