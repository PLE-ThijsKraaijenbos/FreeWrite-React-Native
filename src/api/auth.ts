import { User } from '@/types/user';
import client from './client';

type AuthResponse = { accessToken: string; refreshToken: string; user: User };

async function authPost(endpoint: string, body: object): Promise<AuthResponse> {
  const res = await client.post<{ access: string; refresh: string; user: User }>(endpoint, body);
  return { accessToken: res.data.access, refreshToken: res.data.refresh, user: res.data.user };
}

export const loginApi = (email: string, password: string) =>
  authPost('/api/user/login/', { email, password });

export const registerApi = (email: string, password: string) =>
  authPost('/api/user/register/', { email, password });

export const getProfileApi = async (): Promise<User> => {
  const res = await client.get<User>('/api/user/profile/');
  return res.data;
};

export const patchAvatarUrlApi = async (avatarUrl: string): Promise<User> => {
  const res = await client.patch<User>('/api/user/profile/', { avatar_url: avatarUrl });
  return res.data;
};
