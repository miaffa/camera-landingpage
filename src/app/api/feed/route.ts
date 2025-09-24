import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { posts, postLikes, postComments, postBookmarks } from "@/db/schema/posts";
import { users } from "@/db/schema/user";
import { gear, postGear } from "@/db/schema/gear";
import { eq, desc, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Fetch posts with user info and gear
    const feedPosts = await db
      .select({
        id: posts.id,
        caption: posts.caption,
        location: posts.location,
        imageUrl: posts.imageUrl,
        imageAlt: posts.imageAlt,
        createdAt: posts.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.isActive, true))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // For each post, fetch likes, comments, and gear
    const postsWithDetails = await Promise.all(
      feedPosts.map(async (post) => {
        // Get likes count
        const likesCount = await db
          .select({ count: posts.id })
          .from(postLikes)
          .where(eq(postLikes.postId, post.id));

        // Get comments count
        const commentsCount = await db
          .select({ count: posts.id })
          .from(postComments)
          .where(and(eq(postComments.postId, post.id), eq(postComments.isActive, true)));

        // Check if current user liked this post
        const userLike = await db
          .select()
          .from(postLikes)
          .where(and(eq(postLikes.postId, post.id), eq(postLikes.userId, session.user.id)))
          .limit(1);

        // Check if current user bookmarked this post
        const userBookmark = await db
          .select()
          .from(postBookmarks)
          .where(and(eq(postBookmarks.postId, post.id), eq(postBookmarks.userId, session.user.id)))
          .limit(1);

        // Get linked gear
        const linkedGear = await db
          .select({
            id: gear.id,
            name: gear.name,
            brand: gear.brand,
            model: gear.model,
            dailyRate: gear.dailyRate,
            condition: gear.condition,
          })
          .from(postGear)
          .innerJoin(gear, eq(postGear.gearId, gear.id))
          .where(and(eq(postGear.postId, post.id), eq(gear.isAvailable, true)));

        return {
          ...post,
          likes: likesCount.length,
          comments: commentsCount.length,
          isLiked: userLike.length > 0,
          isBookmarked: userBookmark.length > 0,
          gear: linkedGear,
        };
      })
    );

    return NextResponse.json({
      posts: postsWithDetails,
      pagination: {
        page,
        limit,
        hasMore: feedPosts.length === limit,
      },
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
