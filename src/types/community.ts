import { z } from 'zod';

export const addPostSchema = z.object({
  title: z.string().trim().min(1, 'Please add a title.'),
  body: z.string().trim().min(1, 'Please add a message.'),
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

type PostInputFields = {
  title: string;
  body: string;
  image?: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  };
};

export type CreatePostInput = PostInputFields;
export type UpdatePostInput = { id: number } & Partial<PostInputFields>;
