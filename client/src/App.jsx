import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage  from './pages/ExpensesPage';

/**
 * App — Root Component
 *
 * Wraps the entire app in:
 * 1. BrowserRouter  → enables client-side routing
 * 2. AuthProvider   → provides global auth state to all components
 *
 * Route structure:
 * /            → redirect to /login
 * /login       → LoginPage    (public)
 * /register    → RegisterPage (public)
 * /dashboard   → DashboardPage (protected — requires login)
 *
 * Any route not defined → redirect to /login
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExpenseProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />

            <Route path="/expenses" element={
              <ProtectedRoute><ExpensesPage /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
