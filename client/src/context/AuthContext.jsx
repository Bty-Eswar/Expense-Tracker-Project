import { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext
 *
 * Provides authentication state globally to the entire application.
 * Any component can access the logged-in user and auth functions
 * without prop drilling.
 *
 * What it stores:
 * - user: { _id, name, email, token } or null
 * - loading: true while checking localStorage on app startup
 *
 * What it provides:
 * - user         → the logged-in user object
 * - loading      → is auth state being initialized?
 * - login(data)  → called after successful login/register
 * - logout()     → clears all auth state
 * - isAuth       → boolean shorthand for !!user
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true on first load

  /**
   * On app startup — check if user was previously logged in
   * localStorage persists across page refreshes
   * Without this, the user would be logged out every time they refresh
   */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // If localStorage data is corrupted, clear it
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * login(data)
   * Called after a successful API response from /auth/register or /auth/login
   * Stores user info + token in state AND localStorage
   *
   * @param {Object} data - { _id, name, email, token }
   */
  const login = (data) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
  };

  /**
   * logout()
   * Clears user from state and localStorage
   * The user will be redirected to /login by ProtectedRoute
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuth: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth — Custom hook
 *
 * Shorthand for useContext(AuthContext).
 * Usage: const { user, login, logout, isAuth } = useAuth();
 *
 * Throws an error if used outside AuthProvider — helps catch bugs early.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
