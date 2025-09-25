const { Client } = require('pg');

async function testQuery() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Test the exact query from the gear API
    console.log('\nTesting gear query:');
    const gearQuery = `
      SELECT * FROM gear 
      WHERE is_active = true AND is_available = true 
      ORDER BY created_at DESC 
      LIMIT 20 OFFSET 0
    `;
    
    const gearResult = await client.query(gearQuery);
    console.log('Gear query result:', gearResult.rows.length, 'rows');
    if (gearResult.rows.length > 0) {
      console.log('First gear item:', gearResult.rows[0]);
    }

    // Test the exact query from the feed API
    console.log('\nTesting feed query:');
    const feedQuery = `
      SELECT 
        p.id,
        p.caption,
        p.location,
        p.image_url,
        p.image_alt,
        p.created_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.image as user_image
      FROM posts p
      INNER JOIN app_user u ON p.user_id = u.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 10 OFFSET 0
    `;
    
    const feedResult = await client.query(feedQuery);
    console.log('Feed query result:', feedResult.rows.length, 'rows');
    if (feedResult.rows.length > 0) {
      console.log('First post:', feedResult.rows[0]);
    }

  } catch (error) {
    console.error('Error testing queries:', error);
  } finally {
    await client.end();
  }
}

testQuery();
