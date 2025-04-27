const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || process.env.RAILWAY_MYSQL_HOST,
  user: process.env.DB_USER || process.env.RAILWAY_MYSQL_USER,
  password: process.env.DB_PASSWORD || process.env.RAILWAY_MYSQL_PASSWORD,
  database: process.env.DB_NAME || process.env.RAILWAY_MYSQL_DATABASE,
  port: process.env.DB_PORT || process.env.RAILWAY_MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a pool for database connections
const pool = mysql.createPool(dbConfig);

// Initialize database tables
const initDb = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        verification_code VARCHAR(6),
        code_expiry DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  }
};

// Export connection methods
module.exports = {
  connect: async () => {
    try {
      // Test connection
      await pool.query('SELECT 1');
      // Initialize database tables
      await initDb();
      return pool;
    } catch (error) {
      console.error('Database connection error:', error.message);
      throw error;
    }
  },
  query: (sql, params) => pool.query(sql, params),
  pool
};