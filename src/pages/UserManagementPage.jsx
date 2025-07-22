import React, { useState, useEffect } from 'react';
import { getAllUsers, assignCoordinatorRole, removeCoordinatorRole } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(filter);
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Error fetching users: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCoordinator = async (userId, clubId) => {
    try {
      await assignCoordinatorRole({ studentId: userId, clubId });
      toast.success("Successfully assigned as coordinator");
      fetchUsers();
    } catch (error) {
      toast.error("Error assigning coordinator: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRemoveCoordinator = async (userId, clubId = null) => {
    try {
      await removeCoordinatorRole({ userId, clubId });
      toast.success("Successfully removed coordinator role");
      fetchUsers();
    } catch (error) {
      toast.error("Error removing coordinator: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Users</option>
              <option value="student">Students</option>
              <option value="coordinator">Coordinators</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {loading ? (
            <div className="p-4 text-center">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.profilePicture || 'https://via.placeholder.com/40'}
                            alt=""
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>{user.fullName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.studentId || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {currentUser?.role === 'headFaculty' && user.role === 'student' && (
                          <Button
                            onClick={() => handleAssignCoordinator(user._id)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Make Coordinator
                          </Button>
                        )}
                        {currentUser?.role === 'headFaculty' && user.role === 'coordinator' && (
                          <Button
                            onClick={() => handleRemoveCoordinator(user._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove Coordinator
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage;
