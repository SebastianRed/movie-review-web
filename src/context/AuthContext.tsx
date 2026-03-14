import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi } from '../api/authApi';
import { storage } from '../utils/localStorage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Normalizes the backend response to always give us { token, user }
// Handles common response shapes:
//   { token, user }                          ← ideal
//   { token, id, username, email, role }     ← token + user fields at root level
//   { accessToken, ... }                     ← some backends use accessToken
const normalizeAuthResponse = (response: any): { token: string; user: User } => {
  console.log('[Auth] Raw backend response:', response); // ← remove once working

  const token = response.token || response.accessToken || response.jwt;

  if (!token) {
    throw new Error('El servidor no devolvió un token. Revisa la respuesta del backend.');
  }

  // If the response already has a nested user object, use it
  if (response.user && typeof response.user === 'object') {
    return { token, user: response.user };
  }

  // Otherwise, the user fields may be at the root level of the response
  const user: User = {
    id: response.id ?? response.userId,
    username: response.username,
    email: response.email,
    role: response.role ?? 'USER',
  };

  if (!user.username) {
    throw new Error('El servidor no devolvió datos del usuario. Revisa la respuesta del backend.');
  }

  return { token, user };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = storage.getToken();
        const storedUser = storage.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        storage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    const response = await authApi.login(credentials);
    const { token: newToken, user: newUser } = normalizeAuthResponse(response);

    setToken(newToken);
    setUser(newUser);
    storage.setToken(newToken);
    storage.setUser(newUser);
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    const response = await authApi.register(userData);
    const { token: newToken, user: newUser } = normalizeAuthResponse(response);

    setToken(newToken);
    setUser(newUser);
    storage.setToken(newToken);
    storage.setUser(newUser);
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    storage.clear();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};