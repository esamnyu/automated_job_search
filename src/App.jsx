// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Page imports
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';

// Components
import NavBar from './components/ui/NavBar';

function App() {
  console.log('App component rendering');

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <NavBar />

          {/* Debug Info */}
          <div className="container mx-auto p-2 my-2 bg-yellow-100 rounded text-sm">
            <p>Debug Info:</p>
            <p>Current URL: {window.location.href}</p>
            <p>Pathname: {window.location.pathname}</p>
          </div>

          {/* Main Content Area */}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Move ProtectedRoute inside App component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  console.log('ProtectedRoute - currentUser:', currentUser, 'loading:', loading);

  if (loading) return null;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
