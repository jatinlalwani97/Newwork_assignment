import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import NotFoundPage from "./pages/NotFound";
import Navigation from "./components/Navigation";
import AuthProvider from "./store/authProvider";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashbord";
import { useAuth } from "./store/authProvider";
import { ToastContainer } from "react-toastify";
import CreateProject from "./pages/CreateProject";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return null;
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  if (isInitializing) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/create"
              element={
                <PrivateRoute>
                  <CreateProject />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/edit/:id"
              element={
                <PrivateRoute>
                  <CreateProject />
                </PrivateRoute>
              }
            />

            {/* Catch all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
