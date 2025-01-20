const { Pool } = require('pg'); // Importing Pool from 'pg'

// Setup PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',     // Replace with your PostgreSQL username
  host: 'localhost',    // PostgreSQL host
  database: 'postgres', // Replace with your database name
  password: 'Amol',     // Replace with your password
  port: 5432,           // PostgreSQL default port
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('PostgreSQL connected:', res.rows);
  }
});

// Export the pool for use in other files
module.exports = pool;
