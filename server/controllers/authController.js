const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public (no token required)
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Step 1: Validate that all fields are provided ──
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // ── Step 2: Check if a user with this email already exists ──
    // We check BEFORE trying to save — gives a cleaner error message
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // ── Step 3: Create the user ──
    // The pre-save hook in User.js will automatically hash the password
    // We do NOT hash it here — that's the model's responsibility
    const user = await User.create({ name, email, password });

    // ── Step 4: Generate a JWT token for the new user ──
    const token = generateToken(user._id);

    // ── Step 5: Send response ──
    // We send back the token + user info (but NOT the password hash)
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    // Mongoose validation error (e.g., email format wrong)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

/**
 * @desc    Login user and return JWT token
 * @route   POST /api/auth/login
 * @access  Public (no token required)
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Step 1: Validate inputs ──
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // ── Step 2: Find the user by email ──
    // We use .select('+password') because password has select:false in the schema
    // Without this, the password field would NOT be returned from the DB
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // IMPORTANT: Same message for "email not found" and "wrong password"
      // Different messages would let attackers know which emails exist in our system
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ── Step 3: Compare the entered password with the stored hash ──
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ── Step 4: Generate token and send response ──
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

module.exports = { registerUser, loginUser };
