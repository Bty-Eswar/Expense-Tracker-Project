import { useAuth } from '../../context/AuthContext';

/**
 * Navbar
 *
 * Top navigation header.
 * Responsive: Adjusts left positioning and shows hamburger menu button on mobile devices (<768px).
 *
 * @param {string}   title       - Page title
 * @param {Function} onMenuClick - Mobile drawer toggle trigger
 */
const Navbar = ({ title = 'Dashboard', onMenuClick }) => {
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
        left: window.innerWidth > 768 ? '260px' : '0',
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
      {/* Left: Mobile Menu Toggle + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMenuClick}
          className="mobile-only"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.5rem',
            color: '#f1f5f9',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}
        >
          ☰
        </button>

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
          {user?.name?.split(' ')[0]}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
