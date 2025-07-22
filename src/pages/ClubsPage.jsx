import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllClubs } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function ClubsPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await getAllClubs();
      setClubs(response.data.clubs);
    } catch (error) {
      toast.error("Error fetching clubs: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Clubs</h1>
          {user?.role === 'headFaculty' && (
            <Link
              to="/clubs/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Create Club
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading clubs...</div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-8 text-gray-600">No clubs found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Link
                to={`/clubs/${club._id}`}
                key={club._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{club.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{club.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Head Faculty: {club.headFaculty.fullName}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubsPage;
