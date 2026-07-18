const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

/**
 * Expense Routes
 *
 * Base path: /api/expenses (registered in server.js)
 *
 * ALL routes are protected — every request must carry a valid JWT.
 * The 'protect' middleware runs first, identifies the user,
 * then the controller runs with req.user available.
 *
 * GET    /api/expenses       → getExpenses  (list all)
 * POST   /api/expenses       → addExpense   (create one)
 * PUT    /api/expenses/:id   → updateExpense (edit one)
 * DELETE /api/expenses/:id   → deleteExpense (remove one)
 */
router.route('/')
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

module.exports = router;
