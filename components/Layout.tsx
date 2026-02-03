
import React from 'react';
import { Layout as LayoutIcon, PenTool, Search, User as UserIcon, LogOut, Home } from 'lucide-react';
import { ViewState, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  currentUser: User | null;
  onLogout: () => void;
  onSearch: (q: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, currentUser, onLogout, onSearch }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onViewChange('feed')}
        >
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <LayoutIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 serif">Lumina</h1>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search stories, topics, and authors..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onViewChange('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeView === 'editor' 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Write</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-gray-200" />
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all">
              Get Started
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <LayoutIcon className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-bold serif">Lumina</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 Lumina Publishing. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-600">Privacy</a>
            <a href="#" className="hover:text-blue-600">Terms</a>
            <a href="#" className="hover:text-blue-600">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
