const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 *
 * Defines the shape of every user document stored in MongoDB.
 * Think of this as the "form" a user must fill out to exist in our database.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // removes accidental leading/trailing spaces
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // no two users can have the same email
      lowercase: true, // always stored as lowercase — 'Eswar@gmail.com' → 'eswar@gmail.com'
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // select: false means this field is EXCLUDED from query results by default
      // So when we fetch a user, the password hash is never sent unless we explicitly ask for it
      select: false,
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    // We get audit tracking for free
    timestamps: true,
  }
);

/**
 * Pre-save Hook: Hash password before saving to database
 *
 * This runs automatically EVERY TIME a user document is saved.
 * We check 'isModified' so we don't re-hash on profile updates that don't change the password.
 *
 * bcrypt.genSalt(10) → generates a "salt" (random string added to password before hashing)
 * The number 10 is the "cost factor" — higher = more secure but slower
 * 10 is the industry standard balance between security and speed
 */
userSchema.pre('save', async function () {
  // Only run if password was actually changed
  // If we're updating name or email, skip re-hashing
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance Method: comparePassword
 *
 * Called on a specific user document to verify a login attempt.
 * bcrypt.compare() runs the same hash process on the input
 * and checks if it matches the stored hash.
 *
 * Usage: const isMatch = await user.comparePassword('enteredPassword')
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
