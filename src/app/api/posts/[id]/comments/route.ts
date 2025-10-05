import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { postComments, posts, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// GET /api/posts/[id]/comments - Get comments for a post
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  try {
    const params = await context.params;
    const postId = params.id as string;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const comments = await db
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
      .where(eq(postComments.postId, postId))
      .orderBy(desc(postComments.createdAt));

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
};

// POST /api/posts/[id]/comments - Create a new comment
export const POST = withAuthRequired(async (req, context) => {
  const { session } = context;
  try {
    const params = await context.params;
    const postId = params.id as string;
    const { content, parentCommentId } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Verify the post exists
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

    // Create the comment
    const newComment = await db
      .insert(postComments)
      .values({
        postId,
        authorId: session.user.id,
        content: content.trim(),
        parentCommentId: parentCommentId || null,
      })
      .returning();

    // Update the post's comment count
    await db
      .update(posts)
      .set({
        commentsCount: (post[0]?.commentsCount || 0) + 1,
      })
      .where(eq(posts.id, postId));

    // Fetch the comment with author information
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
      .where(eq(postComments.id, newComment[0].id))
      .limit(1);

    return NextResponse.json(commentWithAuthor[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
});
