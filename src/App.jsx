// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import useAuth hook
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { NotificationProvider } from './context/NotificationContext'; // Import NotificationProvider
import Navbar from './components/Layout/Navbar'; // Import Navbar component
import Footer from './components/Layout/Footer'; // Import Footer component
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
import EventCreationPage from './pages/EventCreationPage'; // Import the new EventCreationPage
import RegistrationsPage from './pages/RegistrationsPage';
import AttendancePage from './pages/AttendancePage';
import ClubsPage from './pages/ClubsPage';
import ClubCreationPage from './pages/ClubCreationPage';
import MyReviewsPage from './pages/MyReviewsPage'; // Import MyReviewsPage
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import UserManagementPage from './pages/UserManagementPage'; // Import UserManagementPage
import CoordinatorDashboard from './pages/CoordinatorDashboard'; // Import CoordinatorDashboard
import FacultyDashboard from './pages/FacultyDashboard'; // Import FacultyDashboard
import StudentDashboard from './pages/StudentDashboard'; // Import StudentDashboard
import AnalyticsPage from './pages/AnalyticsPage'; // Import AnalyticsPage
import SearchPage from './pages/SearchPage'; // Import SearchPage
import CalendarPage from './pages/CalendarPage'; // Import CalendarPage
import ReportsPage from './pages/ReportsPage'; // Import ReportsPage

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
    <AuthProvider>
      <NotificationProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar /> {/* Render the Navbar at the top of your app */}
          <main className="flex-grow"> {/* Main content area, takes remaining height */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Event Routes */}
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route
                path="/events/create"
                element={
                  <PrivateRoute allowedRoles={['coordinator']}>
                    <EventCreationPage />
                  </PrivateRoute>
                }
              />

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
              <Route
                path="/coordinator/dashboard"
                element={
                  <PrivateRoute allowedRoles={['coordinator']}>
                    <CoordinatorDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/faculty/dashboard"
                element={
                  <PrivateRoute allowedRoles={['faculty', 'headFaculty']}>
                    <FacultyDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/student/dashboard"
                element={
                  <PrivateRoute allowedRoles={['student']}>
                    <StudentDashboard />
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

              {/* Registration Routes */}
              <Route
                path="/registrations"
                element={
                  <PrivateRoute allowedRoles={['student']}>
                    <RegistrationsPage />
                  </PrivateRoute>
                }
              />

              {/* Attendance Routes */}
              <Route
                path="/events/:eventId/attendance"
                element={
                  <PrivateRoute allowedRoles={['coordinator']}>
                    <AttendancePage />
                  </PrivateRoute>
                }
              />

              {/* Club Routes */}
              <Route path="/clubs" element={<ClubsPage />} />
              <Route
                path="/clubs/create"
                element={
                  <PrivateRoute allowedRoles={['headFaculty']}>
                    <ClubCreationPage />
                  </PrivateRoute>
                }
              />

              {/* Reviews Route */}
              <Route
                path="/my-reviews"
                element={
                  <PrivateRoute allowedRoles={['student']}>
                    <MyReviewsPage />
                  </PrivateRoute>
                }
              />

              {/* Profile Route */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute allowedRoles={['student', 'coordinator', 'faculty', 'headFaculty']}>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              {/* User Management Route */}
              <Route
                path="/admin/users"
                element={
                  <PrivateRoute allowedRoles={['headFaculty']}>
                    <UserManagementPage />
                  </PrivateRoute>
                }
              />

              {/* Analytics Route */}
              <Route
                path="/analytics"
                element={
                  <PrivateRoute allowedRoles={['faculty', 'headFaculty']}>
                    <AnalyticsPage />
                  </PrivateRoute>
                }
              />

              {/* Search Route */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route
                path="/reports"
                element={
                  <PrivateRoute allowedRoles={['faculty', 'headFaculty']}>
                    <ReportsPage />
                  </PrivateRoute>
                }
              />

              {/* Catch-all for undefined routes (404 Page) */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer /> {/* Add Footer at the bottom of the app */}
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;