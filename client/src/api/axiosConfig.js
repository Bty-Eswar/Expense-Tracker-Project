import axios from 'axios';

/**
 * Axios Instance: API
 *
 * URL Strategy:
 * - Development (npm run dev): import.meta.env.DEV = true
 *   → baseURL = '/api'
 *   → Vite proxy forwards /api → http://localhost:5000
 *
 * - Production (Vercel build): import.meta.env.DEV = false
 *   → baseURL = 'https://expense-tracker-project-2trx.onrender.com/api'
 *   → Calls Render backend directly
 *
 * This avoids needing any environment variables on Vercel.
 * import.meta.env.DEV is a Vite built-in — always correct.
 */
const BASE_URL = import.meta.env.DEV
  ? ''                                                        // dev: Vite proxy handles /api
  : 'https://expense-tracker-project-2trx.onrender.com';     // production: Render URL

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
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
