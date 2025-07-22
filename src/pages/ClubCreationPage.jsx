import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClub } from '../services/api';
import { toast } from 'sonner';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

function ClubCreationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    logo: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createClub(formData);
      toast.success('Club created successfully!');
      navigate('/clubs');
    } catch (error) {
      toast.error("Failed to create club: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Club</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Club Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Building/Room number"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => navigate('/clubs')}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
            >
              {loading ? 'Creating...' : 'Create Club'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ClubCreationPage;
