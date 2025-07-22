import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventRegistrations, markAttendance } from '../services/api';
import { toast } from 'sonner';
import ExportButton from '../components/common/ExportButton';
import { formatAttendanceData } from '../utils/reportGenerator';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

function AttendancePage() {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, [eventId]);

  const fetchRegistrations = async () => {
    try {
      const response = await getEventRegistrations(eventId);
      setRegistrations(response.data.registrations);
    } catch (error) {
      toast.error("Error fetching registrations: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId, isPresent) => {
    try {
      setMarking(true);
      await markAttendance({ studentId, eventId, isPresent });
      toast.success(`Attendance marked as ${isPresent ? 'present' : 'absent'}`);
      fetchRegistrations();
    } catch (error) {
      toast.error("Error marking attendance: " + (error.response?.data?.message || error.message));
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading registrations...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mark Attendance</h1>
          <ExportButton
            data={registrations.map(reg => ({
              ...reg,
              isPresent: reg.attendance?.isPresent || false,
              markedAt: reg.attendance?.markedAt || new Date()
            }))}
            headers={formatAttendanceData([]).headers}
            filename={`attendance_${eventId}`}
          />
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
            No registrations found for this event.
          </div>
        ) : (
          <Card className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.student.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        onClick={() => handleMarkAttendance(registration.student._id, true)}
                        disabled={marking}
                        variant="success"
                        size="sm"
                      >
                        Present
                      </Button>
                      <Button
                        onClick={() => handleMarkAttendance(registration.student._id, false)}
                        disabled={marking}
                        variant="danger"
                        size="sm"
                      >
                        Absent
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AttendancePage;
