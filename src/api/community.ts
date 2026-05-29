import { Post } from '@/types/community';
import client from './client';

export async function getPosts(): Promise<Post[]> {
  const res = await client.get<{ results: Post[] }>('/api/community/posts/');
  return res.data.results;
}
