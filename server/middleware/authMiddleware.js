const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect
 *
 * This middleware runs BEFORE any protected route's controller.
 * It acts as a security checkpoint — verifying the caller has a valid JWT.
 *
 * Flow:
 * 1. Read the Authorization header → "Bearer <token>"
 * 2. Extract the token string
 * 3. Verify the token's signature using JWT_SECRET
 * 4. Decode the payload to get the user's ID
 * 5. Fetch that user from the database
 * 6. Attach the user to req.user so controllers can access it
 * 7. Call next() to continue to the actual route controller
 *
 * If anything fails → return 401 Unauthorized immediately
 *
 * Usage in routes:
 *   router.get('/expenses', protect, getExpenses)
 *                           ↑
 *                    runs this first
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  // Standard format: Authorization: Bearer eyJhbGc...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract just the token string (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token — this throws an error if:
      // - Token is tampered with
      // - Token has expired
      // - Token was signed with a different secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from DB using the ID stored in the token payload
      // .select('-password') explicitly excludes the password hash from the result
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists',
        });
      }

      // All checks passed — move to the next middleware/controller
      next();
    } catch (error) {
      // jwt.verify() threw an error — token is invalid or expired
      return res.status(401).json({
        success: false,
        message: 'Not authorized — invalid or expired token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided',
    });
  }
};

module.exports = { protect };
