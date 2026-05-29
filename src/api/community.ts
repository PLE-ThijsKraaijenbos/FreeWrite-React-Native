import { Post } from '@/types/community';
import client from './client';

export async function getPosts(): Promise<Post[]> {
  const res = await client.get<Post[]>('/api/community/posts/');
  return res.data;
}
