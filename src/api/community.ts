import { CreatePostInput, Post, UpdatePostInput } from '@/types/community';
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

export async function deletePost(postId: number): Promise<void> {
  await client.delete(`/api/community/posts/${postId}/`);
}

export async function updatePost(data: UpdatePostInput): Promise<Post> {
  if (data.image) {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.body) formData.append('body', data.body);
    formData.append('image', { uri: data.image.uri, name: data.image.fileName ?? 'photo.jpg', type: data.image.mimeType ?? 'image/jpeg' } as any);
    const res = await client.patch<Post>(`/api/community/posts/${data.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  }
  const res = await client.patch<Post>(`/api/community/posts/${data.id}/`, { title: data.title, body: data.body });
  return res.data;
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
