
export interface Post {
  id: string;
  title: string;
  content: string;
  summary?: string;
  authorId: string;
  authorName: string;
  createdAt: number;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export type ViewState = 'feed' | 'editor' | 'post-detail';
