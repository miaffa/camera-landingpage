import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer();
    
    // Get the current user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, avatarUrl } = await request.json();

    // Check if user profile already exists
    if (!user.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }
    
    const existingProfile = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    const userData = {
      email: user.email,
      name: name || user.user_metadata?.full_name || user.user_metadata?.name || null,
      image: avatarUrl || user.user_metadata?.avatar_url || null,
    };

    let profile;

    if (existingProfile.length > 0) {
      // Update existing profile
      const [updatedProfile] = await db
        .update(users)
        .set({
          ...userData,
        })
        .where(eq(users.id, existingProfile[0].id))
        .returning();

      profile = updatedProfile;
    } else {
      // Create new profile
      const [newProfile] = await db
        .insert(users)
        .values({
          ...userData,
        })
        .returning();

      profile = newProfile;
    }

    return NextResponse.json({
      id: profile.id,
      supabaseUserId: user.id,
      name: profile.name,
      email: profile.email,
      username: null, // We'll add this field later
      avatarUrl: profile.image,
      bio: null, // We'll add this field later
      createdAt: profile.createdAt,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = supabaseServer();
    
    // Get the current user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile from database
    if (!user.email) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }
    
    const profile = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: profile[0].id,
      supabaseUserId: user.id,
      name: profile[0].name,
      email: profile[0].email,
      username: null,
      avatarUrl: profile[0].image,
      bio: null,
      createdAt: profile[0].createdAt,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
