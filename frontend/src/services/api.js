import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mansaathi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralize the "session expired" behavior: if any request comes back
// 401, clear local auth state and send the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mansaathi_token');
      localStorage.removeItem('mansaathi_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Pulls a human-readable message out of an API error response,
// falling back to a generic message so the UI never shows "undefined".
export const getErrorMessage = (error) =>
  error?.response?.data?.message || 'Something went wrong. Please try again.';

export default api;
