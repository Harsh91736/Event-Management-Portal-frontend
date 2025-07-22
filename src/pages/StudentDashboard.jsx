import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRegistrations, getMyReviews, getStudentAttendance } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function StudentDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [regResponse, revResponse, attResponse] = await Promise.all([
        getMyRegistrations(),
        getMyReviews(),
        getStudentAttendance(user.id)
      ]);

      setRegistrations(regResponse.data.registrations);
      setReviews(revResponse.data.reviews);
      setAttendance(attResponse.data.attendance);
    } catch (error) {
      toast.error("Error fetching dashboard data: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading dashboard...</div>;
  }

  const upcomingEvents = registrations.filter(reg =>
    new Date(reg.event.startDate) > new Date()
  );

  const attendedEvents = attendance.filter(record => record.isPresent);
  const attendanceRate = attendance.length > 0
    ? (attendedEvents.length / attendance.length * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Events</h3>
            <p className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Events Attended</h3>
            <p className="text-3xl font-bold text-green-600">{attendedEvents.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Attendance Rate</h3>
            <p className="text-3xl font-bold text-purple-600">{attendanceRate}%</p>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Events</h2>
            <Link to="/events" className="text-blue-600 hover:underline">Browse All Events</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600">No upcoming events</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map(registration => (
                <Link
                  key={registration._id}
                  to={`/events/${registration.event._id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-800">{registration.event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(registration.event.startDate).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Reviews</h2>
            <Link to="/my-reviews" className="text-blue-600 hover:underline">View All Reviews</Link>
          </div>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews submitted yet</p>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 3).map(review => (
                <div key={review._id} className="p-4 border rounded-lg">
                  <Link
                    to={`/events/${review.event._id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {review.event.title}
                  </Link>
                  <p className="mt-2 text-gray-600">{review.content}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
