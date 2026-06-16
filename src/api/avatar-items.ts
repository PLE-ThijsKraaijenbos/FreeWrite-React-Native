import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/lib/auth-context';
import { AvatarItem } from '@/types/user';
import client from './client';
import { getProfileApi } from './auth';

async function getAvatarItems(): Promise<AvatarItem[]> {
  const res = await client.get<AvatarItem[]>('/api/user/avatar/items/');
  return res.data;
}

async function unlockAvatarItem(itemId: string): Promise<void> {
  await client.post(`/api/user/avatar/items/${itemId}/unlock/`);
}

async function equipAvatarItem(itemId: string): Promise<void> {
  await client.post(`/api/user/avatar/items/${itemId}/equip/`);
}

async function unequipAvatarItem(itemId: string): Promise<void> {
  await client.delete(`/api/user/avatar/items/${itemId}/equip/`);
}

export function useAvatarItems() {
  return useQuery({ queryKey: ['avatar-items'], queryFn: getAvatarItems });
}

export function useUnlockAvatarItem() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: unlockAvatarItem,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['avatar-items'] });
      const updatedUser = await getProfileApi();
      updateUser(updatedUser);
    },
  });
}

export function useEquipAvatarItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: equipAvatarItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['avatar-items'] }),
  });
}

export function useUnequipAvatarItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unequipAvatarItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['avatar-items'] }),
  });
}
