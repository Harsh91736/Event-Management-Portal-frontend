// src/pages/EventDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventById, registerForEvent, approveRejectEvent } from '../services/api';
import { toast } from 'sonner';
import ReviewsList from '../components/events/ReviewsList';
import EventFeedback from '../components/events/EventFeedback';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

function EventDetailsPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await getEventById(id);
      setEvent(response.data.event);
    } catch (error) {
      toast.error("Error fetching event details: " + (error.response?.data?.message || error.message));
      if (error.response?.status === 404) {
        navigate('/events');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    try {
      setRegistering(true);
      await registerForEvent({ eventId: id });
      toast.success("Successfully registered for the event!");
      fetchEventDetails(); // Refresh event details
    } catch (error) {
      toast.error("Registration failed: " + (error.response?.data?.message || error.message));
    } finally {
      setRegistering(false);
    }
  };

  const handleApproval = async (status, reason = '') => {
    try {
      await approveRejectEvent(id, { status, rejectionReason: reason });
      toast.success(`Event ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchEventDetails();
    } catch (error) {
      toast.error(`Failed to ${status} event: ` + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading event details...</div>;
  }

  if (!event) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Event not found</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={event.posterImage}
            alt={event.title}
            className="w-full h-64 object-cover object-center"
          />

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${event.status === 'active' ? 'bg-green-100 text-green-800' :
                event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                {event.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="p-4">
                <h3 className="font-semibold text-gray-700">Event Details</h3>
                <ul className="mt-2 space-y-2">
                  <li><span className="text-gray-600">Category:</span> {event.category}</li>
                  <li><span className="text-gray-600">Venue:</span> {event.venue}</li>
                  <li><span className="text-gray-600">Start:</span> {new Date(event.startDate).toLocaleString()}</li>
                  <li><span className="text-gray-600">End:</span> {new Date(event.endDate).toLocaleString()}</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold text-gray-700">Registration Info</h3>
                <ul className="mt-2 space-y-2">
                  <li>
                    <span className="text-gray-600">Deadline:</span>{' '}
                    {new Date(event.registrationDeadline).toLocaleString()}
                  </li>
                  <li>
                    <span className="text-gray-600">Fee:</span>{' '}
                    {event.fees > 0 ? `₹${event.fees}` : 'Free'}
                  </li>
                </ul>
              </Card>
            </div>

            <Card className="mb-6 p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
            </Card>

            <div className="flex justify-end space-x-4">
              {user?.role === 'student' && event.status === 'published' && (
                <Button
                  onClick={handleRegistration}
                  disabled={registering}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {registering ? 'Registering...' : 'Register Now'}
                </Button>
              )}

              {user?.role === 'headFaculty' && event.status === 'pendingApproval' && (
                <>
                  <Button
                    onClick={() => handleApproval('approved')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      const reason = prompt('Please provide a reason for rejection:');
                      if (reason) handleApproval('rejected', reason);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Add Reviews Section */}
        <Card className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <ReviewsList eventId={id} />
        </Card>

        {event.status === 'completed' && (
          <div className="mt-8">
            <EventFeedback
              eventId={id}
              onFeedbackSubmit={fetchEventDetails}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailsPage;