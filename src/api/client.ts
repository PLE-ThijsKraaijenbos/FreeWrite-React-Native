import axios, { InternalAxiosRequestConfig } from 'axios';

import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/lib/auth-storage';

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_FREEWRITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) return Promise.reject(error);

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        await clearTokens();
        return Promise.reject(error);
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_FREEWRITE_API_URL}/api/user/token/refresh/`,
        { refresh: refreshToken },
      );

      await saveTokens(data.access, refreshToken);
      return client(original);
    } catch {
      await clearTokens();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default client;
