// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Page imports
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

// Layout components
import NavBar from './components/ui/NavBar';

// Protected Route wrapper component
const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

// Layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

// Public Route wrapper component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return currentUser ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/" element={
            <PrivateRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </PrivateRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;