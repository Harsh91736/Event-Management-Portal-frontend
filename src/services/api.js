// src/services/api.js
import axios from 'axios';

// Get base URL from environment variables
// In Vite, environment variables must be prefixed with VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the authorization token
// This runs before each request is sent
api.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage (where we'll store it after login)
    const token = localStorage.getItem('authToken');
    if (token) {
      // If a token exists, attach it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// --- User Endpoints ---
// Note: For multipart/form-data (like file uploads), you need to explicitly set the header
export const registerUser = (userData) => api.post('/user/register', userData, {
  headers: {
    'Content-Type': 'multipart/form-data', // For registration with profile picture
  },
});
export const loginUser = (credentials) => api.post('/user/login', credentials);
export const getUserProfile = () => api.get('/user/profile'); // Assuming /user/profile gets current user's profile
export const updateUserProfile = (userData) => api.put('/user/profile/update', userData); // Assuming /user/profile/update updates current user
export const assignCoordinatorRole = (data) => api.post('/user/assign-coordinator', data);
export const removeCoordinatorRole = (data) => api.delete('/user/remove-coordinator', { data }); // DELETE with body
export const getAllUsers = (roleFilter = '') => api.get(`/user/all?role=${roleFilter}`);
export const getUserDetails = (userId) => api.get(`/user/details/${userId}`);


// --- Club Endpoints ---
export const createClub = (clubData) => api.post('/club/create', clubData);
export const getAllClubs = () => api.get('/club/all');
export const getClubById = (clubId) => api.get(`/club/${clubId}`);
export const updateClub = (clubId, clubData) => api.put(`/club/update/${clubId}`, clubData);
export const deleteClub = (clubId) => api.delete(`/club/delete/${clubId}`);


// --- Event Endpoints ---
export const createEvent = (eventData) => api.post('/event/create', eventData, {
  headers: {
    'Content-Type': 'multipart/form-data', // For event poster
  },
});
export const getAllEvents = (filters = {}) => api.get('/event/all', { params: filters });
export const getEventById = (eventId) => api.get(`/event/${eventId}`);
export const updateEvent = (eventId, eventData) => api.put(`/event/update/${eventId}`, eventData, {
  headers: {
    'Content-Type': 'multipart/form-data', // For event poster update
  },
});
export const approveRejectEvent = (eventId, statusData) => api.put(`/event/approve-reject/${eventId}`, statusData);
export const deleteEvent = (eventId) => api.delete(`/event/delete/${eventId}`);
export const updateEventMedia = (eventId, mediaData) => api.put(`/event/media/${eventId}`, mediaData);
export const updateEventStatusToActiveOrCompleted = (eventId, statusData) => api.put(`/event/status/${eventId}`, statusData);


// --- Registration Endpoints ---
export const registerForEvent = (registrationData) => api.post('/registration/register', registrationData);
export const getAllRegistrations = (filters = {}) => api.get('/registration/all', { params: filters });
export const getMyRegistrations = () => api.get('/registration/my');
export const getEventRegistrations = (eventId) => api.get(`/registration/event/${eventId}`);
export const cancelRegistration = (registrationId) => api.delete(`/registration/cancel/${registrationId}`);


// --- Attendance Endpoints ---
export const markAttendance = (attendanceData) => api.post('/attendance/mark', attendanceData);
export const getEventAttendance = (eventId) => api.get(`/attendance/event/${eventId}`);
export const getStudentAttendance = (studentId) => api.get(`/attendance/student/${studentId}`);
export const downloadAttendance = (filters = {}) => api.get('/attendance/download', { params: filters });


// --- Review Endpoints ---
export const toggleLikeEvent = (eventId) => api.post(`/review/toggle-like/${eventId}`);
export const submitEventReview = (eventId, reviewData) => api.post(`/review/submit/${eventId}`, reviewData);
export const getEventReviews = (eventId) => api.get(`/review/event/${eventId}`);
export const getMyReviews = () => api.get('/review/my');
export const deleteReview = (reviewId) => api.delete(`/review/delete/${reviewId}`);