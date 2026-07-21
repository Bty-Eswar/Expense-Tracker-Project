import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ExpenseCard from '../components/common/ExpenseCard';
import ExpenseForm from '../components/common/ExpenseForm';
import { useExpenses } from '../context/ExpenseContext';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Education', 'Bills', 'Other'];

/**
 * ExpensesPage
 */
const ExpensesPage = () => {
  const { expenses, loading, error, totalExpenses, fetchExpenses } = useExpenses();

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [isFormOpen, setIsFormOpen]   = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [filterCat, setFilterCat]     = useState('All');
  const [searchTerm, setSearchTerm]   = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditExpense(null);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditExpense(null);
  };

  const filtered = expenses.filter((exp) => {
    const matchCat    = filterCat === 'All' || exp.category === filterCat;
    const matchSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredTotal = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-wrapper">
        <Navbar title="Expenses" onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <main className="main-content animate-fade-in">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ color: '#f1f5f9', fontSize: '1.375rem', fontWeight: 700 }}>My Expenses</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {expenses.length} expense{expenses.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
            <button
              id="add-expense-btn"
              onClick={handleAddNew}
              className="btn-gradient"
              style={{
                padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                fontSize: '0.9375rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}
            >
              ＋ Add Expense
            </button>
          </div>

          {/* Summary Bar */}
          <div className="responsive-grid-cards">
            {[
              { label: 'Total Spent', value: `₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#ef4444' },
              { label: 'Showing',     value: `₹${filteredTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#a78bfa' },
              { label: 'Transactions', value: filtered.length, color: '#60a5fa' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{stat.label}</p>
                <p style={{ color: stat.color, fontSize: '1.375rem', fontWeight: 700 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ maxWidth: '260px' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '2rem',
                    border: filterCat === cat
                      ? '1px solid rgba(124,58,237,0.6)'
                      : '1px solid rgba(255,255,255,0.1)',
                    background: filterCat === cat
                      ? 'rgba(124,58,237,0.25)'
                      : 'rgba(255,255,255,0.04)',
                    color: filterCat === cat ? '#a78bfa' : '#64748b',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              <div style={{
                width: '40px', height: '40px',
                border: '2px solid #7c3aed', borderTop: '2px solid transparent',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }} />
              Loading expenses...
            </div>
          ) : error ? (
            <div style={{
              textAlign: 'center', padding: '2rem',
              color: '#f87171', background: 'rgba(239,68,68,0.08)',
              borderRadius: '0.75rem', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              ⚠️ {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>No expenses found</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.375rem' }}>
                {filterCat !== 'All' ? `No expenses in "${filterCat}" category` : 'Click "Add Expense" to get started'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {filtered.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={handleClose}
        editData={editExpense}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ExpensesPage;
