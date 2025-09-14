import axios from 'axios';
import { apiErrorHandler } from '@/utils/notificationHandler';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const skipAuth = config.url?.includes('auth/login');
        const token = localStorage.getItem('token');
        if (!skipAuth && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => apiErrorHandler(error)
);

export { 
    axiosClient
}