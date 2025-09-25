const postgres = require('postgres');

async function testGearAPI() {
  try {
    const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    const client = postgres(connectionString);

    console.log('Testing gear API logic...');

    // Simulate the exact logic from the gear API
    const page = 1;
    const limit = 20;
    const search = "";
    const category = "";
    const minPrice = null;
    const maxPrice = null;
    const userId = null;

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
    
    console.log('Query:', gearQuery);
    console.log('Params:', params);
    
    const gearList = await client.unsafe(gearQuery, params);
    console.log('Gear list length:', gearList.length);
    console.log('First gear item:', gearList[0]);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) as count FROM gear ${whereClause}`;
    const countParams = params.slice(0, -2); // Remove limit and offset
    console.log('Count query:', countQuery);
    console.log('Count params:', countParams);
    
    const totalCountResult = await client.unsafe(countQuery, countParams);
    const totalCount = parseInt(totalCountResult[0].count);
    console.log('Total count:', totalCount);

    await client.end();

    return {
      gear: gearList,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: gearList.length === limit,
      },
    };
  } catch (error) {
    console.error('Error testing gear API:', error);
  }
}

testGearAPI();
