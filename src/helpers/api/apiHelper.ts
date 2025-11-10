// src/api.ts for Dashboard
import axios from 'axios';
export const PROTOCOL = "http";
export const DOMAIN = import.meta.env.VITE_APP_API_URL || '192.168.31.209';
export const PORT_8081 = 8081;
export const BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: DOMAIN,
  headers: {
    'Accept': 'application/json, text/plain, */*',
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
  
);


apiClient.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken'); 
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config?: any) =>
    apiClient.get<T>(url, config).then(res => res.data),

  post: <T>(url: string, data: any, config?: any) =>
    apiClient.post<T>(url, data, config).then(res => res.data),
};

export default api;