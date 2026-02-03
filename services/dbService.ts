
import { Post, Comment, User } from '../types';

// Mocking initial data to populate the blog
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Future of AI in Modern Web Development',
    content: '# Introduction\nAI is no longer just a buzzword. It is transforming how we build apps.\n\n## Key Benefits\n- Faster prototyping\n- Enhanced UX with personalization\n- Automated bug detection\n\n> "The best way to predict the future is to create it." - Peter Drucker\n\nStay tuned for more updates!',
    summary: 'An exploration of how AI is revolutionizing web development through faster prototyping, improved user experiences, and automated tools.',
    authorId: 'user-1',
    authorName: 'Alex Rivera',
    createdAt: Date.now() - 86400000 * 2,
    tags: ['AI', 'Tech', 'WebDev']
  },
  {
    id: '2',
    title: 'Minimalist Interior Design: A Guide',
    content: 'Less is more. Minimalism is about intentionality.\n\n### 1. Declutter\nStart by removing items that serve no purpose.\n\n### 2. Neutral Palette\nStick to whites, grays, and earth tones.',
    summary: 'A concise guide to minimalist interior design focusing on intentionality, decluttering, and using a neutral color palette.',
    authorId: 'user-2',
    authorName: 'Sarah Chen',
    createdAt: Date.now() - 86400000,
    tags: ['Design', 'Lifestyle']
  }
];

// In a real app, these would be calls to Supabase using @supabase/supabase-js
export class DatabaseService {
  private posts: Post[] = [...INITIAL_POSTS];
  private comments: Comment[] = [];
  
  // Singleton pattern for consistency in this demo
  private static instance: DatabaseService;
  static getInstance() {
    if (!DatabaseService.instance) DatabaseService.instance = new DatabaseService();
    return DatabaseService.instance;
  }

  async getPosts(searchQuery: string = ''): Promise<Post[]> {
    if (!searchQuery) return this.posts.sort((a, b) => b.createdAt - a.createdAt);
    
    const query = searchQuery.toLowerCase();
    return this.posts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    ).sort((a, b) => b.createdAt - a.createdAt);
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.find(p => p.id === id);
  }

  async createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    this.posts.push(newPost);
    return newPost;
  }

  async getComments(postId: string): Promise<Comment[]> {
    return this.comments.filter(c => c.postId === postId).sort((a, b) => b.createdAt - a.createdAt);
  }

  async addComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    this.comments.push(newComment);
    return newComment;
  }
}
