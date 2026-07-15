import { useAuth } from '../../context/AuthContext';

/**
 * Navbar
 *
 * Top navigation bar for the dashboard layout.
 * Shows a greeting on the left and the current date + user badge on the right.
 * Positioned to the right of the fixed Sidebar (marginLeft: 260px).
 */
const Navbar = ({ title = 'Dashboard' }) => {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: '260px',
        right: 0,
        height: '64px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        zIndex: 30,
      }}
    >
      {/* Left: Page title */}
      <div>
        <h1 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#f1f5f9',
        }}>
          {title}
        </h1>
        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{today}</p>
      </div>

      {/* Right: User badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '2rem',
        padding: '0.375rem 0.875rem 0.375rem 0.375rem',
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'white',
          flexShrink: 0,
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: '0.875rem', color: '#cbd5e1', fontWeight: 500 }}>
          {user?.name}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
