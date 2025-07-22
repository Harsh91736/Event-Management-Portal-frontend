import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/api';
import EventForm from '../components/Events/EventForm';
import Card from '../components/Common/Card';
import { toast } from 'sonner';

const EventCreationPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateEvent = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await createEvent(formData);
      toast.success('Event created successfully!');
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-4">
      <Card className="w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Event</h2>
        <EventForm onSubmit={handleCreateEvent} loading={loading} error={error} />
      </Card>
    </div>
  );
};

export default EventCreationPage;
