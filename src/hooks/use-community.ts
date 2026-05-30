import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPost, getPosts, likePost, unlikePost, updatePost } from '@/api/community';
import { Post } from '@/types/community';

export function usePosts() {
  return useQuery({ queryKey: ['community', 'posts'], queryFn: getPosts });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, liked }: { postId: number; liked: boolean }) =>
      liked ? unlikePost(postId) : likePost(postId),
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries({ queryKey: ['community', 'posts'] });
      const previous = queryClient.getQueryData<Post[]>(['community', 'posts']);
      queryClient.setQueryData<Post[]>(['community', 'posts'], (old) =>
        old?.map((p) =>
          p.id === postId
            ? { ...p, is_liked_by_user: !liked, likes_count: p.likes_count + (liked ? -1 : 1) }
            : p
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['community', 'posts'], context.previous);
      }
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community', 'posts'] }),
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      queryClient.setQueryData<Post[]>(['community', 'posts'], (old) =>
        old?.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
    },
  });
}
