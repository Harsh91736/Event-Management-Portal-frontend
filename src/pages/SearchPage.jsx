import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllEvents, getAllClubs, getAllUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState({ events: [], clubs: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const { user } = useAuth();

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setResults({ events: [], clubs: [], users: [] });
      setLoading(false);
    }
  }, [query, type]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const [eventsRes, clubsRes, usersRes] = await Promise.all([
        getAllEvents({ search: query }),
        getAllClubs(),
        user?.role === 'headFaculty' ? getAllUsers() : Promise.resolve({ data: { users: [] } })
      ]);

      setResults({
        events: eventsRes.data.events.filter(event =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase())
        ),
        clubs: clubsRes.data.clubs.filter(club =>
          club.name.toLowerCase().includes(query.toLowerCase()) ||
          club.description.toLowerCase().includes(query.toLowerCase())
        ),
        users: usersRes.data.users.filter(user =>
          user.fullName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
        )
      });
    } catch (error) {
      toast.error("Error performing search: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Search Results for "{query}"
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 ${activeTab === 'events' ? 'bg-gray-100 border-b-2 border-blue-600' : ''}`}
              >
                Events ({results.events.length})
              </button>
              <button
                onClick={() => setActiveTab('clubs')}
                className={`px-6 py-3 ${activeTab === 'clubs' ? 'bg-gray-100 border-b-2 border-blue-600' : ''}`}
              >
                Clubs ({results.clubs.length})
              </button>
              {user?.role === 'headFaculty' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-6 py-3 ${activeTab === 'users' ? 'bg-gray-100 border-b-2 border-blue-600' : ''}`}
                >
                  Users ({results.users.length})
                </button>
              )}
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">Searching...</div>
            ) : (
              <div>
                {activeTab === 'events' && (
                  <div className="space-y-4">
                    {results.events.map(event => (
                      <Link
                        key={event._id}
                        to={`/events/${event._id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-gray-600 mt-1">{event.description.slice(0, 150)}...</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span>{new Date(event.startDate).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{event.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {activeTab === 'clubs' && (
                  <div className="space-y-4">
                    {results.clubs.map(club => (
                      <Link
                        key={club._id}
                        to={`/clubs/${club._id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <h3 className="font-semibold text-lg">{club.name}</h3>
                        <p className="text-gray-600 mt-1">{club.description.slice(0, 150)}...</p>
                      </Link>
                    ))}
                  </div>
                )}

                {activeTab === 'users' && user?.role === 'headFaculty' && (
                  <div className="space-y-4">
                    {results.users.map(user => (
                      <div key={user._id} className="p-4 border rounded-lg">
                        <div className="flex items-center">
                          <img
                            src={user.profilePicture || 'https://via.placeholder.com/40'}
                            alt=""
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h3 className="font-semibold">{user.fullName}</h3>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                          </div>
                          <span className="ml-auto capitalize text-gray-500">{user.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
