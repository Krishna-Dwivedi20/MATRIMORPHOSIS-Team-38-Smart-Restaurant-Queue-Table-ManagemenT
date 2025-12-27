const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    // Read SQL file
    const sqlFile = path.join(process.cwd(), 'database.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Create connection (without database first)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });

    console.log('Connected to MySQL...');

    // Split SQL into individual statements and execute
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        await connection.query(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      } catch (err) {
        console.error('Error executing statement:', statement.substring(0, 50));
        console.error(err.message);
      }
    }

    await connection.end();
    console.log('\n✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

initializeDatabase();
