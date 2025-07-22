import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../services/api';
import { toast } from 'sonner';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      const formattedEvents = response.data.events.map(event => ({
        id: event._id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        category: event.category,
        status: event.status,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      toast.error("Error fetching events: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = event => {
    navigate(`/events/${event.id}`);
  };

  const eventStyleGetter = event => {
    let backgroundColor = '#3174ad';
    switch (event.category) {
      case 'Technical': backgroundColor = '#2196f3'; break;
      case 'Cultural': backgroundColor = '#e91e63'; break;
      case 'Sports': backgroundColor = '#4caf50'; break;
      case 'Workshop': backgroundColor = '#ff9800'; break;
      case 'Seminar': backgroundColor = '#9c27b0'; break;
      default: backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        opacity: event.status === 'completed' ? 0.7 : 1,
      }
    };
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading calendar...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Event Calendar</h1>
            <div className="space-x-2">
              {['month', 'week', 'day', 'agenda'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-4 py-2 rounded ${view === viewType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 'calc(100vh - 250px)' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              onSelectEvent={handleEventClick}
              eventPropGetter={eventStyleGetter}
              popup
              views={['month', 'week', 'day', 'agenda']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
