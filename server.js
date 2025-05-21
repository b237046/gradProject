require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const itemRoutes = require('./routes/item.routes');
const householdRoutes = require('./routes/household.routes');
const householdItemRoutes = require('./routes/householdItem.routes');
const statisticsRoutes = require('./routes/statistics.routes');
const errorHandler = require('./middlewares/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with retrying
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await db.connect();
      console.log('Connected to MySQL database');
      return;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) {
        console.error('All database connection attempts failed. Exiting...');
        process.exit(1);
      }
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Connect to database with retry
connectWithRetry()
  .catch((err) => {
    console.error('Fatal database connection error:', err.message);
    process.exit(1);
  });

// Default route
app.get('/', (req, res) => {
  res.send('Shopping List API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/household-items', householdItemRoutes);
app.use('/api/statistics', statisticsRoutes);

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});