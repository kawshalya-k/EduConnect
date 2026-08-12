import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? 'https://educonnect-production-c0d9.up.railway.app/api' : 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
