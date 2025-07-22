import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRegistrations, cancelRegistration } from '../services/api';
import { toast } from 'sonner';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await getMyRegistrations();
      setRegistrations(response.data.registrations);
    } catch (error) {
      toast.error("Error fetching registrations: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;

    try {
      await cancelRegistration(registrationId);
      toast.success("Registration cancelled successfully");
      fetchRegistrations();
    } catch (error) {
      toast.error("Error cancelling registration: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading registrations...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Registrations</h1>

        {registrations.length === 0 ? (
          <Card className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">You haven't registered for any events yet.</p>
            <Link to="/events">
              <Button className="text-blue-600 hover:underline mt-2 inline-block">
                Browse Events
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <Card key={registration._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/events/${registration.event._id}`}
                      className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                      {registration.event.title}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      {new Date(registration.event.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Registration Date: {new Date(registration.registrationDate).toLocaleString()}
                    </p>
                  </div>
                  {new Date() < new Date(registration.event.startDate) && (
                    <Button
                      onClick={() => handleCancelRegistration(registration._id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Cancel Registration
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationsPage;
