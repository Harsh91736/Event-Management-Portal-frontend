import React, { useState, useEffect } from 'react';
import { getAllEvents, getAllUsers, getAllRegistrations, downloadAttendance } from '../services/api';
import { toast } from 'sonner';

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: [],
    registrations: [],
    users: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [eventsRes, registrationsRes, usersRes] = await Promise.all([
        getAllEvents(),
        getAllRegistrations(),
        getAllUsers()
      ]);

      setStats({
        events: eventsRes.data.events,
        registrations: registrationsRes.data.registrations,
        users: usersRes.data.users
      });
    } catch (error) {
      toast.error("Error fetching analytics data: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const data = await downloadAttendance();
      // Create CSV
      const blob = new Blob([JSON.stringify(data.data)], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Error downloading report: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading analytics...</div>;
  }

  // Calculate statistics
  const totalEvents = stats.events.length;
  const activeEvents = stats.events.filter(e => e.status === 'active').length;
  const totalRegistrations = stats.registrations.length;
  const totalStudents = stats.users.filter(u => u.role === 'student').length;
  const participationRate = totalStudents > 0
    ? ((stats.registrations.length / totalStudents) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
          <button
            onClick={downloadReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download Full Report
          </button>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Total Events</h3>
            <p className="text-3xl font-bold text-blue-600">{totalEvents}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Active Events</h3>
            <p className="text-3xl font-bold text-green-600">{activeEvents}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Total Registrations</h3>
            <p className="text-3xl font-bold text-purple-600">{totalRegistrations}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Participation Rate</h3>
            <p className="text-3xl font-bold text-orange-600">{participationRate}%</p>
          </div>
        </div>

        {/* Event Categories Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Categories</h3>
            <div className="space-y-2">
              {['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'].map(category => {
                const count = stats.events.filter(e => e.category === category).length;
                const percentage = totalEvents > 0 ? (count / totalEvents * 100).toFixed(1) : 0;
                return (
                  <div key={category} className="flex items-center">
                    <span className="w-24 text-gray-600">{category}</span>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Status</h3>
            <div className="space-y-2">
              {['draft', 'pendingApproval', 'active', 'completed'].map(status => {
                const count = stats.events.filter(e => e.status === status).length;
                const percentage = totalEvents > 0 ? (count / totalEvents * 100).toFixed(1) : 0;
                return (
                  <div key={status} className="flex items-center">
                    <span className="w-32 text-gray-600 capitalize">{status}</span>
                    <div className="flex-1 mx-4 bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${status === 'active' ? 'bg-green-600' :
                            status === 'completed' ? 'bg-purple-600' :
                              status === 'pendingApproval' ? 'bg-yellow-600' :
                                'bg-gray-600'
                          }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
