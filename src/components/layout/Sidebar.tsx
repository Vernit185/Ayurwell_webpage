import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, Leaf, Settings, LogOut, MessageSquare, Sun, Moon, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { fetchConversations, deleteConversation } from '../../api';
import { toast } from 'sonner';

export default function Sidebar({ currentChatId }: { currentChatId?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    loadConversations();
  }, [location.pathname]); // Reload when navigation happens (e.g. new chat created)

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load history');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      toast.success('Conversation deleted');
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentChatId === id) {
        navigate('/');
      }
    } catch (err) {
      toast.error('Failed to delete conversation');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out.');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed.');
    }
  };

  const activeClass = "bg-ayur-100 dark:bg-ayur-800 text-ayur-900 dark:text-white font-medium";
  const idleClass = "text-ayur-600 dark:text-ayur-400 hover:text-ayur-900 dark:hover:text-white hover:bg-ayur-50 dark:hover:bg-ayur-900/50 transition-colors";

  return (
    <div className="w-64 bg-white dark:bg-ayur-950 flex flex-col border-r border-ayur-200 dark:border-ayur-900/50 h-full shrink-0 transition-colors duration-300">
      
      {/* Brand & New Chat */}
      <div className="p-4 flex flex-col gap-4 border-b border-ayur-200 dark:border-ayur-900/50">
        <div className="flex items-center gap-2 px-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-7 h-7 rounded-full bg-ayur-600 dark:bg-ayur-700 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-semibold text-ayur-900 dark:text-white tracking-tight">AyurWell</span>
        </div>

        <button 
          onClick={() => navigate('/app/chat/new')}
          className="w-full py-2 px-3 rounded-xl bg-ayur-600 dark:bg-ayur-700 hover:bg-ayur-700 dark:hover:bg-ayur-600 text-white text-sm font-medium flex items-center gap-2 transition-all shadow-premium"
        >
          <Plus className="w-4 h-4" /> New Consultation
        </button>
        
        <button 
          onClick={() => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
          }}
          className="w-full py-2 px-3 rounded-xl bg-ayur-50 dark:bg-ayur-900/50 hover:bg-ayur-100 dark:hover:bg-ayur-900 text-ayur-500 dark:text-ayur-400 text-sm font-medium flex items-center justify-between border border-ayur-200 dark:border-ayur-800/50 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="group-hover:text-ayur-900 dark:group-hover:text-white transition-colors">Search...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-ayur-900 text-[10px] font-sans font-semibold border border-ayur-200 dark:border-ayur-800 text-ayur-500">Ctrl K</kbd>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 custom-scrollbar">
        <h3 className="px-3 text-xs font-semibold text-ayur-400 dark:text-ayur-500 uppercase tracking-wider mb-1 mt-2">Recent Consultations</h3>
        
        {conversations.length === 0 ? (
           <p className="px-3 text-xs text-ayur-400">No recent consultations.</p>
        ) : (
          conversations.map(conv => (
            <div key={conv.id} className="relative group flex items-center">
              <button 
                onClick={() => navigate(`/app/chat/${conv.id}`)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate flex items-center gap-2 pr-8 ${currentChatId === conv.id ? activeClass : idleClass}`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" /> {conv.title}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(conv.id);
                }}
                className="absolute right-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-ayur-200 dark:border-ayur-900/50 flex flex-col gap-1">
        <button onClick={toggleTheme} className="w-full text-left px-3 py-2 rounded-lg text-sm text-ayur-600 dark:text-ayur-400 hover:text-ayur-900 dark:hover:text-white hover:bg-ayur-50 dark:hover:bg-ayur-900/50 transition-colors flex items-center gap-3">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button 
          onClick={() => toast.info('Settings are coming soon!')}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-ayur-600 dark:text-ayur-400 hover:text-ayur-900 dark:hover:text-white hover:bg-ayur-50 dark:hover:bg-ayur-900/50 transition-colors flex items-center gap-3"
        >
          <Settings className="w-4 h-4" /> Settings
        </button>
        
        {/* Profile Dropdown Simulation */}
        <div className="mt-2 pt-2 border-t border-ayur-200 dark:border-ayur-900/50">
          <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-ayur-600 dark:text-ayur-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors flex items-center gap-3">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </div>

    </div>
  );
}
