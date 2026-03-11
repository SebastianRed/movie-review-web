import { apiClient } from './axiosConfig';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { ENDPOINTS } from '../utils/constants';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return data;
  },

  // Opcional: Obtener usuario actual si tienes endpoint
  // getCurrentUser: async (): Promise<User> => {
  //   const { data } = await apiClient.get<User>(ENDPOINTS.AUTH.ME);
  //   return data;
  // },
};