// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-gray-600">Loading user data...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user.fullName}!
          </h1>
          <p className="text-lg text-gray-600">
            Role: <span className="font-semibold capitalize text-blue-600">{user.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {user.role === 'student' && (
                  <>
                    <Link to="/events" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                      <FaCalendarAlt />
                      <span>Browse Events</span>
                    </Link>
                    <li>View My Registrations</li>
                    <li>View My Reviews</li>
                    <li>Update Profile</li>
                  </>
                )}
                {user.role === 'coordinator' && (
                  <>
                    <li>Create New Event</li>
                    <li>Manage My Events</li>
                    <li>View Event Registrations</li>
                    <li>Mark Attendance</li>
                  </>
                )}
                {(user.role === 'faculty' || user.role === 'headFaculty') && (
                  <>
                    <li>Access Admin Dashboard</li>
                    <li>View All Registrations</li>
                    <li>View All Attendance</li>
                  </>
                )}
                {user.role === 'headFaculty' && (
                  <>
                    <li>Approve/Reject Events</li>
                    <li>Manage Users (Roles)</li>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Statistics</h2>
              {/* Add role-specific statistics here */}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              {/* Add recent activity feed here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;