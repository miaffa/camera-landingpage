import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { createMockSession } from "@/lib/mock-session";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Upload API - Starting request");
    
    // Authentication is now enabled
    const BYPASS_AUTH = false;
    
    let session = await auth();
    console.log("🚀 Upload API - Original session:", session);
    
    if (BYPASS_AUTH && (!session?.user?.id)) {
      console.log("🚀 Upload API - Creating mock session");
      // Create a mock session for development
      session = createMockSession();
    }
    
    console.log("🚀 Upload API - Current session:", session);
    
    if (!session?.user?.id) {
      console.log("🚀 Upload API - No user ID, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log("🚀 Upload API - Authentication passed, processing file");

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/${filename}`;
    
    console.log("🚀 Upload API - Success! Image URL:", imageUrl);
    
    return NextResponse.json({
      imageUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error: unknown) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}