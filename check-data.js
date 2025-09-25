const { Client } = require('pg');

async function checkData() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if we have users
    const users = await client.query('SELECT COUNT(*) FROM app_user');
    console.log('Users count:', users.rows[0].count);

    // Check if we have plans
    const plans = await client.query('SELECT COUNT(*) FROM plans');
    console.log('Plans count:', plans.rows[0].count);

    // Check if we have gear
    const gear = await client.query('SELECT COUNT(*) FROM gear');
    console.log('Gear count:', gear.rows[0].count);

    // Check if we have posts
    const posts = await client.query('SELECT COUNT(*) FROM posts');
    console.log('Posts count:', posts.rows[0].count);

    // Show some sample data
    console.log('\nSample users:');
    const sampleUsers = await client.query('SELECT id, name, email FROM app_user LIMIT 3');
    console.log(sampleUsers.rows);

    console.log('\nSample gear:');
    const sampleGear = await client.query('SELECT id, name, brand, model FROM gear LIMIT 3');
    console.log(sampleGear.rows);

    console.log('\nSample posts:');
    const samplePosts = await client.query('SELECT id, caption, location FROM posts LIMIT 3');
    console.log(samplePosts.rows);

  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await client.end();
  }
}

checkData();
