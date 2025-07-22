// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import { toast } from 'sonner'; // For notifications
import Button from '../components/Common/Button';

const roles = [
  { value: "student", label: "Student" },
  { value: "faculty", label: "Faculty" },
  { value: "headFaculty", label: "Head Faculty" },
];

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('');
  const [studentId, setStudentId] = useState(''); // Assuming studentId is required for students
  const [profilePicture, setProfilePicture] = useState(null); // For file input
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth(); // Get register function and auth status
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Redirect to dashboard if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]); // Get the first selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate required fields
    if (!fullName || !email || !password || !contactNumber || !role) {
      toast.error("All required fields (Full Name, Email, Contact Number, Password, Role) are necessary.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (role === "student" && !studentId) {
      toast.error("Student ID is required for students.");
      return;
    }

    setLoading(true);

    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('contactNumber', contactNumber);
    formData.append('role', role);
    if (role === "student") {
      formData.append('studentId', studentId);
    }
    if (profilePicture) {
      formData.append('file', profilePicture); // 'file' should match the field name in your Multer middleware
    }

    const success = await register(formData); // Pass FormData to the register function

    setLoading(false);

    if (success) {
      // Registration successful, navigate to login page
      navigate('/login');
      toast.success("Registration successful! Please log in.");
    }
    // Error toast is handled in AuthContext
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number *
            </label>
            <input
              type="text"
              id="contactNumber"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="e.g., +919876543210"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              id="role"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          {role === "student" && (
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                Student ID *
              </label>
              <input
                type="text"
                id="studentId"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g., S12345"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required={role === "student"}
              />
            </div>
          )}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Picture (Optional)
            </label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500"
              onChange={handleFileChange}
            />
          </div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;