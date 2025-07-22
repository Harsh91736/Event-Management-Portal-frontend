import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEvents, downloadAttendance } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function FacultyDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isHeadFaculty = user?.role === 'headFaculty';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data.events);
    } catch (error) {
      toast.error("Error fetching events: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttendance = async (eventId) => {
    try {
      const response = await downloadAttendance({ eventId });
      // Create and download CSV file
      const blob = new Blob([JSON.stringify(response.data.data)], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_event_${eventId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Error downloading attendance: " + (error.response?.data?.message || error.message));
    }
  };

  const pendingApprovalEvents = events.filter(e => e.status === 'pendingApproval');
  const activeEvents = events.filter(e => e.status === 'active');
  const completedEvents = events.filter(e => e.status === 'completed');

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isHeadFaculty ? 'Head Faculty Dashboard' : 'Faculty Dashboard'}
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Total Events</h3>
            <p className="text-3xl font-bold text-blue-600">{events.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Active Events</h3>
            <p className="text-3xl font-bold text-green-600">{activeEvents.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingApprovalEvents.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
            <p className="text-3xl font-bold text-purple-600">{completedEvents.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {isHeadFaculty && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Approvals</h3>
              {pendingApprovalEvents.length === 0 ? (
                <p className="text-gray-600">No events pending approval</p>
              ) : (
                <div className="space-y-2">
                  {pendingApprovalEvents.map(event => (
                    <Link
                      key={event._id}
                      to={`/events/${event._id}`}
                      className="block p-3 bg-yellow-50 rounded hover:bg-yellow-100"
                    >
                      {event.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Active Events</h3>
            {activeEvents.length === 0 ? (
              <p className="text-gray-600">No active events</p>
            ) : (
              <div className="space-y-2">
                {activeEvents.map(event => (
                  <div key={event._id} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <Link to={`/events/${event._id}`} className="hover:text-blue-600">
                      {event.title}
                    </Link>
                    <button
                      onClick={() => handleDownloadAttendance(event._id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download Attendance
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
