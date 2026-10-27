import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return 'http://127.0.0.1:5050/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('imovies_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Failed to parse user session', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
