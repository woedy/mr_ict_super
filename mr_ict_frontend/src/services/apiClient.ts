import axios from 'axios';

// Read from Vite env with sensible defaults
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

// Optional: basic 401 handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Optionally clear token and redirect
      // localStorage.removeItem('token');
      // window.location.href = '/sign-in';
    }
    return Promise.reject(err);
  },
);

export default api;

