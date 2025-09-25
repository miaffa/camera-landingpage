const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Skip migrations since tables already exist
    const fs = require('fs');
    console.log('Skipping migrations - tables already exist');

    // Read and execute the seed data
    const seedSQL = fs.readFileSync('./simple-seed.sql', 'utf8');
    
    console.log('Applying seed data...');
    await client.query(seedSQL);
    console.log('Seed data applied successfully');

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupDatabase();
