
import React, { useState, useEffect } from 'react';
import { Post, Comment, User } from '../types';
import { DatabaseService } from '../services/dbService';
// Added Loader2 to the imports from lucide-react to fix the reference error on line 129
import { Calendar, User as UserIcon, MessageSquare, Sparkles, ChevronLeft, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface PostDetailProps {
  post: Post;
  currentUser: User | null;
  onBack: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, currentUser, onBack }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = DatabaseService.getInstance();

  useEffect(() => {
    const fetchComments = async () => {
      const data = await db.getComments(post.id);
      setComments(data);
    };
    fetchComments();
  }, [post.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      const comment = await db.addComment({
        postId: post.id,
        userId: currentUser.id,
        userName: currentUser.name,
        text: newComment
      });
      setComments([comment, ...comments]);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Feed
      </button>

      <header className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 serif leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              {post.authorName[0]}
            </div>
            <span className="font-semibold text-gray-900">{post.authorName}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{format(post.createdAt, 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </header>

      {post.summary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-2xl p-6 mb-10 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-800/70">AI Summary</span>
          </div>
          <p className="text-blue-900 leading-relaxed italic text-lg">
            "{post.summary}"
          </p>
        </div>
      )}

      <article className="markdown-content mb-16 prose prose-blue prose-lg max-w-none">
        {post.content.split('\n').map((line, i) => {
          // Simplistic Markdown Rendering for the demo
          if (line.startsWith('# ')) return <h1 key={i}>{line.replace('# ', '')}</h1>;
          if (line.startsWith('## ')) return <h2 key={i}>{line.replace('## ', '')}</h2>;
          if (line.startsWith('### ')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
          if (line.startsWith('- ')) return <li key={i}>{line.replace('- ', '')}</li>;
          if (line.startsWith('> ')) return <blockquote key={i}>{line.replace('> ', '')}</blockquote>;
          return <p key={i}>{line}</p>;
        })}
      </article>

      <section className="border-t border-gray-200 pt-12 mb-20">
        <div className="flex items-center gap-2 mb-8">
          <MessageSquare className="w-5 h-5 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 serif">Community Voices ({comments.length})</h3>
        </div>

        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="mb-10">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <textarea 
                placeholder="What are your thoughts?"
                className="w-full bg-transparent border-none outline-none resize-none text-sm placeholder:text-gray-400"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end pt-2 border-t border-gray-50 mt-2">
                <button 
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-100 p-6 rounded-2xl text-center mb-10 border border-dashed border-gray-300">
            <p className="text-gray-600 text-sm mb-4">Please log in to participate in the conversation.</p>
            <button className="text-blue-600 font-bold hover:underline">Log in or Sign up</button>
          </div>
        )}

        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">
                {comment.userName[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-gray-900">{comment.userName}</h4>
                  <span className="text-xs text-gray-400">{format(comment.createdAt, 'MMM d')}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-400 py-10 italic">No comments yet. Be the first to start the discussion!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
