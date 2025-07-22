// src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome, FaCalendarAlt, FaUsersCog, FaUsers, FaCalendar, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                EMS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <Link to="/calendar" className="nav-link">Calendar</Link>
            <Link to="/clubs" className="nav-link">Clubs</Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="nav-link-button">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="nav-link-button">
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <Link to="/register" className="register-button">
                  <FaUserPlus className="mr-2" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <Link to="/events" className="mobile-nav-link">Events</Link>
            <Link to="/calendar" className="mobile-nav-link">Calendar</Link>
            <Link to="/clubs" className="mobile-nav-link">Clubs</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="mobile-nav-link">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left mobile-nav-link text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link">Login</Link>
                <Link to="/register" className="mobile-nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;