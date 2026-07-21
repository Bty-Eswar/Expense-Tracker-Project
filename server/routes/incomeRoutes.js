const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');

/**
 * Income Routes
 *
 * Base path: /api/incomes
 *
 * All routes are protected by JWT authentication middleware.
 */
router.route('/')
  .get(protect, getIncomes)
  .post(protect, addIncome);

router.route('/:id')
  .put(protect, updateIncome)
  .delete(protect, deleteIncome);

module.exports = router;
