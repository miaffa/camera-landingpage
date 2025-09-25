import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMockSession, getMockUserData } from "@/lib/mock-session";

export async function GET(request: NextRequest) {
  try {
    // Development bypass - set to true to disable authentication
    const BYPASS_AUTH = true;
    
    let session = await auth();
    if (BYPASS_AUTH && !session?.user?.id) {
      // Create a comprehensive mock session for development
      session = createMockSession() as any;
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return the complete user profile data
    const userData = getMockUserData();
    
    return NextResponse.json({
      user: userData
    });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: error?.message },
      { status: 500 }
    );
  }
}
