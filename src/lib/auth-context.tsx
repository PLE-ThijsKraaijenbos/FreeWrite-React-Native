import React, { createContext, useContext, useEffect, useState } from 'react';

import { getProfileApi, loginApi, registerApi } from '@/api/auth';
import { clearTokens, getAccessToken, saveTokens } from '@/lib/auth-storage';
import { User } from '@/types/user';

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getAccessToken();
        if (token) {
          const user = await getProfileApi();
          setUserState(user);
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const { accessToken, refreshToken, user } = await loginApi(email, password);
    await saveTokens(accessToken, refreshToken);
    setUserState(user);
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string) => {
    const { accessToken, refreshToken, user } = await registerApi(email, password);
    await saveTokens(accessToken, refreshToken);
    setUserState(user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await clearTokens();
    setUserState(null);
    setIsAuthenticated(false);
  };

  const updateUser = (user: User) => setUserState(user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
