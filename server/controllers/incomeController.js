const Income = require('../models/Income');

/**
 * @desc    Get all incomes for the logged-in user
 * @route   GET /api/incomes
 * @access  Protected
 */
const getIncomes = async (req, res) => {
  try {
    // Isolated lookup by filtering with req.user._id
    const incomes = await Income.find({ user: req.user._id })
      .sort({ date: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: incomes.length,
      data: incomes,
    });
  } catch (error) {
    console.error('Get Incomes Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Add a new income record
 * @route   POST /api/incomes
 * @access  Protected
 */
const addIncome = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    // Validate request inputs
    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount and category',
      });
    }

    // Create income tied to current user
    const income = await Income.create({
      user: req.user._id,
      title,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      data: income,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    console.error('Add Income Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an income record
 * @route   PUT /api/incomes/:id
 * @access  Protected
 */
const updateIncome = async (req, res) => {
  try {
    // Find record by id and ownership
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found or not authorized',
      });
    }

    const { title, amount, category, description, date } = req.body;

    // Conditionally update properties
    if (title)       income.title       = title;
    if (amount)      income.amount      = amount;
    if (category)    income.category    = category;
    if (description !== undefined) income.description = description;
    if (date)        income.date        = date;

    const updated = await income.save();

    res.status(200).json({
      success: true,
      message: 'Income updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    console.error('Update Income Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete an income record
 * @route   DELETE /api/incomes/:id
 * @access  Protected
 */
const deleteIncome = async (req, res) => {
  try {
    // Find and delete with ownership isolation check
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income not found or not authorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income deleted successfully',
    });
  } catch (error) {
    console.error('Delete Income Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getIncomes, addIncome, updateIncome, deleteIncome };
