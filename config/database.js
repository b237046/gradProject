const mysql = require('mysql2/promise');
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
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
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        verification_code VARCHAR(6),
        code_expiry DATETIME
      )
    `);

    // Create households table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS households (
        household_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        invite_code VARCHAR(6) NOT NULL UNIQUE
      )
    `);

    // Create users_households table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users_households (
        user_id INT NOT NULL,
        household_id INT NOT NULL,
        PRIMARY KEY (user_id, household_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE
      )
    `);

    // Create items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        item_id INT AUTO_INCREMENT PRIMARY KEY,
        item_name VARCHAR(255) NOT NULL UNIQUE,
        item_photo VARCHAR(1024)
      )
    `);

    // Create household_items table with separate price columns
    await pool.query(`
      CREATE TABLE IF NOT EXISTS household_items (
        household_item_id INT AUTO_INCREMENT PRIMARY KEY,
        household_id INT NOT NULL,
        item_id INT NOT NULL,
        location ENUM('in_house', 'to_buy') DEFAULT 'in_house',
        item_photo VARCHAR(1024),
        price DECIMAL(10,2) DEFAULT 0,
        total_purchase_price DECIMAL(10,2) DEFAULT 0,
        expiration_date DATE,
        purchase_counter INT DEFAULT 0,
        FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
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