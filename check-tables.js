const { Client } = require('pg');

async function checkTables() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check what tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    const tables = await client.query(tablesQuery);
    console.log('Existing tables:');
    tables.rows.forEach(row => {
      console.log('-', row.table_name);
    });

    // Check if post_likes table exists
    const postLikesExists = tables.rows.some(row => row.table_name === 'post_likes');
    console.log('\npost_likes table exists:', postLikesExists);

    // Check if post_bookmarks table exists
    const postBookmarksExists = tables.rows.some(row => row.table_name === 'post_bookmarks');
    console.log('post_bookmarks table exists:', postBookmarksExists);

    // Check if post_gear table exists
    const postGearExists = tables.rows.some(row => row.table_name === 'post_gear');
    console.log('post_gear table exists:', postGearExists);

  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await client.end();
  }
}

checkTables();
