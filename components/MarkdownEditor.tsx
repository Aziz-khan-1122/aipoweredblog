
import React, { useState } from 'react';
import { Sparkles, Eye, Code, Save, Trash, Loader2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface MarkdownEditorProps {
  onSave: (title: string, content: string, summary: string, tags: string[]) => void;
  onCancel: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const gemini = new GeminiService();

  const handleGenerateAI = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const [aiSummary, aiTags] = await Promise.all([
        gemini.generateSummary(content),
        gemini.extractTags(content)
      ]);
      setSummary(aiSummary);
      setTags(aiTags);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSave = () => {
    if (!title || !content) return;
    onSave(title, content, summary, tags);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 serif">Draft a New Story</h2>
          <p className="text-sm text-gray-500">Share your thoughts with the world using Markdown.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isPreview ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!title || !content}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Article Title..." 
            className="w-full text-4xl font-bold bg-transparent border-none focus:ring-0 outline-none placeholder:text-gray-300 serif"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <div className="relative group">
            {isPreview ? (
              <div className="min-h-[500px] p-6 bg-white border border-gray-200 rounded-2xl shadow-sm markdown-content">
                {content || <span className="text-gray-400 italic">No content to preview yet...</span>}
              </div>
            ) : (
              <textarea 
                placeholder="Start writing your story here... (Markdown supported)"
                className="w-full min-h-[500px] p-6 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none resize-none font-mono text-sm leading-relaxed"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">AI Assistant</h3>
              </div>
              <button 
                onClick={handleGenerateAI}
                disabled={!content || isSummarizing}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors uppercase tracking-wider"
              >
                {isSummarizing ? 'Thinking...' : 'Generate'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-900/50 uppercase tracking-widest mb-1.5">
                  Smart Summary
                </label>
                <div className="relative">
                  {isSummarizing ? (
                    <div className="h-24 flex items-center justify-center bg-white/50 rounded-lg border border-blue-100/50">
                      <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                    </div>
                  ) : (
                    <textarea 
                      className="w-full h-24 text-sm bg-white/50 border border-blue-100 rounded-lg p-3 focus:ring-1 focus:ring-blue-300 outline-none resize-none placeholder:italic"
                      placeholder="AI-generated summary will appear here..."
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900/50 uppercase tracking-widest mb-1.5">
                  Suggested Tags
                </label>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {tags.length > 0 ? tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      #{tag}
                      <button onClick={() => setTags(tags.filter((_, i) => i !== idx))} className="hover:text-blue-900">×</button>
                    </span>
                  )) : (
                    <p className="text-xs text-blue-400 italic">No tags suggested yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">Markdown Tips</h4>
            <ul className="text-xs space-y-2 text-gray-600">
              <li><code className="text-blue-600"># Header</code> for H1</li>
              <li><code className="text-blue-600">## Header</code> for H2</li>
              <li><code className="text-blue-600">**Bold**</code> for emphasis</li>
              <li><code className="text-blue-600">[Link](url)</code> for web links</li>
              <li><code className="text-blue-600">> Quote</code> for blockquotes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
