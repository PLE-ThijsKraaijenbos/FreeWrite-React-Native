import { useMutation } from '@tanstack/react-query';

import { User } from '@/types/user';
import client from './client';

async function updateProfileApi(name: string): Promise<User> {
  const res = await client.patch<User>('/api/user/profile/', { name });
  return res.data;
}

export function useUpdateProfile() {
  return useMutation({ mutationFn: updateProfileApi });
}
