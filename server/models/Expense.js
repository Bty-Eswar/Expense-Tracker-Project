const mongoose = require('mongoose');

/**
 * Expense Schema
 *
 * Defines the shape of every expense document in MongoDB.
 *
 * Key design decision: the 'user' field links every expense to its owner.
 * This is how data isolation works — all queries filter by user ID.
 */
const expenseSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this expense
    // This is a MongoDB "foreign key" — links to the users collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Food',
          'Transport',
          'Shopping',
          'Entertainment',
          'Health',
          'Education',
          'Bills',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
      default: '',
    },

    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

/**
 * Index: user + date
 *
 * We always query expenses by user and sort by date.
 * A compound index on these fields makes those queries significantly faster.
 * Without it, MongoDB scans the entire collection — slow at scale.
 */
expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
