import React, { useState, useEffect } from 'react';
import { getAllEvents, getAllRegistrations, downloadAttendance } from '../services/api';
import { toast } from 'sonner';
import ExportButton from '../components/common/ExportButton';
import { formatEventData, formatAttendanceData } from '../utils/reportGenerator';

function ReportsPage() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        getAllEvents(),
        getAllRegistrations()
      ]);
      setEvents(eventsRes.data.events);
      setRegistrations(registrationsRes.data.registrations);
    } catch (error) {
      toast.error("Error fetching data: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (!dateRange.start || !dateRange.end) return true;
    const eventDate = new Date(event.startDate);
    return eventDate >= new Date(dateRange.start) && eventDate <= new Date(dateRange.end);
  });

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Events Report</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <ExportButton
                data={filteredEvents}
                headers={formatEventData([]).headers}
                filename="events_report"
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Attendance Report</h2>
            <ExportButton
              data={registrations}
              headers={formatAttendanceData([]).headers}
              filename="attendance_report"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
