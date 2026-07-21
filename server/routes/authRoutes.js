const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, updatePassword } = require('../controllers/authController');

/**
 * Auth Routes
 *
 * Base path: /api/auth  (registered in server.js)
 *
 * POST /api/auth/register → registerUser controller (Public)
 * POST /api/auth/login    → loginUser controller (Public)
 * PUT  /api/auth/password → updatePassword controller (Protected)
 */
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/password', protect, updatePassword);

module.exports = router;
