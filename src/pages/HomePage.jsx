// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Event Management System
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline your college events with our comprehensive management platform
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition duration-300"
            >
              Browse Events
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transform hover:-translate-y-1 transition duration-300"
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <div className="text-blue-600 text-4xl mb-4">
              <FaCalendarAlt />
            </div>
            <h3 className="text-xl font-bold mb-2">Event Management</h3>
            <p className="text-gray-600">
              Create, manage, and track college events with ease
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <div className="text-purple-600 text-4xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-xl font-bold mb-2">Club Organization</h3>
            <p className="text-gray-600">
              Manage club activities and member registrations
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <div className="text-green-600 text-4xl mb-4">
              <FaChartBar />
            </div>
            <h3 className="text-xl font-bold mb-2">Analytics & Reports</h3>
            <p className="text-gray-600">
              Track attendance and generate detailed reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;