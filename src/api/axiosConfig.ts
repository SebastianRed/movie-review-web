import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { storage } from '../utils/localStorage';
import type { ApiError } from '../types/api';

// Instancia de Axios para el backend
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor de Request: Agregar JWT automáticamente
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = storage.getToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor de Response: Manejo centralizado de errores
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError<ApiError>) => {
        // Si el token expiró o es inválido (401)
        if (error.response?.status === 401) {
            storage.clear();
            window.location.href = '/login';
        }

        // Formatear error para el frontend
        const apiError: ApiError = {
            message: error.response?.data?.message || 'Error de conexión con el servidor',
            status: error.response?.status || 0,
            timestamp: error.response?.data?.timestamp,
        };

        return Promise.reject(apiError);
    }
);