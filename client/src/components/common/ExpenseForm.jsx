import { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';

const CATEGORIES = [
  'Food', 'Transport', 'Shopping',
  'Entertainment', 'Health', 'Education', 'Bills', 'Other',
];

/**
 * ExpenseForm
 *
 * A modal form used for both Adding and Editing an expense.
 * When 'editData' prop is provided → it's in Edit mode.
 * When 'editData' is null → it's in Add mode.
 *
 * @param {boolean}  isOpen    - Whether the modal is visible
 * @param {Function} onClose   - Called to close the modal
 * @param {Object}   editData  - If editing, the expense object. Null for add.
 */
const ExpenseForm = ({ isOpen, onClose, editData = null }) => {
  const { addExpense, updateExpense } = useExpenses();

  const [form, setForm] = useState({
    title: '', amount: '', category: 'Food', description: '', date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // When editData changes — populate the form
  useEffect(() => {
    if (editData) {
      setForm({
        title:       editData.title,
        amount:      editData.amount,
        category:    editData.category,
        description: editData.description || '',
        date:        editData.date?.split('T')[0] || '',
      });
    } else {
      // Reset form for Add mode
      setForm({ title: '', amount: '', category: 'Food', description: '', date: '' });
    }
    setError('');
  }, [editData, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        date: form.date || new Date().toISOString().split('T')[0],
      };

      if (editData) {
        await updateExpense(editData._id, payload);
      } else {
        await addExpense(payload);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Modal Card — stop click from closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card animate-slide-up"
        style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.125rem', fontWeight: 700 }}>
            {editData ? '✏️ Edit Expense' : '➕ Add Expense'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem', color: '#94a3b8',
              width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem',
            }}
          >✕</button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '0.625rem', padding: '0.75rem',
            color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Title */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
              Title *
            </label>
            <input
              id="expense-title"
              name="title"
              type="text"
              className="input-field"
              placeholder="e.g. Lunch at Zomato"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount + Category on same row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                Amount (₹) *
              </label>
              <input
                id="expense-amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                Category *
              </label>
              <select
                id="expense-category"
                name="category"
                className="input-field"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#1e293b' }}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
              Date
            </label>
            <input
              id="expense-date"
              name="date"
              type="date"
              className="input-field"
              value={form.date}
              onChange={handleChange}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
              Description (optional)
            </label>
            <textarea
              id="expense-description"
              name="description"
              className="input-field"
              placeholder="Add a note..."
              value={form.description}
              onChange={handleChange}
              rows={2}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.625rem', color: '#94a3b8',
                cursor: 'pointer', fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              id="expense-submit"
              type="submit"
              disabled={loading}
              className="btn-gradient"
              style={{
                flex: 1, padding: '0.75rem',
                borderRadius: '0.625rem',
                fontSize: '0.9375rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? (
                <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Saving...</>
              ) : (
                editData ? 'Update' : 'Add Expense'
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ExpenseForm;
