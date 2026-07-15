const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

/**
 * Auth Routes
 *
 * Base path: /api/auth  (registered in server.js)
 *
 * POST /api/auth/register → registerUser controller
 * POST /api/auth/login    → loginUser controller
 *
 * Both are PUBLIC routes — no authentication token required
 * (You can't require a token to log in — that's a chicken-and-egg problem)
 */
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
