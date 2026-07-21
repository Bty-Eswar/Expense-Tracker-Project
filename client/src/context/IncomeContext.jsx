import { createContext, useContext, useState, useCallback } from 'react';
import API from '../api/axiosConfig';

/**
 * IncomeContext
 *
 * Manages all income transaction states globally.
 * Implements standard CRUD actions with axios configuration.
 */
const IncomeContext = createContext(null);

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Fetch All Incomes ────────────────────────────────────
  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get('/incomes');
      setIncomes(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load incomes');
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Add Income ───────────────────────────────────────────
  const addIncome = async (incomeData) => {
    const { data } = await API.post('/incomes', incomeData);
    // Optimistically prepend to UI state
    setIncomes((prev) => [data.data, ...prev]);
    return data;
  };

  // ─── Update Income ────────────────────────────────────────
  const updateIncome = async (id, incomeData) => {
    const { data } = await API.put(`/incomes/${id}`, incomeData);
    // Map existing records and replace the updated index
    setIncomes((prev) =>
      prev.map((inc) => (inc._id === id ? data.data : inc))
    );
    return data;
  };

  // ─── Delete Income ────────────────────────────────────────
  const deleteIncome = async (id) => {
    await API.delete(`/incomes/${id}`);
    // Immediately filter out the deleted record
    setIncomes((prev) => prev.filter((inc) => inc._id !== id));
  };

  // ─── Computed Statistics ─────────────────────────────────
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  const value = {
    incomes,
    loading,
    error,
    totalIncome,
    fetchIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
  };

  return (
    <IncomeContext.Provider value={value}>
      {children}
    </IncomeContext.Provider>
  );
};

export const useIncomes = () => {
  const context = useContext(IncomeContext);
  if (!context) {
    throw new Error('useIncomes must be used within an IncomeProvider');
  }
  return context;
};

export default IncomeContext;
