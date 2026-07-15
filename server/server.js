const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes'); // Phase 3

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

// Enable CORS — allows our React frontend (port 5173) to talk to this server
app.use(cors());

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
app.use('/api/auth', authRoutes);

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
