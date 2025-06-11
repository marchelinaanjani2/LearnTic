import axios from 'axios';
import config from '../config';

// Buat instance axios dengan base URL
const api = axios.create({
  baseURL: `${config.API_BASE_URL}`,
});

// Tambahkan interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor untuk menangani response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika token invalid atau expired (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;