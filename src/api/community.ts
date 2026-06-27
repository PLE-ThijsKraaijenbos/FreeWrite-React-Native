import { AddCommentInput, Comment, CreatePostInput, Post, Tag, UpdatePostInput } from '@/types/community';
import client from './client';

export async function getPosts(): Promise<Post[]> {
  const res = await client.get<{ results: Post[] }>('/api/community/posts/');
  return res.data.results;
}

export async function getTags(): Promise<Tag[]> {
  const res = await client.get<Tag[]>('/api/community/tags/');
  return res.data;
}

export async function likePost(postId: number): Promise<void> {
  await client.post(`/api/community/posts/${postId}/like/`);
}

export async function unlikePost(postId: number): Promise<void> {
  await client.delete(`/api/community/posts/${postId}/like/`);
}

export async function getComments(postId: number): Promise<Comment[]> {
  const res = await client.get<{ results: Comment[] }>(`/api/community/posts/${postId}/comments/`);
  return res.data.results;
}

export async function createComment({ postId, body }: AddCommentInput): Promise<Comment> {
  const res = await client.post<Comment>(`/api/community/posts/${postId}/comments/`, { body });
  return res.data;
}

export async function likeComment(postId: number, commentId: number): Promise<void> {
  await client.post(`/api/community/posts/${postId}/comments/${commentId}/like/`);
}

export async function unlikeComment(postId: number, commentId: number): Promise<void> {
  await client.delete(`/api/community/posts/${postId}/comments/${commentId}/like/`);
}

export async function deletePost(postId: number): Promise<void> {
  await client.delete(`/api/community/posts/${postId}/`);
}

export async function updatePost(data: UpdatePostInput): Promise<Post> {
  if (data.image) {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.body) formData.append('body', data.body);
    if (data.tag_ids) {
      data.tag_ids.forEach((id) => formData.append('tag_ids', id));
    }
    formData.append('image', { uri: data.image.uri, name: data.image.fileName ?? 'photo.jpg', type: data.image.mimeType ?? 'image/jpeg' } as any);
    const res = await client.patch<Post>(`/api/community/posts/${data.id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  }
  const res = await client.patch<Post>(`/api/community/posts/${data.id}/`, {
    title: data.title,
    body: data.body,
    tag_ids: data.tag_ids,
  });
  return res.data;
}

export async function createPost(data: CreatePostInput): Promise<void> {
  if (data.image) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('body', data.body);
    if (data.tag_ids) {
      data.tag_ids.forEach((id) => formData.append('tag_ids', id));
    }
    formData.append('image', { uri: data.image.uri, name: data.image.fileName ?? 'photo.jpg', type: data.image.mimeType ?? 'image/jpeg' } as any);
    await client.post('/api/community/posts/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  } else {
    await client.post('/api/community/posts/', {
      title: data.title,
      body: data.body,
      tag_ids: data.tag_ids,
    });
  }
}
