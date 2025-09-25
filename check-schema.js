const { Client } = require('pg');

async function checkSchema() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check gear table schema
    console.log('\nGear table schema:');
    const gearSchema = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'gear' 
      ORDER BY ordinal_position
    `);
    console.log(gearSchema.rows);

    // Check posts table schema
    console.log('\nPosts table schema:');
    const postsSchema = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'posts' 
      ORDER BY ordinal_position
    `);
    console.log(postsSchema.rows);

    // Check app_user table schema
    console.log('\nApp_user table schema:');
    const userSchema = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'app_user' 
      ORDER BY ordinal_position
    `);
    console.log(userSchema.rows);

  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await client.end();
  }
}

checkSchema();
