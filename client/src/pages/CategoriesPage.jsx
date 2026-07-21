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
 * Overview of categories and budget usage tracking.
 */
const CategoriesPage = () => {
  const { expenses, fetchExpenses } = useExpenses();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Aggregate spent per category
  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
  }, [expenses]);

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
              Monitor spending limits and allocations per expense category.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {DEFAULT_CATEGORIES.map((cat) => {
              const spent = categoryTotals[cat.name] || 0;
              const pct = Math.min(100, Math.round((spent / cat.defaultBudget) * 100));
              const isOver = spent > cat.defaultBudget;

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
                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Limit: ₹{cat.defaultBudget.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600,
                      background: isOver ? 'rgba(239,68,68,0.15)' : `${cat.color}18`,
                      color: isOver ? '#f87171' : cat.color,
                      border: `1px solid ${isOver ? 'rgba(239,68,68,0.3)' : `${cat.color}30`}`
                    }}>
                      {pct}%
                    </span>
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
                      {isOver ? `Over by ₹${(spent - cat.defaultBudget).toLocaleString('en-IN')}` : `Left: ₹${(cat.defaultBudget - spent).toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoriesPage;
