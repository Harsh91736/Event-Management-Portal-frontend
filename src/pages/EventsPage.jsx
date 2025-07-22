// src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllEvents } from '../services/api';
import { toast } from 'sonner';
import PageHeader from '../components/Layout/PageHeader';
import FilterBar from '../components/common/FilterBar';
import EventCard from '../components/events/EventCard';
import Skeleton from '../components/common/Skeleton';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [filters]); // Refetch when filters change

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents(filters);
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      toast.error("Error fetching events: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    {
      key: 'category',
      placeholder: 'All Categories',
      values: [
        { value: 'Technical', label: 'Technical' },
        { value: 'Cultural', label: 'Cultural' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Workshop', label: 'Workshop' },
        { value: 'Seminar', label: 'Seminar' }
      ]
    },
    {
      key: 'status',
      placeholder: 'All Status',
      values: [
        { value: 'pendingApproval', label: 'Pending Approval' },
        { value: 'approved', label: 'Approved' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' }
      ]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      <PageHeader
        title="Events"
        action={
          user?.role === 'coordinator' && (
            <Link to="/events/create" className="btn-primary">
              Create Event
            </Link>
          )
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          options={filterOptions}
        />

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-600">No events found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventsPage;