import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { commentLikes, postComments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const POST = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const params = await context.params;
    const commentId = params.id as string;
    const userId = session.user.id;

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    // Check if comment exists
    const comment = await db
      .select()
      .from(postComments)
      .where(eq(postComments.id, commentId))
      .limit(1);

    if (comment.length === 0) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if already liked
    const existingLike = await db
      .select()
      .from(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));

    if (existingLike.length > 0) {
      return NextResponse.json({ message: "Comment already liked" }, { status: 200 });
    }

    // Create the like
    await db.insert(commentLikes).values({
      commentId,
      userId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 }
    );
  }
});

export const DELETE = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const params = await context.params;
    const commentId = params.id as string;
    const userId = session.user.id;

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    // Remove the like
    await db
      .delete(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unliking comment:", error);
    return NextResponse.json(
      { error: "Failed to unlike comment" },
      { status: 500 }
    );
  }
});
