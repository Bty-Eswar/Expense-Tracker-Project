import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useIncomes } from '../context/IncomeContext';

const CATEGORY_STYLES = {
  Food:          { icon: '🍔', color: '#f59e0b' },
  Transport:     { icon: '🚗', color: '#3b82f6' },
  Shopping:      { icon: '🛍️', color: '#ec4899' },
  Entertainment: { icon: '🎬', color: '#8b5cf6' },
  Health:        { icon: '❤️', color: '#ef4444' },
  Education:     { icon: '📚', color: '#10b981' },
  Bills:         { icon: '📄', color: '#64748b' },
  Other:         { icon: '📦', color: '#94a3b8' },
};

/**
 * DashboardPage
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const { expenses, loading: expenseLoading, fetchExpenses, totalExpenses } = useExpenses();
  const { incomes, loading: incomeLoading, fetchIncomes, totalIncome } = useIncomes();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const loading = expenseLoading || incomeLoading;

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, [fetchExpenses, fetchIncomes]);

  const stats = useMemo(() => {
    const now = new Date();

    const thisMonthExpenses = expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthExpenseTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

    const thisMonthIncomes = incomes.filter((inc) => {
      const d = new Date(inc.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthIncomeTotal = thisMonthIncomes.reduce((sum, inc) => sum + inc.amount, 0);

    const thisMonthSavingsRate = thisMonthIncomeTotal > 0
      ? Math.round(((thisMonthIncomeTotal - thisMonthExpenseTotal) / thisMonthIncomeTotal) * 100)
      : 0;

    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0] || null;
    const maxCategoryAmount = sortedCategories[0]?.[1] || 1;
    const recentExpenses = expenses.slice(0, 5);

    return {
      thisMonthExpenseTotal,
      thisMonthIncomeTotal,
      thisMonthSavingsRate,
      byCategory: sortedCategories,
      topCategory,
      maxCategoryAmount,
      recentExpenses,
    };
  }, [expenses, incomes]);

  const netBalance = totalIncome - totalExpenses;

  const statCards = [
    {
      label:   'Net Balance',
      value:   `₹${netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon:    netBalance >= 0 ? '📈' : '📉',
      color:   netBalance >= 0 ? '#10b981' : '#ef4444',
      sub:     'Net savings all time',
    },
    {
      label:   'Total Income',
      value:   `₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon:    '💰',
      color:   '#10b981',
      sub:     `${incomes.length} transactions`,
    },
    {
      label:   'Total Spent',
      value:   `₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      icon:    '💸',
      color:   '#ef4444',
      sub:     `${expenses.length} transactions`,
    },
    {
      label:   'Savings Rate',
      value:   `${stats.thisMonthSavingsRate}%`,
      icon:    '🎯',
      color:   '#a78bfa',
      sub:     `This month (${new Date().toLocaleString('en-IN', { month: 'short' })})`,
    },
  ];

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-wrapper">
        <Navbar title="Dashboard" onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <main className="main-content animate-fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
              Good day, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
              Here's an overview of your financial health.
            </p>
          </div>

          {loading && expenses.length === 0 && incomes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              <div style={{
                width: '40px', height: '40px',
                border: '2px solid #7c3aed', borderTop: '2px solid transparent',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }} />
              Loading your data...
            </div>
          ) : (
            <>
              {/* Responsive Cards Grid */}
              <div className="responsive-grid-cards">
                {statCards.map((card) => (
                  <div key={card.label} className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ color: '#64748b', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                          {card.label}
                        </p>
                        <p style={{ color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.2 }}>
                          {card.value}
                        </p>
                        <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.3rem' }}>
                          {card.sub}
                        </p>
                      </div>
                      <div style={{
                        width: '42px', height: '42px',
                        background: `${card.color}18`,
                        border: `1px solid ${card.color}30`,
                        borderRadius: '0.625rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', flexShrink: 0,
                      }}>
                        <span>{card.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom 2-Column Grid */}
              <div className="responsive-grid-2">
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                    💰 Spending by Category
                  </h3>

                  {stats.byCategory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                      <p>No data yet</p>
                      <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Add expenses to see breakdown</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {stats.byCategory.map(([category, amount]) => {
                        const style  = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
                        const pct    = Math.round((amount / totalExpenses) * 100);
                        const barPct = Math.round((amount / stats.maxCategoryAmount) * 100);

                        return (
                          <div key={category}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1rem' }}>{style.icon}</span>
                                <span style={{ color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 500 }}>
                                  {category}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{pct}%</span>
                                <span style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>
                                  ₹{amount.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                            <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
                              <div style={{
                                height: '100%', borderRadius: '99px',
                                width: `${barPct}%`,
                                background: style.color,
                                transition: 'width 0.6s ease',
                              }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600 }}>
                      🕐 Recent Expenses
                    </h3>
                    <button
                      onClick={() => navigate('/expenses')}
                      style={{
                        background: 'rgba(124,58,237,0.15)',
                        border: '1px solid rgba(124,58,237,0.3)',
                        color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600,
                        padding: '0.25rem 0.75rem', borderRadius: '2rem',
                        cursor: 'pointer',
                      }}
                    >
                      View all →
                    </button>
                  </div>

                  {stats.recentExpenses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
                      <p style={{ color: '#64748b' }}>No expenses yet</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {stats.recentExpenses.map((exp) => {
                        const style = CATEGORY_STYLES[exp.category] || CATEGORY_STYLES.Other;
                        const date  = new Date(exp.date).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short',
                        });
                        return (
                          <div key={exp._id} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.625rem 0.75rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '0.625rem',
                          }}>
                            <div style={{
                              width: '36px', height: '36px', flexShrink: 0,
                              background: `${style.color}18`,
                              border: `1px solid ${style.color}30`,
                              borderRadius: '0.5rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '1.1rem',
                            }}>
                              {style.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                color: '#e2e8f0', fontSize: '0.875rem', fontWeight: 600,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              }}>
                                {exp.title}
                              </p>
                              <p style={{ color: '#475569', fontSize: '0.7rem', marginTop: '0.1rem' }}>
                                {date} · {exp.category}
                              </p>
                            </div>
                            <p style={{ color: '#f87171', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>
                              −₹{exp.amount.toLocaleString('en-IN')}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default DashboardPage;
