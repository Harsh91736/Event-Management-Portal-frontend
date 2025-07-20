// src/pages/AdminDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();

  if (!user || (user.role !== 'headFaculty' && user.role !== 'faculty')) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-red-600">Access Denied: Not an authorized admin role.</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Admin Dashboard ({user.role === 'headFaculty' ? 'Head Faculty' : 'Faculty'})
      </h1>
      <p className="text-center text-gray-600 text-lg">
        This is where administrative tasks and reports will be managed.
      </p>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Admin Features</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>User Management (Assign/Remove Coordinator Roles)</li>
          <li>Club Management (Create/Update/Delete Clubs)</li>
          <li>Event Approval/Rejection</li>
          <li>View All Registrations</li>
          <li>View All Attendance Records</li>
          <li>Download Attendance Reports</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;