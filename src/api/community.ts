import { CreatePostInput, Post } from '@/types/community';
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

export async function createPost(data: CreatePostInput): Promise<void> {
  if (data.image) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('body', data.body);
    formData.append('image', { uri: data.image.uri, name: data.image.fileName ?? 'photo.jpg', type: data.image.mimeType ?? 'image/jpeg' } as any);
    await client.post('/api/community/posts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  } else {
    await client.post('/api/community/posts/', { title: data.title, body: data.body });
  }
}
