import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import postgres from "postgres";
import { z } from "zod";
import { createMockSession } from "@/lib/mock-session";

const createGearSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  condition: z.string().min(1),
  dailyRate: z.string().min(1),
  weeklyRate: z.string().optional(),
  monthlyRate: z.string().optional(),
  deposit: z.string().optional(),
  location: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  images: z.array(z.string()).optional(),
  specs: z.string().optional(),
});


// GET - Fetch gear with search and filters
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
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const userId = searchParams.get("userId"); // For user's own gear

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereClause = 'WHERE is_active = true AND is_available = true';
    const params = [];
    let paramIndex = 1;

    // Add search condition
    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR brand ILIKE $${paramIndex} OR model ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add category filter
    if (category) {
      whereClause += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Add price filters
    if (minPrice) {
      whereClause += ` AND daily_rate >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }
    if (maxPrice) {
      whereClause += ` AND daily_rate <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }

    // Add user filter (for user's own gear)
    if (userId) {
      whereClause += ` AND user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    // Fetch gear
    const gearQuery = `
      SELECT * FROM gear 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const client = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');
    console.log('Gear API - Query:', gearQuery);
    console.log('Gear API - Params:', params);
    const gearList = await client.unsafe(gearQuery, params);
    console.log('Gear API - Result length:', gearList.length);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as count FROM gear ${whereClause}`;
    const countParams = params.slice(0, -2); // Remove limit and offset
    const totalCountResult = await client.unsafe(countQuery, countParams);
    const totalCount = parseInt(totalCountResult[0].count);

    await client.end();
    
    return NextResponse.json({
      gear: gearList,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: gearList.length === limit,
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching gear:", error);
    return NextResponse.json(
      { error: "Failed to fetch gear" },
      { status: 500 }
    );
  }
}

// POST - Create new gear
export async function POST(request: NextRequest) {
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
    
    const body = await request.json();
    const validatedData = createGearSchema.parse(body);

    // Use raw SQL for consistency with GET method
    const insertQuery = `
      INSERT INTO gear (
        user_id, name, description, category, brand, model, condition,
        daily_rate, weekly_rate, monthly_rate, deposit, location,
        latitude, longitude, is_available, images, specs, created_at, updated_at, is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW(), true
      ) RETURNING id
    `;
    
    const client = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');
    const result = await client.unsafe(insertQuery, [
      session.user.id,
      validatedData.name,
      validatedData.description || null,
      validatedData.category,
      validatedData.brand,
      validatedData.model,
      validatedData.condition,
      validatedData.dailyRate,
      validatedData.weeklyRate || null,
      validatedData.monthlyRate || null,
      validatedData.deposit || null,
      validatedData.location || null,
      validatedData.latitude || null,
      validatedData.longitude || null,
      true, // is_available
      validatedData.images || [],
      validatedData.specs || null
    ]);
    
    await client.end();

    return NextResponse.json({
      id: result[0].id,
      message: "Gear created successfully",
    });
  } catch (error: unknown) {
    console.error("Error creating gear:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create gear" },
      { status: 500 }
    );
  }
}
