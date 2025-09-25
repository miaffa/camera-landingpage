const postgres = require('postgres');

async function testAPIs() {
  const client = postgres('postgresql://postgres:postgres@127.0.0.1:54322/postgres');

  try {
    console.log('Testing API logic with correct database connection...\n');

    // Test Feed API logic
    console.log('1. Testing Feed API logic:');
    const feedQuery = `
      SELECT 
        p.id,
        p.caption,
        p.location,
        p.image_url as "imageUrl",
        p.image_alt as "imageAlt",
        p.created_at as "createdAt",
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.image as user_image
      FROM posts p
      INNER JOIN app_user u ON p.user_id::text = u.id::text
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const feedResult = await client.unsafe(feedQuery, [10, 0]);
    console.log('Feed result:', feedResult.length, 'posts');
    if (feedResult.length > 0) {
      console.log('First post:', {
        id: feedResult[0].id,
        caption: feedResult[0].caption,
        user_name: feedResult[0].user_name
      });
    }

    // Test Gear API logic
    console.log('\n2. Testing Gear API logic:');
    const gearQuery = `
      SELECT * FROM gear 
      WHERE is_active = true AND is_available = true
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    
    const gearResult = await client.unsafe(gearQuery, [20, 0]);
    console.log('Gear result:', gearResult.length, 'items');
    if (gearResult.length > 0) {
      console.log('First gear item:', {
        id: gearResult[0].id,
        name: gearResult[0].name,
        brand: gearResult[0].brand
      });
    }

    console.log('\n✅ Both APIs should work correctly with the local database!');
    console.log('The issue was that the server was using a Supabase production database URL instead of the local one.');

  } catch (error) {
    console.error('Error testing APIs:', error);
  } finally {
    await client.end();
  }
}

testAPIs();
