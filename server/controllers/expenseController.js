const Expense = require('../models/Expense');

/**
 * @desc    Get all expenses for the logged-in user
 * @route   GET /api/expenses
 * @access  Protected
 */
const getExpenses = async (req, res) => {
  try {
    // CRITICAL: always filter by req.user._id
    // This guarantees users can only see their own expenses
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Add a new expense
 * @route   POST /api/expenses
 * @access  Protected
 */
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    // Basic validation
    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount and category',
      });
    }

    // Create expense — attach the logged-in user's ID automatically
    // The user never sends their own ID — we read it from the verified JWT
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: expense,
    });
  } catch (error) {
    // Mongoose validation error (e.g. invalid category)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    console.error('Add Expense Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an expense
 * @route   PUT /api/expenses/:id
 * @access  Protected
 */
const updateExpense = async (req, res) => {
  try {
    // Find the expense — but also verify it belongs to THIS user
    // Without the user check, User A could edit User B's expenses!
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id, // ownership check
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or not authorized',
      });
    }

    const { title, amount, category, description, date } = req.body;

    // Update only the fields that were provided
    if (title)       expense.title       = title;
    if (amount)      expense.amount      = amount;
    if (category)    expense.category    = category;
    if (description !== undefined) expense.description = description;
    if (date)        expense.date        = date;

    const updated = await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    console.error('Update Expense Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Protected
 */
const deleteExpense = async (req, res) => {
  try {
    // Again — ownership check to prevent cross-user deletion
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found or not authorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };
