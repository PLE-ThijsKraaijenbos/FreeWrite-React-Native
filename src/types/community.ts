import { z } from 'zod';

export const addPostSchema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

export type AddPostFormData = z.infer<typeof addPostSchema>;

export type Post = {
  id: number;
  title: string;
  body: string;
  image_url: string | null;
  likes_count: number;
  is_liked_by_user: boolean;
  is_own_post: boolean;
  author_name: string;
  created_at: string;
};

export type UpdatePostInput = {
  id: number;
  title?: string;
  body?: string;
  image?: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  };
};

export type CreatePostInput = {
  title: string;
  body: string;
  image?: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  };
};
