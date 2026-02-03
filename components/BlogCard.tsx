
import React from 'react';
import { Post } from '../types';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface BlogCardProps {
  post: Post;
  onClick: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  return (
    <article 
      onClick={() => onClick(post.id)}
      className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-4"
    >
      <div className="flex flex-wrap gap-2">
        {post.tags.map(tag => (
          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight serif">
        {post.title}
      </h3>

      {post.summary && (
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
          <p className="text-sm text-gray-600 italic line-clamp-3">
            {post.summary}
          </p>
        </div>
      )}

      {!post.summary && (
        <p className="text-gray-600 line-clamp-2 text-sm">
          {post.content.replace(/[#*`]/g, '').slice(0, 150)}...
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{post.authorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{format(post.createdAt, 'MMM d, yyyy')}</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>
    </article>
  );
};

export default BlogCard;
