const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Phase 2: import DB connection

// Load environment variables FIRST — before anything else
// If this line comes after, process.env.MONGO_URI would be undefined
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// Connect to MongoDB Atlas
// ========================
// We connect first, then start the server
// This ensures the API never accepts requests without a working database
connectDB();

// ========================
// Middleware
// ========================

// Enable CORS — allows our React frontend (port 5173) to talk to this server (port 5000)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// ========================
// Routes
// ========================

// Health Check Route — confirms server AND database are set up
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker Pro API is running',
    database: 'MongoDB Atlas Connected',
    timestamp: new Date().toISOString(),
  });
});

// ========================
// 404 Handler — catches any undefined routes
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
