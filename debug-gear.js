const { Client } = require('pg');

async function debugGear() {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Test the exact query from the gear API
    console.log('\n1. Testing basic gear query:');
    const basicQuery = `
      SELECT * FROM gear 
      WHERE is_active = true AND is_available = true
      ORDER BY created_at DESC 
      LIMIT 20 OFFSET 0
    `;
    
    const basicResult = await client.query(basicQuery);
    console.log('Basic query result:', basicResult.rows.length, 'rows');
    if (basicResult.rows.length > 0) {
      console.log('First gear item:', basicResult.rows[0]);
    }

    // Test with parameterized query
    console.log('\n2. Testing parameterized query:');
    const paramQuery = `
      SELECT * FROM gear 
      WHERE is_active = $1 AND is_available = $2
      ORDER BY created_at DESC 
      LIMIT $3 OFFSET $4
    `;
    
    const paramResult = await client.query(paramQuery, [true, true, 20, 0]);
    console.log('Parameterized query result:', paramResult.rows.length, 'rows');
    if (paramResult.rows.length > 0) {
      console.log('First gear item:', paramResult.rows[0]);
    }

    // Check the exact column values
    console.log('\n3. Checking column values:');
    const checkQuery = `
      SELECT 
        id, 
        name, 
        is_active, 
        is_available, 
        created_at
      FROM gear 
      LIMIT 3
    `;
    
    const checkResult = await client.query(checkQuery);
    console.log('Column values:');
    checkResult.rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, {
        id: row.id,
        name: row.name,
        is_active: row.is_active,
        is_available: row.is_available,
        created_at: row.created_at
      });
    });

  } catch (error) {
    console.error('Error debugging gear:', error);
  } finally {
    await client.end();
  }
}

debugGear();
