import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bookmarkStep, completeStep, getJourney, startStep } from '@/api/journey';
import { Journey } from '@/types/journey';
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

export function useBookmarkStep() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (progressId: string) => bookmarkStep(progressId),
    onMutate: async (progressId) => {
      await queryClient.cancelQueries({ queryKey: ['journey'] });
      const previous = queryClient.getQueryData<Journey>(['journey']);
      queryClient.setQueryData<Journey>(['journey'], (old) => {
        if (!old) return old;
        return {
          ...old,
          step_progresses: old.step_progresses.map((p) =>
            p.id === progressId ? { ...p, bookmarked: !p.bookmarked } : p
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['journey'], context.previous);
    },
    onSuccess: (updatedProgress) => {
      queryClient.setQueryData<Journey>(['journey'], (old) => {
        if (!old) return old;
        return {
          ...old,
          step_progresses: old.step_progresses.map((p) =>
            p.id === updatedProgress.id ? updatedProgress : p
          ),
        };
      });
    },
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
