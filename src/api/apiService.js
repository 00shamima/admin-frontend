import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For FormData (file uploads), remove Content-Type to let the browser set boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // In a real app, you would force a logout here
      console.error("Authentication failed. Token expired or invalid.");
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiService;