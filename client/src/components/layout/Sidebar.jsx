import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',   icon: '📊', path: '/dashboard'  },
  { label: 'Expenses',    icon: '💳', path: '/expenses'   },
  { label: 'Income',      icon: '💰', path: '/income'     },
  { label: 'Analytics',   icon: '📈', path: '/analytics'  },
  { label: 'Categories',  icon: '🏷️', path: '/categories' },
  { label: 'Settings',    icon: '⚙️', path: '/settings'   },
];

/**
 * Sidebar
 *
 * Left-side navigation panel.
 * Responsive: Fixed sidebar on desktop; Drawer overlay on mobile (<768px).
 *
 * @param {boolean}  isMobileOpen - Whether mobile drawer is open
 * @param {Function} onClose      - Callback to close mobile drawer
 */
const Sidebar = ({ isMobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
        />
      )}

      <aside
        style={{
          width: '260px',
          minHeight: '100vh',
          background: 'rgba(15, 23, 42, 0.98)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 1rem',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease',
          transform: isMobileOpen || window.innerWidth > 768 ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Header Logo + Mobile Close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.5rem 2rem' }}>
          <div>
            <div className="gradient-text" style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              💰 ExpenseTracker
            </div>
            <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Pro Edition
            </p>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="mobile-only"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '1rem',
          marginTop: '1rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                color: '#f1f5f9',
                fontSize: '0.875rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user?.name}
              </p>
              <p style={{
                color: '#475569',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '0.625rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '0.625rem',
              color: '#f87171',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
