// src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path if needed
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome, FaCalendarAlt, FaUsersCog } from 'react-icons/fa'; // Example icons

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="bg-blue-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <Link to="/" className="text-white text-2xl font-bold hover:text-blue-200 transition duration-300">
          EMS
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-200 transition duration-300 flex items-center">
            <FaHome className="mr-1" /> Home
          </Link>
          <Link to="/events" className="text-white hover:text-blue-200 transition duration-300 flex items-center">
            <FaCalendarAlt className="mr-1" /> Events
          </Link>

          {isAuthenticated ? (
            <>
              {/* Authenticated User Links */}
              <Link to="/dashboard" className="text-white hover:text-blue-200 transition duration-300 flex items-center">
                <FaUserCircle className="mr-1" /> Dashboard
              </Link>

              {/* Admin/Head Faculty Link */}
              {(user?.role === 'headFaculty' || user?.role === 'faculty') && (
                <Link to="/admin-dashboard" className="text-white hover:text-blue-200 transition duration-300 flex items-center">
                  <FaUsersCog className="mr-1" /> Admin
                </Link>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300 flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </>
          ) : (
            <>
              {/* Unauthenticated User Links */}
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center">
                <FaSignInAlt className="mr-1" /> Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center">
                <FaUserPlus className="mr-1" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;