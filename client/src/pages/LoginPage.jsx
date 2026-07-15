import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axiosConfig';

/**
 * LoginPage
 *
 * Public page — accessible without a token.
 * Calls POST /api/auth/login → receives user + token → stores in AuthContext → navigates to dashboard.
 */
const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.data);         // save user + token to context + localStorage
      navigate('/dashboard');   // redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1035 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '1rem',
    }}>

      {/* Background decorative orbs */}
      <div className="orb" style={{
        width: '400px', height: '400px',
        background: 'rgba(124, 58, 237, 0.15)',
        top: '-100px', left: '-100px',
        animationDelay: '0s',
      }} />
      <div className="orb" style={{
        width: '300px', height: '300px',
        background: 'rgba(37, 99, 235, 0.12)',
        bottom: '-80px', right: '-80px',
        animationDelay: '4s',
      }} />

      {/* Login Card */}
      <div
        className="glass-card animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💰</div>
          <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            ExpenseTracker Pro
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.625rem',
            padding: '0.75rem 1rem',
            color: '#f87171',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.375rem',
            }}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label style={{
              display: 'block',
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.375rem',
            }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-gradient"
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '0.625rem',
              fontSize: '1rem',
              fontWeight: 600,
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '18px', height: '18px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: '#64748b',
          fontSize: '0.9375rem',
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#a78bfa',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Create one
          </Link>
        </p>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
