import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { postLikes, postSaves } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import withAuthRequired from "@/lib/auth/withAuthRequired";

// GET /api/posts/user-interactions - Get user's likes and saves for specific posts
export const GET = withAuthRequired(async (req, context) => {
  const { session } = context;
  const { searchParams } = new URL(req.url);
  const postIds = searchParams.get("postIds");

  if (!postIds) {
    return NextResponse.json(
      { error: "Post IDs are required" },
      { status: 400 }
    );
  }

  try {
    const userId = session.user.id;
    const postIdArray = postIds.split(",");

    // Get user's likes for these posts
    const likes = await db
      .select({
        postId: postLikes.postId,
      })
      .from(postLikes)
      .where(
        and(
          eq(postLikes.userId, userId),
          inArray(postLikes.postId, postIdArray)
        )
      );

    // Get user's saves for these posts
    const saves = await db
      .select({
        postId: postSaves.postId,
      })
      .from(postSaves)
      .where(
        and(
          eq(postSaves.userId, userId),
          inArray(postSaves.postId, postIdArray)
        )
      );

    // Convert to sets for easy lookup
    const likedPostIds = new Set(likes.map(like => like.postId));
    const savedPostIds = new Set(saves.map(save => save.postId));

    // Create response object
    const interactions: Record<string, { liked: boolean; saved: boolean }> = {};
    
    postIdArray.forEach(postId => {
      interactions[postId] = {
        liked: likedPostIds.has(postId),
        saved: savedPostIds.has(postId),
      };
    });

    return NextResponse.json(interactions);
  } catch (error) {
    console.error("Error fetching user interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user interactions" },
      { status: 500 }
    );
  }
});
