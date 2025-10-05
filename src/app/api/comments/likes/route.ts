import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { commentLikes } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";

export const GET = withAuthRequired(async (req, context) => {
  try {
    const { session } = context;
    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const commentIds = searchParams.get("commentIds");

    if (!commentIds) {
      return NextResponse.json({ error: "Comment IDs are required" }, { status: 400 });
    }

    const commentIdArray = commentIds.split(",");

    // Get all likes for the specified comments by the current user
    const likes = await db
      .select({
        commentId: commentLikes.commentId,
      })
      .from(commentLikes)
      .where(
        and(
          eq(commentLikes.userId, userId),
          inArray(commentLikes.commentId, commentIdArray)
        )
      );

    // Convert to a set for easy lookup
    const likedCommentIds = new Set(likes.map(like => like.commentId));

    // Return an object with comment ID as key and boolean as value
    const result = commentIdArray.reduce((acc, commentId) => {
      acc[commentId] = likedCommentIds.has(commentId);
      return acc;
    }, {} as Record<string, boolean>);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment likes" },
      { status: 500 }
    );
  }
});
