import { NextRequest, NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const PUT = withAuthRequired(async (request: NextRequest, { session }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    // const bio = formData.get("bio") as string; // TODO: Uncomment after migration
    // const location = formData.get("location") as string; // TODO: Uncomment after migration
    const imageUrl = formData.get("imageUrl") as string | null;

    // Validate required fields
    if (!name || !username) {
      return NextResponse.json(
        { error: "Name and username are required" },
        { status: 400 }
      );
    }

    // Avatar URL is now provided directly from client-side upload

    // Update user profile
    const updatedUser = await db
      .update(users)
      .set({
        name,
        image: imageUrl || undefined, // Only update image if we have a new one
        // TODO: Add username, bio and location fields after migration
        // username: username,
        // bio: bio || null,
        // location: location || null,
      })
      .where(eq(users.id, session.user.id))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
});
