import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import IncomeCard from '../components/common/IncomeCard';
import IncomeForm from '../components/common/IncomeForm';
import { useIncomes } from '../context/IncomeContext';

const CATEGORIES = ['All', 'Salary', 'Freelance', 'Investment', 'Gifts', 'Refunds', 'Other'];

/**
 * IncomePage
 */
const IncomePage = () => {
  const { incomes, loading, error, totalIncome, fetchIncomes } = useIncomes();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editIncome, setEditIncome] = useState(null);
  const [filterCat, setFilterCat]   = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleEdit = (income) => {
    setEditIncome(income);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditIncome(null);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditIncome(null);
  };

  const filtered = incomes.filter((inc) => {
    const matchCat    = filterCat === 'All' || inc.category === filterCat;
    const matchSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredTotal = filtered.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-wrapper">
        <Navbar title="Income" onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <main className="main-content animate-fade-in">
          {/* Page Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ color: '#f1f5f9', fontSize: '1.375rem', fontWeight: 700 }}>My Incomes</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {incomes.length} income transaction{incomes.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
            <button
              id="add-income-btn"
              onClick={handleAddNew}
              className="btn-gradient"
              style={{
                padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                fontSize: '0.9375rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}
            >
              ＋ Add Income
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="responsive-grid-cards">
            {[
              { label: 'Total Inflow', value: `₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#10b981' },
              { label: 'Selected Total', value: `₹${filteredTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#a78bfa' },
              { label: 'Transactions', value: filtered.length, color: '#60a5fa' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card">
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{stat.label}</p>
                <p style={{ color: stat.color, fontSize: '1.375rem', fontWeight: 700 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter and Search Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Search incomes..."
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
                    fontSize: '0.8125rem', fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Data List Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              <div style={{
                width: '40px', height: '40px',
                border: '2px solid #7c3aed', borderTop: '2px solid transparent',
                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem',
              }} />
              Loading incomes...
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
              <p style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>No incomes found</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.375rem' }}>
                {filterCat !== 'All' ? `No incomes in "${filterCat}" category` : 'Click "Add Income" to get started'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {filtered.map((income) => (
                <IncomeCard
                  key={income._id}
                  income={income}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <IncomeForm
        isOpen={isFormOpen}
        onClose={handleClose}
        editData={editIncome}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default IncomePage;
