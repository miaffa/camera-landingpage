import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { nameSuggestions } from "@/db/schema/name-suggestions";

const nameSuggestionSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  nameSuggestion: z.string().min(1, "Name suggestion is required").max(100, "Name suggestion too long"),
  reason: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = nameSuggestionSchema.parse(json);

    const suggestion = await db
      .insert(nameSuggestions)
      .values({
        email: body.email,
        nameSuggestion: body.nameSuggestion,
        reason: body.reason || null,
      })
      .returning();

    return NextResponse.json(suggestion[0], { status: 201 });
  } catch (error) {
    console.error("Name suggestion submission error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const recentSuggestions = await db
      .select({
        nameSuggestion: nameSuggestions.nameSuggestion,
        reason: nameSuggestions.reason,
        createdAt: nameSuggestions.createdAt,
      })
      .from(nameSuggestions)
      .orderBy(nameSuggestions.createdAt)
      .limit(5);

    return NextResponse.json(recentSuggestions, { status: 200 });
  } catch (error) {
    console.error("Get recent suggestions error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
