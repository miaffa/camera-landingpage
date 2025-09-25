const { Client } = require('pg');

async function checkRelations() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check post_likes
    const postLikesCount = await client.query('SELECT COUNT(*) FROM post_likes');
    console.log('post_likes count:', postLikesCount.rows[0].count);

    // Check post_bookmarks
    const postBookmarksCount = await client.query('SELECT COUNT(*) FROM post_bookmarks');
    console.log('post_bookmarks count:', postBookmarksCount.rows[0].count);

    // Check post_comments
    const postCommentsCount = await client.query('SELECT COUNT(*) FROM post_comments');
    console.log('post_comments count:', postCommentsCount.rows[0].count);

    // Check post_gear
    const postGearCount = await client.query('SELECT COUNT(*) FROM post_gear');
    console.log('post_gear count:', postGearCount.rows[0].count);

    // Test a simple feed query without the relations
    console.log('\nTesting simple feed query:');
    const simpleFeedQuery = `
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
      INNER JOIN app_user u ON p.user_id = u.id
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
      LIMIT 5
    `;
    
    const simpleFeedResult = await client.query(simpleFeedQuery);
    console.log('Simple feed result:', simpleFeedResult.rows.length, 'rows');
    if (simpleFeedResult.rows.length > 0) {
      console.log('First post:', simpleFeedResult.rows[0]);
    }

  } catch (error) {
    console.error('Error checking relations:', error);
  } finally {
    await client.end();
  }
}

checkRelations();
