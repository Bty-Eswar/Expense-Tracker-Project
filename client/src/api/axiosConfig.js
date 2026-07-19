import axios from 'axios';

/**
 * Axios Instance: API
 *
 * Why create a custom instance instead of using axios directly?
 * - Set a base URL once — all API calls use it automatically
 * - Attach the JWT token to every request via an interceptor
 * - One place to handle global API settings
 *
 * baseURL logic:
 * - Development: Vite proxy forwards /api → http://localhost:5000
 * - Production:  VITE_API_URL env var set in Vercel dashboard
 * - We append '/api' so every call only needs the endpoint path:
 *   API.post('/auth/login') → https://render-url.com/api/auth/login
 */
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Auto-attach JWT token
 *
 * Runs before EVERY request this axios instance makes.
 * Reads the token from localStorage and adds it to the Authorization header.
 *
 * This means we never have to manually add headers in our components.
 * Every protected API call is automatically authenticated.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
