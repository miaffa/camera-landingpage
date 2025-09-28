import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { postBookmarks } from "@/db/schema/posts";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    // Check if user already bookmarked this post
    const existingBookmark = await db
      .select()
      .from(postBookmarks)
      .where(and(eq(postBookmarks.postId, postId), eq(postBookmarks.userId, session.user.id)))
      .limit(1);

    if (existingBookmark.length > 0) {
      // Remove bookmark
      await db
        .delete(postBookmarks)
        .where(and(eq(postBookmarks.postId, postId), eq(postBookmarks.userId, session.user.id)));

      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await db.insert(postBookmarks).values({
        postId,
        userId: session.user.id,
      });

      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { error: "Failed to toggle bookmark" },
      { status: 500 }
    );
  }
}
