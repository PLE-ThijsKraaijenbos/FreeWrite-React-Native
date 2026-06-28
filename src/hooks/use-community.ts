import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createComment,
  createPost,
  deletePost,
  getComments,
  getPosts,
  getTags,
  likeComment,
  likePost,
  unlikeComment,
  unlikePost,
  updatePost,
} from '@/api/community';
import { Comment, Post } from '@/types/community';

export function usePosts() {
  return useQuery({ queryKey: ['community', 'posts'], queryFn: getPosts });
}

export function useTags() {
  return useQuery({ queryKey: ['community', 'tags'], queryFn: getTags });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ['community', 'posts'],
    queryFn: getPosts,
    select: (posts) => posts.find((p) => p.id === id),
  });
}

export function useComments(postId: number) {
  return useQuery({
    queryKey: ['community', 'comments', postId],
    queryFn: () => getComments(postId),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_data, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['community', 'comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
    },
  });
}

export function useLikeComment(postId: number) {
  const queryClient = useQueryClient();
  const queryKey = ['community', 'comments', postId];
  return useMutation({
    mutationFn: ({ commentId, liked }: { commentId: number; liked: boolean }) =>
      liked ? unlikeComment(postId, commentId) : likeComment(postId, commentId),
    onMutate: async ({ commentId, liked }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Comment[]>(queryKey);
      queryClient.setQueryData<Comment[]>(queryKey, (old) =>
        old?.map((c) =>
          c.id === commentId
            ? { ...c, is_liked_by_user: !liked, likes_count: c.likes_count + (liked ? -1 : 1) }
            : c
        )
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
  });
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

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_data, postId) => {
      queryClient.setQueryData<Post[]>(['community', 'posts'], (old) =>
        old?.filter((p) => p.id !== postId)
      );
    },
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
