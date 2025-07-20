// src/pages/HomePage.jsx
import React from 'react';

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 mb-6 text-center">
        Welcome to the EMS!
      </h1>
      <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl">
        Your one-stop solution for managing college events, registrations, attendance, and reviews.
      </p>
      <div className="mt-8 flex space-x-4">
        {/* Placeholder for future buttons like "Browse Events" or "Login" */}
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Explore Events
        </button>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300">
          Register Now
        </button>
      </div>
    </div>
  );
}

export default HomePage;