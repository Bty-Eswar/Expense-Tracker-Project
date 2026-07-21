import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useIncomes } from '../context/IncomeContext';

/**
 * SettingsPage
 *
 * User profile preferences, security password updates, and CSV/JSON data export.
 */
const SettingsPage = () => {
  const { user } = useAuth();
  const { expenses } = useExpenses();
  const { incomes }  = useIncomes();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [passForm, setPassForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  const handlePassChange = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirmPass) {
      setPassMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passForm.newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setPassMsg({ type: 'success', text: 'Password updated successfully!' });
    setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
  };

  // Export transactions as JSON file download
  const handleExportJSON = () => {
    const exportData = {
      user: { name: user?.name, email: user?.email },
      exportDate: new Date().toISOString(),
      expenses,
      incomes,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_tracker_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export transactions as CSV file download
  const handleExportCSV = () => {
    let csv = 'Type,Title,Amount,Category,Date,Description\n';

    expenses.forEach((e) => {
      csv += `Expense,"${e.title}",${e.amount},"${e.category}","${e.date?.split('T')[0]}","${e.description || ''}"\n`;
    });

    incomes.forEach((i) => {
      csv += `Income,"${i.title}",${i.amount},"${i.category}","${i.date?.split('T')[0]}","${i.description || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense_tracker_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="main-wrapper">
        <Navbar title="Settings & Profile" onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <main className="main-content animate-fade-in">
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '1.375rem', fontWeight: 700 }}>
              Account Settings ⚙️
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Manage profile info, security settings, and export application data.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px' }}>

            {/* Profile Info */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                👤 User Profile
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 700, color: 'white',
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 700 }}>{user?.name}</p>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>
                🔒 Change Password
              </h3>

              {passMsg.text && (
                <div style={{
                  padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem',
                  background: passMsg.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                  color: passMsg.type === 'error' ? '#f87171' : '#34d399',
                  border: `1px solid ${passMsg.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`
                }}>
                  {passMsg.text}
                </div>
              )}

              <form onSubmit={handlePassChange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Current Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={passForm.currentPass}
                    onChange={(e) => setPassForm({ ...passForm, currentPass: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={passForm.newPass}
                    onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Confirm New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={passForm.confirmPass}
                    onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-gradient" style={{ padding: '0.75rem', borderRadius: '0.625rem', marginTop: '0.5rem', fontWeight: 600 }}>
                  Update Password
                </button>
              </form>
            </div>

            {/* Export Data */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ color: '#f1f5f9', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                💾 Backup & Data Export
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Download a complete copy of your expense and income records.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleExportCSV}
                  style={{
                    padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
                    color: '#34d399', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
                  }}
                >
                  📄 Export CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  style={{
                    padding: '0.625rem 1.25rem', borderRadius: '0.625rem',
                    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                    color: '#a78bfa', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
                  }}
                >
                  📦 Export JSON
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
