import { Post } from '@/types/community';
import client from './client';

export async function getPosts(): Promise<Post[]> {
  const res = await client.get<{ results: Post[] }>('/api/community/posts/');
  return res.data.results;
}

export async function likePost(postId: number): Promise<void> {
  await client.post(`/api/community/posts/${postId}/like/`);
}

export async function unlikePost(postId: number): Promise<void> {
  await client.delete(`/api/community/posts/${postId}/like/`);
}
