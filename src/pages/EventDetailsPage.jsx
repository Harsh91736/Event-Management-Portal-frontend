// src/pages/EventDetailsPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function EventDetailsPage() {
  const { id } = useParams(); // Get event ID from URL
  return (
    <div className="min-h-[calc(100vh-80px)] p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Event Details for ID: <span className="text-blue-600">{id}</span>
      </h1>
      <p className="text-center text-gray-600">Detailed event information, registration, attendance, and reviews will go here.</p>
      {/* Detailed event view will be added later */}
    </div>
  );
}

export default EventDetailsPage;