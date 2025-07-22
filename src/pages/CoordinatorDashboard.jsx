import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function CoordinatorDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      // Filter events created by the current coordinator
      const coordinatorEvents = response.data.events.filter(
        event => event.createdBy._id === user.id
      );
      setEvents(coordinatorEvents);
    } catch (error) {
      toast.error("Error fetching events: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pendingApproval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Coordinator Dashboard</h1>
          <Link
            to="/events/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create New Event
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Total Events</h3>
            <p className="text-3xl font-bold text-blue-600">{events.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Active Events</h3>
            <p className="text-3xl font-bold text-green-600">
              {events.filter(e => e.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {events.filter(e => e.status === 'pendingApproval').length}
            </p>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Events</h2>
          </div>

          {loading ? (
            <div className="p-4 text-center">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="p-4 text-center text-gray-600">
              You haven't created any events yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/events/${event._id}`} className="text-blue-600 hover:underline">
                          {event.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(event.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/events/${event._id}/attendance`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          Mark Attendance
                        </Link>
                        <Link
                          to={`/events/${event._id}/registrations`}
                          className="text-green-600 hover:text-green-800"
                        >
                          View Registrations
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoordinatorDashboard;
