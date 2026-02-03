
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import BlogCard from './components/BlogCard';
import MarkdownEditor from './components/MarkdownEditor';
import PostDetail from './components/PostDetail';
import { Post, ViewState, User } from './types';
import { DatabaseService } from './services/dbService';
import { Sparkles, TrendingUp, Clock, Search as SearchIcon } from 'lucide-react';

const MOCK_CURRENT_USER: User = {
  id: 'user-current',
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: 'https://picsum.photos/seed/jane/200/200'
};

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeView, setActiveView] = useState<ViewState>('feed');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_CURRENT_USER);
  const [isLoading, setIsLoading] = useState(true);

  const db = DatabaseService.getInstance();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await db.getPosts();
      setPosts(data);
      setFilteredPosts(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(q) || 
      post.content.toLowerCase().includes(q) ||
      post.tags.some(t => t.toLowerCase().includes(q))
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handlePostClick = (id: string) => {
    setSelectedPostId(id);
    setActiveView('post-detail');
  };

  const handleSavePost = async (title: string, content: string, summary: string, tags: string[]) => {
    if (!currentUser) return;
    
    await db.createPost({
      title,
      content,
      summary,
      tags,
      authorId: currentUser.id,
      authorName: currentUser.name
    });
    
    await fetchPosts();
    setActiveView('feed');
  };

  const selectedPost = selectedPostId ? posts.find(p => p.id === selectedPostId) : null;

  return (
    <Layout 
      activeView={activeView} 
      onViewChange={(v) => {
        setActiveView(v);
        if (v === 'feed') setSelectedPostId(null);
      }}
      currentUser={currentUser}
      onLogout={() => setCurrentUser(null)}
      onSearch={setSearchQuery}
    >
      {activeView === 'feed' && (
        <div className="space-y-12">
          {/* Welcome Section */}
          <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-sm">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-blue-600 mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">AI-Powered Insights</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-gray-900 serif leading-tight mb-6">
                Where good ideas find you.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A sanctuary for writers and readers. Explore the world's most insightful stories, automatically summarized and intelligently organized just for you.
              </p>
              <button 
                onClick={() => setActiveView('editor')}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Writing
              </button>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 rounded-l-full blur-3xl -z-1" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Feed */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-6">
                  <button className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b-2 border-blue-600 pb-4 -mb-[18px]">
                    <TrendingUp className="w-4 h-4" />
                    Trending
                  </button>
                  <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 pb-4 -mb-[18px]">
                    <Clock className="w-4 h-4" />
                    Latest
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-8 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-gray-100 rounded-2xl" />
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredPosts.map(post => (
                    <BlogCard 
                      key={post.id} 
                      post={post} 
                      onClick={handlePostClick} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-100 rounded-3xl border border-dashed border-gray-300">
                  <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg serif">No stories found matching your search.</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 font-bold mt-2 hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-10">
              <section>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Discover more of what matters</h3>
                <div className="flex flex-wrap gap-2">
                  {['Technology', 'Programming', 'Science', 'Design', 'Productivity', 'Psychology', 'Writing', 'Life'].map(topic => (
                    <button 
                      key={topic}
                      onClick={() => setSearchQuery(topic)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200 transition-colors border border-gray-200"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
                <h4 className="font-bold text-lg mb-2">Write on Lumina</h4>
                <p className="text-sm text-blue-100 mb-6 leading-relaxed">Join a community of thousands sharing their knowledge. Get AI-powered feedback on your drafts instantly.</p>
                <button 
                  onClick={() => setActiveView('editor')}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                >
                  Create Story
                </button>
              </section>

              <section className="pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400">
                  <a href="#" className="hover:text-blue-600">Help</a>
                  <a href="#" className="hover:text-blue-600">Status</a>
                  <a href="#" className="hover:text-blue-600">About</a>
                  <a href="#" className="hover:text-blue-600">Careers</a>
                  <a href="#" className="hover:text-blue-600">Blog</a>
                  <a href="#" className="hover:text-blue-600">Privacy</a>
                  <a href="#" className="hover:text-blue-600">Terms</a>
                </div>
              </section>
            </aside>
          </div>
        </div>
      )}

      {activeView === 'editor' && (
        <MarkdownEditor 
          onSave={handleSavePost}
          onCancel={() => setActiveView('feed')}
        />
      )}

      {activeView === 'post-detail' && selectedPost && (
        <PostDetail 
          post={selectedPost} 
          currentUser={currentUser}
          onBack={() => {
            setActiveView('feed');
            setSelectedPostId(null);
          }}
        />
      )}
    </Layout>
  );
};

export default App;
