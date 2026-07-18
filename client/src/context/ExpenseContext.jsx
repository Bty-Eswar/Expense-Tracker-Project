import { createContext, useContext, useState, useCallback } from 'react';
import API from '../api/axiosConfig';

/**
 * ExpenseContext
 *
 * Manages all expense state globally.
 * Any component can read expenses or call CRUD operations
 * without prop drilling.
 *
 * Why useCallback?
 * Prevents functions from being recreated on every render.
 * Important when these functions are passed as props or used in useEffect.
 */
const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // ─── Fetch All Expenses ───────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/expenses');
      setExpenses(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Add Expense ──────────────────────────────────────────
  const addExpense = async (expenseData) => {
    const { data } = await API.post('/expenses', expenseData);
    // Prepend to local state — no need to refetch from server
    setExpenses((prev) => [data.data, ...prev]);
    return data;
  };

  // ─── Update Expense ───────────────────────────────────────
  const updateExpense = async (id, expenseData) => {
    const { data } = await API.put(`/expenses/${id}`, expenseData);
    // Update only the changed expense in local state
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === id ? data.data : exp))
    );
    return data;
  };

  // ─── Delete Expense ───────────────────────────────────────
  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`);
    // Remove from local state immediately — optimistic UI update
    setExpenses((prev) => prev.filter((exp) => exp._id !== id));
  };

  // ─── Computed Stats ───────────────────────────────────────
  // Calculate totals from current expenses array
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const value = {
    expenses,
    loading,
    error,
    totalExpenses,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export default ExpenseContext;
