import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useExpenses } from '../context/ExpenseContext';

const DEFAULT_CATEGORIES = [
  { name: 'Food',          icon: '🍔', color: '#f59e0b', defaultBudget: 10000 },
  { name: 'Transport',     icon: '🚗', color: '#3b82f6', defaultBudget: 5000  },
  { name: 'Shopping',      icon: '🛍️', color: '#ec4899', defaultBudget: 15000 },
  { name: 'Entertainment', icon: '🎬', color: '#8b5cf6', defaultBudget: 8000  },
  { name: 'Health',        icon: '❤️', color: '#ef4444', defaultBudget: 6000  },
  { name: 'Education',     icon: '📚', color: '#10b981', defaultBudget: 12000 },
  { name: 'Bills',         icon: '📄', color: '#64748b', defaultBudget: 10000 },
  { name: 'Other',         icon: '📦', color: '#94a3b8', defaultBudget: 5000  },
];

/**
 * CategoriesPage
 *
 * View category spending and dynamically edit/customize category budget limits.
 * Custom budgets are saved in localStorage so preferences persist across sessions.
 */
const CategoriesPage = () => {
  const { expenses, fetchExpenses } = useExpenses();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load custom budgets from localStorage or default values
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('expense_tracker_budgets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    const initial = {};
    DEFAULT_CATEGORIES.forEach((c) => { initial[c.name] = c.defaultBudget; });
    return initial;
  });

  // Modal edit budget state
  const [editingCategory, setEditingCategory] = useState(null);
  const [newBudgetVal, setNewBudgetVal]       = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Aggregate total spent per category
  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  }, [expenses]);

  // Open edit modal
  const handleStartEdit = (categoryName, currentBudget) => {
    setEditingCategory(categoryName);
    setNewBudgetVal(currentBudget);
  };

  // Save new budget limit
  const handleSaveBudget = (e) => {
    e.preventDefault();
    const parsed = parseFloat(newBudgetVal);
    if (isNaN(parsed) || parsed <= 0) return;

    const updated = { ...budgets, [editingCategory]: parsed };
    setBudgets(updated);
    localStorage.setItem('expense_tracker_budgets', JSON.stringify(updated));
    setEditingCategory(null);
  };

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-wrapper">
        <Navbar title="Categories & Budgets" onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <main className="main-content animate-fade-in">
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.375rem', fontWeight: 700 }}>
              Category Budgets 🏷️
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Monitor spending limits and custom allocate monthly budgets for each category.
            </p>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {DEFAULT_CATEGORIES.map((cat) => {
              const categoryBudget = budgets[cat.name] || cat.defaultBudget;
              const spent = categoryTotals[cat.name] || 0;
              const pct = Math.min(100, Math.round((spent / categoryBudget) * 100));
              const isOver = spent > categoryBudget;

              return (
                <div key={cat.name} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '0.625rem',
                        background: `${cat.color}18`, border: `1px solid ${cat.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                      }}>
                        {cat.icon}
                      </div>
                      <div>
                        <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600 }}>{cat.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                          Limit: ₹{categoryBudget.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleStartEdit(cat.name, categoryBudget)}
                        title="Edit Budget Limit"
                        style={{
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem', color: '#a78bfa', cursor: 'pointer',
                          padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '0.25rem'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600,
                        background: isOver ? 'rgba(239,68,68,0.15)' : `${cat.color}18`,
                        color: isOver ? '#f87171' : cat.color,
                        border: `1px solid ${isOver ? 'rgba(239,68,68,0.3)' : `${cat.color}30`}`
                      }}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', marginBottom: '0.75rem' }}>
                    <div style={{
                      height: '100%', borderRadius: '99px',
                      width: `${pct}%`,
                      background: isOver ? '#ef4444' : cat.color,
                      transition: 'width 0.6s ease'
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: '#94a3b8' }}>Spent: <strong style={{ color: '#f1f5f9' }}>₹{spent.toLocaleString('en-IN')}</strong></span>
                    <span style={{ color: isOver ? '#f87171' : '#34d399' }}>
                      {isOver ? `Over by ₹${(spent - categoryBudget).toLocaleString('en-IN')}` : `Left: ₹${(categoryBudget - spent).toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <div
          onClick={() => setEditingCategory(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 55,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-card animate-slide-up"
            style={{ width: '100%', maxWidth: '400px', padding: '1.75rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 700 }}>
                ✏️ Edit Budget: {editingCategory}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '1.1rem', cursor: 'pointer' }}
              >✕</button>
            </div>

            <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>
                  New Budget Limit (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  className="input-field"
                  value={newBudgetVal}
                  onChange={(e) => setNewBudgetVal(e.target.value)}
                  placeholder="Enter amount e.g. 12000"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#94a3b8', cursor: 'pointer', fontWeight: 500
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient"
                  style={{ flex: 1, padding: '0.625rem', borderRadius: '0.625rem', fontWeight: 600 }}
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
