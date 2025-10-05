import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { postComments, posts, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// PUT /api/posts/[id]/comments/[commentId] - Update a comment
export const PUT = withAuthRequired(async (req, context) => {
  const { session } = context;
  try {
    const params = await context.params;
    const postId = params.id as string;
    const commentId = params.commentId as string;
    const { content } = await req.json();

    if (!postId || !commentId) {
      return NextResponse.json(
        { error: "Post ID and Comment ID are required" },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Verify the comment exists and belongs to the user
    const existingComment = await db
      .select()
      .from(postComments)
      .where(and(
        eq(postComments.id, commentId),
        eq(postComments.postId, postId),
        eq(postComments.authorId, session.user.id)
      ))
      .limit(1);

    if (existingComment.length === 0) {
      return NextResponse.json(
        { error: "Comment not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update the comment
    await db
      .update(postComments)
      .set({
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(postComments.id, commentId),
        eq(postComments.postId, postId),
        eq(postComments.authorId, session.user.id)
      ))
      .returning();

    // Fetch the updated comment with author information
    const commentWithAuthor = await db
      .select({
        id: postComments.id,
        postId: postComments.postId,
        authorId: postComments.authorId,
        content: postComments.content,
        parentCommentId: postComments.parentCommentId,
        createdAt: postComments.createdAt,
        updatedAt: postComments.updatedAt,
        // Author information
        authorName: users.name,
        authorUsername: users.email,
        authorAvatar: users.image,
      })
      .from(postComments)
      .leftJoin(users, eq(postComments.authorId, users.id))
      .where(eq(postComments.id, commentId))
      .limit(1);

    return NextResponse.json(commentWithAuthor[0]);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
});

// DELETE /api/posts/[id]/comments/[commentId] - Delete a comment
export const DELETE = withAuthRequired(async (req, context) => {
  const { session } = context;
  try {
    const params = await context.params;
    const postId = params.id as string;
    const commentId = params.commentId as string;

    if (!postId || !commentId) {
      return NextResponse.json(
        { error: "Post ID and Comment ID are required" },
        { status: 400 }
      );
    }

    // Verify the comment exists and belongs to the user
    const existingComment = await db
      .select()
      .from(postComments)
      .where(and(
        eq(postComments.id, commentId),
        eq(postComments.postId, postId),
        eq(postComments.authorId, session.user.id)
      ))
      .limit(1);

    if (existingComment.length === 0) {
      return NextResponse.json(
        { error: "Comment not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the comment
    await db
      .delete(postComments)
      .where(and(
        eq(postComments.id, commentId),
        eq(postComments.postId, postId),
        eq(postComments.authorId, session.user.id)
      ));

    // Update the post's comment count
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length > 0 && post[0]) {
      await db
        .update(posts)
        .set({
          commentsCount: Math.max(0, (post[0].commentsCount || 0) - 1),
        })
        .where(eq(posts.id, postId));
    }

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
});
