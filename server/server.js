const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Routes
const authRoutes    = require('./routes/authRoutes');    // Phase 3
const expenseRoutes = require('./routes/expenseRoutes'); // Phase 5
const incomeRoutes  = require('./routes/incomeRoutes');  // Phase 8

// Load environment variables FIRST — before anything else
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Connect to MongoDB Atlas
// ========================
connectDB();

// ========================
// Middleware
// ========================

/**
 * CORS Configuration — Production Ready
 *
 * In development: allows localhost:5173 and localhost:5174
 * In production:  allows the Vercel frontend URL via CLIENT_URL env variable
 *
 * filter(Boolean) removes undefined/null if CLIENT_URL is not set
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  credentials: true, // allow cookies / Authorization headers
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// ========================
// API Routes
// ========================

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker Pro API is running',
    database: 'MongoDB Atlas Connected',
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes — /api/auth/register, /api/auth/login
app.use('/api/auth',     authRoutes);
app.use('/api/expenses', expenseRoutes); // Phase 5
app.use('/api/incomes',  incomeRoutes);  // Phase 8

// ========================
// 404 Handler
// ========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
