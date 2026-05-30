export type Post = {
  id: number;
  title: string;
  body: string;
  likes_count: number;
  is_liked_by_user: boolean;
  author_name: string;
  created_at: string;
};

export type CreatePostInput = {
  title: string;
  body: string;
};
