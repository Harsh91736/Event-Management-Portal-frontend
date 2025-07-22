import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function EventCard({ event }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={`/events/${event._id}`}>
        <div className="relative">
          <img
            src={event.posterImage || '/default-event.jpg'}
            alt={event.title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600">
            {event.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="mr-2">📅</span>
            {format(new Date(event.startDate), 'PPp')}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-medium">{event.category}</span>
            <span className="text-gray-600">
              <span className="mr-1">👥</span>
              {event.registrationsCount || 0} registered
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default EventCard;
