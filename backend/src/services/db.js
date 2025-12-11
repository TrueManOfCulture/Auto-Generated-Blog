import pg from 'pg';
// In real app, you might use 'dotenv' for local testing without Docker Compose
// import 'dotenv/config'; 

const { Pool } = pg;

// Use environment variables from Docker Compose
const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'blog_db',
  password: process.env.DB_PASSWORD || 'password123',
  port: process.env.DB_PORT || 5432, 
});

// A simple function to test the connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
  } else {
    console.log('✅ PostgreSQL connected successfully:', res.rows[0].now);
  }
});

export default {
  query: (text, params) => pool.query(text, params),
};