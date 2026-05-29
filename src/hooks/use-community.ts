import { useQuery } from '@tanstack/react-query';

import { getPosts } from '@/api/community';

export function usePosts() {
  return useQuery({ queryKey: ['community', 'posts'], queryFn: getPosts });
}
