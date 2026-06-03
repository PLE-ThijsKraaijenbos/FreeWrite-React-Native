import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { completeStep, getJourney, startStep } from '@/api/journey';
import { getProfileApi } from '@/api/auth';
import { useAuth } from '@/lib/auth-context';

export function useJourney() {
  return useQuery({ queryKey: ['journey'], queryFn: getJourney });
}

export function useStartStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (progressId: string) => startStep(progressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journey'] }),
  });
}

export function useCompleteStep() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();
  return useMutation({
    mutationFn: ({ progressId, responseData }: { progressId: string; responseData: unknown }) =>
      completeStep(progressId, responseData),
    onSuccess: async (updatedJourney) => {
      queryClient.setQueryData(['journey'], updatedJourney);
      const updatedUser = await getProfileApi();
      updateUser(updatedUser);
    },
  });
}
