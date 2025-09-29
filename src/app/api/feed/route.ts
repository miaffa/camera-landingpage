import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import postgres from "postgres";
import { createMockSession } from "@/lib/mock-session";

export async function GET(request: NextRequest) {
  try {
    // Authentication is now enabled
    const BYPASS_AUTH = false;
    
    let session = await auth();
    if (BYPASS_AUTH && !session?.user?.id) {
      // Create a comprehensive mock session for development
      session = createMockSession();
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Fetch posts with user info using raw SQL with explicit type casting
    const feedPostsQuery = `
      SELECT 
        p.id,
        p.caption,
        p.location,
        p.image_url as "imageUrl",
        p.image_alt as "imageAlt",
        p.created_at as "createdAt",
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.image as user_image
      FROM posts p
      INNER JOIN app_user u ON p.user_id::text = u.id::text
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const client = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');
    console.log('Feed API - Query:', feedPostsQuery);
    console.log('Feed API - Params:', [limit, offset]);
    const feedPostsResult = await client.unsafe(feedPostsQuery, [limit, offset]);
    console.log('Feed API - Result length:', feedPostsResult.length);
    const feedPosts = feedPostsResult.map(row => ({
      id: row.id,
      caption: row.caption,
      location: row.location,
      imageUrl: row.imageUrl,
      imageAlt: row.imageAlt,
      createdAt: row.createdAt,
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        image: row.user_image,
      },
    }));

    // For now, return posts with mock data for likes/comments/gear
    // TODO: Implement proper likes/comments/gear functionality
    const postsWithDetails = feedPosts.map(post => ({
      ...post,
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      gear: [],
    }));

    await client.end();
    
    return NextResponse.json({
      posts: postsWithDetails,
      pagination: {
        page,
        limit,
        hasMore: feedPosts.length === limit,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching feed:", error);
    console.error("Error details:", error instanceof Error ? error.message : 'Unknown error');
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: "Failed to fetch feed", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
