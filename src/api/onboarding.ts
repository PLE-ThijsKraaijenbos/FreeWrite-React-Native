import { useMutation } from '@tanstack/react-query';

import { OnboardingFormData } from '@/types/onboarding';
import { User } from '@/types/user';
import client from './client';

async function completeProfile(data: Omit<OnboardingFormData, 'password'>): Promise<User> {
  const res = await client.post<User>('/api/user/complete-profile/', {
    name: data.name,
    avatar_url: data.avatar_url,
    substance: data.substance,
    usage_duration: data.duration,
    goal: data.goal,
    usage_times: data.trigger,
    frequency: data.frequency,
    previous_attempts: data.previousAttempts,
  });
  return res.data;
}

export function useCompleteProfile() {
  return useMutation({ mutationFn: completeProfile });
}
