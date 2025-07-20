// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-gray-600">Loading user data...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Welcome to Your Dashboard, {user.fullName}!
      </h1>
      <p className="text-center text-gray-600 text-lg">
        Your Role: <span className="font-semibold capitalize text-blue-600">{user.role}</span>
      </p>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Quick Links</h3>
        <ul className="list-disc list-inside text-gray-700">
          {user.role === 'student' && (
            <>
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
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;