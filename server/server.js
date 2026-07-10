const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Health Check Route — used to confirm the server is running
// In production, tools like Render use this to verify the server is alive
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Expense Tracker Pro API is running',
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
