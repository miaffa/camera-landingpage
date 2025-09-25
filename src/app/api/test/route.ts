import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

export async function GET(request: NextRequest) {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    const client = postgres(connectionString);
    
    const result = await client.unsafe('SELECT COUNT(*) as count FROM posts');
    console.log('Query result:', result);
    
    await client.end();
    
    return NextResponse.json({
      success: true,
      count: result[0].count,
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'not set'
    });
  } catch (error) {
    console.error("Error in test API:", error);
    return NextResponse.json(
      { error: "Test failed", details: error.message },
      { status: 500 }
    );
  }
}
