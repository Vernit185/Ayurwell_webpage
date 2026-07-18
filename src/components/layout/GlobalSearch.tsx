import React, { useState, useEffect } from 'react';
import { Search, Command, X, FileText, User, ShoppingBag, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-ayur-950/40 backdrop-blur-sm p-4"
        onClick={() => setIsOpen(false)}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white dark:bg-[#121814] rounded-2xl shadow-premium-dark border border-slate-200 dark:border-ayur-800 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-ayur-900">
            <Search className="w-5 h-5 text-slate-400 dark:text-ayur-500 mr-3 shrink-0" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search conversations, doctors, marketplace..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-ayur-500 text-lg font-medium"
            />
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-ayur-900 rounded-md transition-colors">
              <X className="w-4 h-4 text-slate-400 dark:text-ayur-400" />
            </button>
          </div>

          <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {query.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-ayur-500">
                Start typing to search across your workspace.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-ayur-500 uppercase tracking-wider">Conversations</div>
                <button className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-ayur-900/50 text-left transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Persistent Fever</h4>
                    <p className="text-xs text-slate-500 dark:text-ayur-400">Mar 12, 2026 • High Confidence Match</p>
                  </div>
                </button>

                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-ayur-500 uppercase tracking-wider mt-4">Knowledge Hub</div>
                <button className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-ayur-900/50 text-left transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Understanding Vata Dosha</h4>
                    <p className="text-xs text-slate-500 dark:text-ayur-400">CCRAS Verified Article</p>
                  </div>
                </button>
              </div>
            )}
          </div>
          
          <div className="px-4 py-3 bg-slate-50 dark:bg-ayur-950/50 border-t border-slate-100 dark:border-ayur-900 text-xs flex items-center justify-between text-slate-500 dark:text-ayur-500 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Command className="w-3 h-3" /> Navigate</span>
              <span className="flex items-center gap-1">Enter to select</span>
            </div>
            <span>AyurWell Search</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
