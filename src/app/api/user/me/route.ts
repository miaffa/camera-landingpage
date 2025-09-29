import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMockSession, getMockUserData } from "@/lib/mock-session";

export async function GET() {
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

    // Return the complete user profile data
    const userData = getMockUserData();
    
    return NextResponse.json({
      user: userData
    });
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
