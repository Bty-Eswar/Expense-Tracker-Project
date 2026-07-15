import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 *
 * A wrapper component that guards pages requiring authentication.
 *
 * How it works:
 * 1. If auth is still loading (checking localStorage) → show nothing
 *    (avoids a flash of the login page before the user is confirmed logged in)
 * 2. If user is NOT logged in → redirect to /login
 * 3. If user IS logged in → render the actual page (children)
 *
 * Usage in App.jsx:
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   } />
 *
 * @param {ReactNode} children - The page component to render if authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();

  // Still initializing from localStorage — don't render anything yet
  // This prevents a brief redirect to /login on page refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f172a' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent
            rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login page
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Logged in — render the protected page
  return children;
};

export default ProtectedRoute;
