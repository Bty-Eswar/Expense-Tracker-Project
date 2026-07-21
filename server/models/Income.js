const mongoose = require('mongoose');

/**
 * Income Schema
 *
 * Defines the structure of income documents in MongoDB.
 * Links each record to a User to guarantee data isolation.
 */
const incomeSchema = new mongoose.Schema(
  {
    // Owner of this income record
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
          'Salary',
          'Freelance',
          'Investment',
          'Gifts',
          'Refunds',
          'Other',
        ],
        message: '{VALUE} is not a valid income category',
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
    timestamps: true, // Auto-adds createdAt and updatedAt
  }
);

/**
 * Compound Index
 * Optimizes sorting and querying incomes by user and date.
 */
incomeSchema.index({ user: 1, date: -1 });

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
