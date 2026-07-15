const jwt = require('jsonwebtoken');

/**
 * generateToken
 *
 * Creates and signs a JWT (JSON Web Token) for a given user ID.
 *
 * @param {string} userId - The MongoDB _id of the authenticated user
 * @returns {string} - A signed JWT string
 *
 * How it works:
 * jwt.sign() takes 3 arguments:
 *   1. PAYLOAD   → data to embed inside the token (we store the user's ID)
 *   2. SECRET    → the key used to sign the token (from .env — never expose this)
 *   3. OPTIONS   → settings like expiry time
 *
 * The token is NOT encrypted — the payload can be decoded by anyone.
 * But it CANNOT be tampered with — the signature will break if anyone edits it.
 * That's why we only store non-sensitive info (just the ID, never the password).
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // payload
    process.env.JWT_SECRET,   // secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN } // e.g., '7d'
  );
};

module.exports = generateToken;
