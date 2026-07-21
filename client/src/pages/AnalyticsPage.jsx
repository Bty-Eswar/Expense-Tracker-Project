import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useExpenses } from '../context/ExpenseContext';
import { useIncomes } from '../context/IncomeContext';

const CATEGORY_COLORS = {
  Food:          '#f59e0b',
  Transport:     '#3b82f6',
  Shopping:      '#ec4899',
  Entertainment: '#8b5cf6',
  Health:        '#ef4444',
  Education:     '#10b981',
  Bills:         '#64748b',
  Other:         '#94a3b8',
};

/**
 * AnalyticsPage
 *
 * Provides interactive visual analytics and charts:
 * - Monthly Income vs Expense trends
 * - Category spending distribution donut chart
 * - Financial Health Metrics
 */
const AnalyticsPage = () => {
  const { expenses, fetchExpenses, totalExpenses } = useExpenses();
  const { incomes, fetchIncomes, totalIncome }     = useIncomes();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, [fetchExpenses, fetchIncomes]);

  /**
   * Compute monthly trends (last 6 months)
   */
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleString('en-IN', { month: 'short' });
      const yearStr = d.getFullYear();

      const monthExpenses = expenses.filter((e) => {
        const date = new Date(e.date);
        return date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
      }).reduce((sum, e) => sum + e.amount, 0);

      const monthIncomes = incomes.filter((inc) => {
        const date = new Date(inc.date);
        return date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear();
      }).reduce((sum, inc) => sum + inc.amount, 0);

      months.push({
        label: `${monthLabel} '${String(yearStr).slice(2)}`,
        expenses: monthExpenses,
        incomes: monthIncomes,
        savings: Math.max(0, monthIncomes - monthExpenses),
      });
    }

    return months;
  }, [expenses, incomes]);

  /**
   * Category spending breakdown
   */
  const categoryStats = useMemo(() => {
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const maxVal = sorted[0]?.[1] || 1;

    return { sorted, maxVal };
  }, [expenses]);

  // Overall Financial Health Score calculation (0 to 100)
  const healthScore = useMemo(() => {
    if (totalIncome === 0) return 0;
    const ratio = ((totalIncome - totalExpenses) / totalIncome) * 100;
    return Math.min(100, Math.max(0, Math.round(ratio)));
  }, [totalIncome, totalExpenses]);

  const maxMonthValue = Math.max(
    ...monthlyData.map((m) => Math.max(m.expenses, m.incomes)),
    1000
  );

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-wrapper">
        <Navbar title="Analytics & Reports" onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <main className="main-content animate-fade-in">
          {/* Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.375rem', fontWeight: 700 }}>
              Financial Analytics 📊
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Deep dive insights into your cash flow and spending patterns.
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="responsive-grid-cards">
            <div className="stat-card">
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Health Score</p>
              <p style={{ color: healthScore >= 50 ? '#10b981' : '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>
                {healthScore}/100 🛡️
              </p>
              <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {healthScore >= 50 ? 'Strong savings margin' : 'Need budget optimization'}
              </p>
            </div>

            <div className="stat-card">
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total Inflow</p>
              <p style={{ color: '#10b981', fontSize: '1.375rem', fontWeight: 700 }}>
                ₹{totalIncome.toLocaleString('en-IN')}
              </p>
              <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {incomes.length} records
              </p>
            </div>

            <div className="stat-card">
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total Outflow</p>
              <p style={{ color: '#ef4444', fontSize: '1.375rem', fontWeight: 700 }}>
                ₹{totalExpenses.toLocaleString('en-IN')}
              </p>
              <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {expenses.length} records
              </p>
            </div>

            <div className="stat-card">
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Net Savings</p>
              <p style={{ color: '#a78bfa', fontSize: '1.375rem', fontWeight: 700 }}>
                ₹{Math.max(0, totalIncome - totalExpenses).toLocaleString('en-IN')}
              </p>
              <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                All-time net balance
              </p>
            </div>
          </div>

          {/* Monthly Comparison Bar Chart */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600 }}>
                📈 6-Month Income vs Expense Trend
              </h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }} /> Income
                </span>
                <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }} /> Expense
                </span>
              </div>
            </div>

            {/* Custom Bar Graph */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem', height: '220px', paddingTop: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {monthlyData.map((m) => {
                const incHeight = Math.round((m.incomes / maxMonthValue) * 180);
                const expHeight = Math.round((m.expenses / maxMonthValue) * 180);

                return (
                  <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '180px' }}>
                      {/* Income Bar */}
                      <div
                        title={`Income: ₹${m.incomes}`}
                        style={{
                          width: '14px',
                          height: `${Math.max(incHeight, 4)}px`,
                          background: 'linear-gradient(180deg, #10b981, #059669)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease',
                        }}
                      />
                      {/* Expense Bar */}
                      <div
                        title={`Expense: ₹${m.expenses}`}
                        style={{
                          width: '14px',
                          height: `${Math.max(expHeight, 4)}px`,
                          background: 'linear-gradient(180deg, #f87171, #dc2626)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.5s ease',
                        }}
                      />
                    </div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown Bars */}
          <div className="responsive-grid-2">
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                🍩 Category Spending Distribution
              </h3>

              {categoryStats.sorted.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>
                  No expense records to analyze
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                  {categoryStats.sorted.map(([cat, amount]) => {
                    const color = CATEGORY_COLORS[cat] || '#94a3b8';
                    const pct = Math.round((amount / totalExpenses) * 100);

                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                          <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{cat}</span>
                          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>
                            ₹{amount.toLocaleString('en-IN')} ({pct}%)
                          </span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pct}%`,
                              background: color,
                              borderRadius: '99px',
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Financial Advice / Summary Box */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                💡 Smart Financial Insights
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '0.75rem' }}>
                  <p style={{ color: '#a78bfa', fontSize: '0.875rem', fontWeight: 600 }}>50-30-20 Rule Recommendation</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    Aim to allocate 50% for needs, 30% for wants, and save 20% of your total income every month.
                  </p>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem' }}>
                  <p style={{ color: '#34d399', fontSize: '0.875rem', fontWeight: 600 }}>Top Category Alert</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8125rem', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {categoryStats.sorted[0]
                      ? `Your largest expense area is "${categoryStats.sorted[0][0]}" (₹${categoryStats.sorted[0][1].toLocaleString('en-IN')}).`
                      : 'Add expenses to see detailed category analysis.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
