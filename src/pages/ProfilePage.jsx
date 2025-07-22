import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    profilePicture: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      const profileData = response.data.user;
      setFormData({
        fullName: profileData.fullName,
        contactNumber: profileData.contactNumber,
        profilePicture: null,
      });
    } catch (error) {
      toast.error("Error fetching profile: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('contactNumber', formData.contactNumber);
      if (formData.profilePicture) {
        formDataToSend.append('file', formData.profilePicture);
      }

      const response = await updateUserProfile(formDataToSend);
      updateUser(response.data.user);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      toast.error("Error updating profile: " + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
              {!editing && (
                <Button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <input
                    type="file"
                    name="profilePicture"
                    onChange={handleChange}
                    accept="image/*"
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <img
                    src={user?.profilePicture || 'https://via.placeholder.com/150'}
                    alt={user?.fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Number</p>
                    <p className="font-medium">{user?.contactNumber}</p>
                  </div>
                  {user?.studentId && (
                    <div>
                      <p className="text-sm text-gray-600">Student ID</p>
                      <p className="font-medium">{user.studentId}</p>
                    </div>
                  )}
                  {user?.department && (
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium">{user.department}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
