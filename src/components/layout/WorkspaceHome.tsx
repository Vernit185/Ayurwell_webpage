import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, BookOpen, Stethoscope, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { fetchConversations } from '../../api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: any = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function WorkspaceHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchConversations();
        setConversations(data.slice(0, 5)); // Show max 5 on home
      } catch (err) {
        console.error('Failed to load conversations', err);
      }
    };
    loadData();
  }, []);

  // Determine greeting based on time of day
  const hour = new Date().getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-ayur-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8 md:p-12 pt-20">
        
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center text-center gap-6 mb-16">
          <motion.div variants={item}>
            <h1 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight mb-2">
              {greeting}, {user?.email ? user.email.split('@')[0] : 'Guest'}
            </h1>
            <p className="text-lg text-slate-500 dark:text-ayur-400">
              How are you feeling today?
            </p>
          </motion.div>
          
          <motion.div variants={item} className="w-full max-w-sm mt-4">
            <button 
              onClick={() => navigate('/app/chat/new')}
              className="w-full py-4 bg-ayur-700 hover:bg-ayur-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-premium hover:shadow-premium-dark"
            >
              <Plus className="w-5 h-5" /> Start New Consultation
            </button>
          </motion.div>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Recent */}
          <motion.div variants={item} className="p-6 bg-white dark:bg-ayur-900 rounded-3xl border border-slate-200 dark:border-ayur-800 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg">Recent Conversations</h3>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              {conversations.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-ayur-400 italic">No recent consultations.</p>
              ) : (
                conversations.map(conv => (
                  <button 
                    key={conv.id} 
                    onClick={() => navigate(`/app/chat/${conv.id}`)}
                    className="text-left py-2 px-3 hover:bg-slate-50 dark:hover:bg-ayur-800 rounded-xl text-sm font-medium text-slate-600 dark:text-ayur-300 transition-colors truncate"
                  >
                    {conv.title}
                  </button>
                ))
              )}
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div 
              variants={item} 
              onClick={() => toast.info('Knowledge Hub is coming soon in the next sprint!')}
              className="p-6 bg-white dark:bg-ayur-900 rounded-3xl border border-slate-200 dark:border-ayur-800 shadow-sm cursor-pointer hover:border-ayur-300 dark:hover:border-ayur-700 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Knowledge Hub</h3>
                  <p className="text-sm text-slate-500 dark:text-ayur-400">Explore Ayurvedic literature.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item} 
              onClick={() => toast.info('Doctor Discovery is coming soon in the next sprint!')}
              className="p-6 bg-white dark:bg-ayur-900 rounded-3xl border border-slate-200 dark:border-ayur-800 shadow-sm cursor-pointer hover:border-ayur-300 dark:hover:border-ayur-700 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Find Doctors</h3>
                  <p className="text-sm text-slate-500 dark:text-ayur-400">Connect with certified practitioners.</p>
                </div>
              </div>
            </motion.div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}
