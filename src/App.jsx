// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth hook
import Navbar from './components/Layout/Navbar'; // Import Navbar component
import { toast } from 'sonner'; // Import toast for notifications

// Import your page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

// A simple PrivateRoute component to protect routes based on authentication and roles
const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show a loading indicator while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-xl text-gray-600">
        Loading authentication...
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    toast.error("You need to be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles are specified, check if the user's role is included
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    toast.error("You do not have permission to access this page.");
    // Redirect to a more appropriate page, e.g., their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the children (the protected component)
  return children;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Render the Navbar at the top of your app */}
      <main className="flex-grow"> {/* Main content area, takes remaining height */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['student', 'coordinator', 'faculty', 'headFaculty']}>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute allowedRoles={['headFaculty', 'faculty']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          {/* Example: Coordinator-specific event creation page (placeholder) */}
          <Route
            path="/events/create"
            element={
              <PrivateRoute allowedRoles={['coordinator']}>
                <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-2xl text-green-600 font-bold">
                  Create Event Page (Coordinator Only - Coming Soon!)
                </div>
              </PrivateRoute>
            }
          />
          {/* Example: Head Faculty event approval page (placeholder) */}
          <Route
            path="/events/approve"
            element={
              <PrivateRoute allowedRoles={['headFaculty']}>
                <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-2xl text-purple-600 font-bold">
                  Approve Events Page (Head Faculty Only - Coming Soon!)
                </div>
              </PrivateRoute>
            }
          />

          {/* Catch-all for undefined routes (404 Page) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* <Footer /> */} {/* You can add a Footer component here later */}
    </div>
  );
}

export default App;