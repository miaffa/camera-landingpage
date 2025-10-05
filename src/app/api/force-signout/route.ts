import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Clear all auth-related cookies
    const response = NextResponse.json({ 
      success: true, 
      message: "Signed out successfully. Please clear your browser cache and cookies completely." 
    });
    
    // Clear NextAuth cookies with more aggressive settings
    response.cookies.set("next-auth.session-token", "", {
      expires: new Date(0),
      path: "/",
      domain: "localhost",
      secure: false,
      httpOnly: true,
      sameSite: "lax"
    });
    
    response.cookies.set("next-auth.csrf-token", "", {
      expires: new Date(0),
      path: "/",
      domain: "localhost",
      secure: false,
      httpOnly: false,
      sameSite: "lax"
    });
    
    response.cookies.set("next-auth.callback-url", "", {
      expires: new Date(0),
      path: "/",
      domain: "localhost",
      secure: false,
      httpOnly: false,
      sameSite: "lax"
    });
    
    // Clear any other potential auth cookies
    response.cookies.set("__Secure-next-auth.session-token", "", {
      expires: new Date(0),
      path: "/",
      domain: "localhost",
      secure: true,
      httpOnly: true,
      sameSite: "lax"
    });
    
    return response;
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sign out" },
      { status: 500 }
    );
  }
}
