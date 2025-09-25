const { drizzle } = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const { eq, desc, and } = require("drizzle-orm");

async function debugDrizzle() {
  try {
    const connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
    const client = postgres(connectionString);
    const db = drizzle(client);

    console.log('Testing Drizzle with manual schema...');

    // Define the schema manually to match the database
    const posts = {
      id: { name: 'id', tableName: 'posts' },
      userId: { name: 'user_id', tableName: 'posts' },
      caption: { name: 'caption', tableName: 'posts' },
      location: { name: 'location', tableName: 'posts' },
      imageUrl: { name: 'image_url', tableName: 'posts' },
      imageAlt: { name: 'image_alt', tableName: 'posts' },
      createdAt: { name: 'created_at', tableName: 'posts' },
      isActive: { name: 'is_active', tableName: 'posts' }
    };

    const users = {
      id: { name: 'id', tableName: 'app_user' },
      name: { name: 'name', tableName: 'app_user' },
      email: { name: 'email', tableName: 'app_user' },
      image: { name: 'image', tableName: 'app_user' }
    };

    // Test a simple query first
    console.log('\n1. Testing simple posts query...');
    const simplePosts = await db.execute('SELECT COUNT(*) FROM posts');
    console.log('Posts count:', simplePosts[0].count);

    console.log('\n2. Testing simple users query...');
    const simpleUsers = await db.execute('SELECT COUNT(*) FROM app_user');
    console.log('Users count:', simpleUsers[0].count);

    console.log('\n3. Testing join query manually...');
    const joinQuery = `
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
      LIMIT 5
    `;
    const joinResult = await db.execute(joinQuery);
    console.log('Join query result:', joinResult.length, 'rows');
    if (joinResult.length > 0) {
      console.log('First post:', joinResult[0]);
    }

    await client.end();
  } catch (error) {
    console.error('Error debugging Drizzle:', error);
  }
}

debugDrizzle();
