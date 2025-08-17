import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LibrarianDashboard from './pages/LibrarianDashboard';
import UserDashboard from './pages/UserDashboard';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route
          path="/librarian/*"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect based on user role */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'MEMBER' ? (
                <Navigate to="/user" replace />
              ) : (
                <Navigate to="/librarian" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;

