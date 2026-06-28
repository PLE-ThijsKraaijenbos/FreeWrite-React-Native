import { z } from 'zod';

export const MAX_TAGS = 3;

export const addPostSchema = z.object({
  title: z.string().trim().min(1, 'Please add a title.'),
  body: z.string().trim().min(1, 'Please add a message.'),
  tag_ids: z.array(z.string().uuid()).max(MAX_TAGS, `You can select up to ${MAX_TAGS} tags.`).optional(),
});

export type AddPostFormData = z.infer<typeof addPostSchema>;

export type Tag = {
  id: string;
  value: string;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  is_liked_by_user: boolean;
  is_own_post: boolean;
  author_name: string;
  created_at: string;
  tags: Tag[];
};

export type Comment = {
  id: number;
  body: string;
  likes_count: number;
  is_liked_by_user: boolean;
};

export type AddCommentInput = {
  postId: number;
  body: string;
};

type PostInputFields = {
  title: string;
  body: string;
  tag_ids?: string[];
  image?: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  };
};

export type CreatePostInput = PostInputFields;
export type UpdatePostInput = { id: number } & Partial<PostInputFields>;
