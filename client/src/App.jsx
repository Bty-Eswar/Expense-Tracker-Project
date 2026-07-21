import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { IncomeProvider } from './context/IncomeContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import DashboardPage  from './pages/DashboardPage';
import ExpensesPage   from './pages/ExpensesPage';
import IncomePage     from './pages/IncomePage';
import AnalyticsPage  from './pages/AnalyticsPage';
import CategoriesPage from './pages/CategoriesPage';
import SettingsPage   from './pages/SettingsPage';

/**
 * App — Root Component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExpenseProvider>
          <IncomeProvider>
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

              <Route path="/income" element={
                <ProtectedRoute><IncomePage /></ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
              } />

              <Route path="/categories" element={
                <ProtectedRoute><CategoriesPage /></ProtectedRoute>
              } />

              <Route path="/settings" element={
                <ProtectedRoute><SettingsPage /></ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </IncomeProvider>
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
