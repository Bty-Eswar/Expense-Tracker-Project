import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';

/**
 * Stat card data — placeholders until Phase 5 adds real data
 */
const stats = [
  { label: 'Total Balance',   value: '₹0.00',  icon: '💰', color: '#7c3aed', change: '+0%' },
  { label: 'Total Income',    value: '₹0.00',  icon: '📈', color: '#10b981', change: '+0%' },
  { label: 'Total Expenses',  value: '₹0.00',  icon: '📉', color: '#ef4444', change: '+0%' },
  { label: 'Savings Rate',    value: '0%',      icon: '🎯', color: '#f59e0b', change: '+0%' },
];

/**
 * DashboardPage
 *
 * The main screen after login. Layout: fixed Sidebar + sticky Navbar + scrollable content.
 * Phase 5 will replace placeholders with real expense data.
 */
const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content — offset by sidebar width */}
      <div style={{ flex: 1, marginLeft: '260px' }}>

        {/* Sticky Navbar */}
        <Navbar title="Dashboard" />

        {/* Page Content — padded below navbar */}
        <main
          className="animate-fade-in"
          style={{ padding: '5.5rem 1.75rem 2rem' }}
        >

          {/* Welcome Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: '0.25rem',
            }}>
              Good day, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
              Here's an overview of your financial health.
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.375rem' }}>
                      {stat.label}
                    </p>
                    <p style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700 }}>
                      {stat.value}
                    </p>
                    <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {stat.change} this month
                    </p>
                  </div>
                  <div style={{
                    width: '44px', height: '44px',
                    background: `${stat.color}20`,
                    border: `1px solid ${stat.color}30`,
                    borderRadius: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                  }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Expenses Placeholder */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600 }}>
                Recent Expenses
              </h3>
              <span style={{
                background: 'rgba(124, 58, 237, 0.15)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                color: '#a78bfa',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.75rem',
                borderRadius: '2rem',
              }}>
                Coming in Phase 5
              </span>
            </div>

            {/* Empty State */}
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#475569',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b', marginBottom: '0.375rem' }}>
                No expenses yet
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                Expense CRUD will be added in Phase 5
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
