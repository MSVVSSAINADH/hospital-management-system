import axios from 'axios';

// Base URLs for different APIs
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8086';

const USER_API_BASE_URL = `${API_BASE}/api/users`; // Base URL for user-related APIs
const BOOKING_API_BASE_URL = `${API_BASE}/api/bookings`; // Base URL for booking-related APIs

// Add Axios Interceptor to attach JWT
axios.interceptors.request.use(
  (config) => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        if (userObj && userObj.token) {
          config.headers.Authorization = `Bearer ${userObj.token}`;
        }
      }
    } catch (e) {
      console.error("Error parsing user from sessionStorage", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions to interact with the backend
const userApi = {
  registerUser: async (formData) => {
    return axios.post(`${USER_API_BASE_URL}/register`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  loginUser: async (email, password) => {
    return axios.post(`${USER_API_BASE_URL}/login`, { email, password });
  },
  logoutUser: async (email) => {
    return axios.post(`${USER_API_BASE_URL}/logout`, null, { params: { email } });
  },
  getUserByEmail: async (email) => {
    return axios.get(`${USER_API_BASE_URL}/user`, { params: { email } });
  },
  updateUser: async (id, updatedUser) => {
    return axios.put(`${USER_API_BASE_URL}/update/${id}`, updatedUser);
  },
  getAllUsers: async () => {
    return axios.get(`${USER_API_BASE_URL}/all`);
  },
  deleteUser: async (id) => {
    return axios.delete(`${USER_API_BASE_URL}/${id}`);
  },
};

const bookingApi = {
  createBooking: async (bookingData) => {
    return axios.post(`${BOOKING_API_BASE_URL}`, bookingData);
  },
  getBookingsByUserId: async (userId) => {
    return axios.get(`${BOOKING_API_BASE_URL}/${userId}`);
  },
  getAllBookings: async () => {
    return axios.get(`${BOOKING_API_BASE_URL}`);
  },
};

const announcementApi = {
  ping: async () => axios.get(`${API_BASE}/api/public/broadcasts/ping`),
  create: async (data) => axios.post(`${API_BASE}/api/admin/broadcasts/send`, data),
  getActive: async () => axios.get(`${API_BASE}/api/public/broadcasts/active`),
  deactivate: async (id) => axios.patch(`${API_BASE}/api/admin/broadcasts/${id}/deactivate`),
};

const debugApi = {
  getMappings: async () => axios.get(`${API_BASE}/api/public/debug/mappings`),
};


const labRequestApi = {
  getAll: async () => axios.get(`${API_BASE}/api/lab-requests`),
  uploadResults: async (id, results) => axios.patch(`${API_BASE}/api/lab-requests/${id}/results`, results, {
    headers: { 'Content-Type': 'application/json' }
  }),
};

const notificationApi = {
  create: async (data) => axios.post(`${API_BASE}/api/notifications`, data),
};

// Export APIs as named exports
export { userApi, bookingApi, announcementApi, labRequestApi, notificationApi, debugApi };
