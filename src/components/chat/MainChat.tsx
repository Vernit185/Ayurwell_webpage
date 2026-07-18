import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Activity, AlertTriangle, Info } from 'lucide-react';
import { fetchConversationDetail, submitChatQuery, submitFollowup, createConversation } from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import ChatInput from './ChatInput';
import { ChatSkeleton } from '../common/SkeletonLoaders';
import ClinicalCards from '../clinical/ClinicalCards';
import EvidenceViewer from '../clinical/EvidenceViewer';

export default function MainChat() {
  const navigate = useNavigate();
  const { id: chatId = 'new' } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId && chatId !== 'new' && chatId !== 'TODO') {
      loadChat();
    } else if (chatId === 'new') {
      setMessages([]);
    }
  }, [chatId]);

  const loadChat = async () => {
    try {
      const data = await fetchConversationDetail(chatId);
      setMessages(data.messages);
      scrollToBottom();
    } catch (err) {
      toast.error('Failed to load conversation. Please try again.');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    scrollToBottom();

    try {
      let activeChatId = chatId;
      let isNew = false;
      if (!activeChatId || activeChatId === 'new' || activeChatId === 'TODO') {
        const newConv = await createConversation(text.slice(0, 30) + '...');
        activeChatId = newConv.id;
        isNew = true;
        toast.success('Consultation started');
      }
      
      const res = await submitChatQuery({ session_id: activeChatId, query: text });
      
      if (isNew) {
         navigate(`/app/chat/${activeChatId}`, { replace: true });
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: res.llm.text, response_data: res }]);
      scrollToBottom();
    } catch (err) {
      toast.error('Network error. Unable to connect to Reasoning Engine.');
      setMessages(prev => prev.slice(0, -1)); // Rollback user msg on error
    } finally {
      setLoading(false);
    }
  };

  const handleFollowup = async (qId: string, qText: string, ans: boolean) => {
    setLoading(true);
    const ansText = `${qText} -> ${ans ? 'Yes' : 'No'}`;
    setMessages(prev => [...prev, { role: 'user', content: ansText }]);
    scrollToBottom();

    try {
      const res = await submitFollowup({ session_id: chatId, answers: { [qId]: ans } });
      setMessages(prev => [...prev, { role: 'assistant', content: res.llm.text, response_data: res }]);
      scrollToBottom();
    } catch (err) {
      toast.error('Failed to submit response.');
    } finally {
      setLoading(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-ayur-950 relative transition-colors duration-300">
      
      {/* Top Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-slate-200 dark:border-ayur-900/50 bg-white/80 dark:bg-sidebar/80 backdrop-blur-md shrink-0 sticky top-0 z-10 transition-colors">
        <h2 className="font-semibold text-sm text-slate-800 dark:text-ayur-100 flex items-center gap-2">
          <Activity size={16} className="text-ayur-600 dark:text-ayur-500" /> 
          {chatId === 'new' ? 'New Consultation' : 'Clinical Consultation'}
        </h2>
        <button 
          onClick={() => navigate('/app/chat/new')}
          className="text-sm px-4 py-1.5 bg-ayur-800 hover:bg-ayur-700 dark:bg-ayur-600 dark:hover:bg-ayur-500 text-white rounded-lg transition-colors font-medium shadow-sm"
        >
          New Consultation
        </button>
      </header>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10 pb-32">
          
          {messages.length === 0 && !loading && (
            <div className="text-center text-slate-400 dark:text-ayur-500 pt-20 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-ayur-100 dark:bg-ayur-900/30 flex items-center justify-center mb-6">
                <Bot className="h-8 w-8 text-ayur-600 dark:text-ayur-400" />
              </div>
              <p className="text-lg font-medium text-slate-600 dark:text-ayur-300 mb-2">How can AyurWell assist you today?</p>
              <p className="text-sm">Describe symptoms in detail for deterministic analysis.</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="shrink-0 h-8 w-8 rounded-full bg-ayur-700 flex items-center justify-center mt-1">
                    <Bot size={18} className="text-white" />
                  </div>
                )}
                
                <div className={`flex flex-col gap-4 max-w-3xl w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3.5 text-base shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 dark:bg-ayur-800 text-white rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-transparent dark:text-ayur-100 text-slate-800'}`}>
                    {msg.content}
                  </div>
                  
                  {/* Embedded Deterministic Sections */}
                  {msg.response_data && (
                    <div className="w-full flex flex-col gap-6 mt-2">
                      {msg.response_data.state?.diagnosis_state === "EMERGENCY" && (
                        <div className={`border-l-4 p-4 my-2 rounded-md w-full max-w-3xl ${msg.response_data.safety?.is_life_threatening ? 'bg-red-50 dark:bg-red-900/20 border-red-500' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'}`}>
                          <div className="flex items-center">
                            <AlertTriangle className={`${msg.response_data.safety?.is_life_threatening ? 'text-red-500' : 'text-amber-500'} mr-2 h-5 w-5`} />
                            <p className={`${msg.response_data.safety?.is_life_threatening ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'} font-bold`}>
                              {msg.response_data.safety?.is_life_threatening ? 'Life-Threatening Emergency Detected' : 'Urgent Medical Attention Recommended'}
                            </p>
                          </div>
                          <p className={`${msg.response_data.safety?.is_life_threatening ? 'text-red-600 dark:text-red-300' : 'text-amber-600 dark:text-amber-300'} text-sm mt-1`}>
                            {msg.response_data.safety?.reasons?.[0] || "Please seek immediate medical care. Do not rely on home remedies."}
                          </p>
                        </div>
                      )}

                      {msg.response_data.state?.prediction_complete && msg.response_data.state?.diagnosis_state !== "EMERGENCY" && (
                        <>
                          {msg.response_data.state?.diagnosis_state === "FINAL_LIMITED_EVIDENCE" && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl mb-4 text-sm text-blue-800 dark:text-blue-300">
                              <p className="font-semibold flex items-center gap-2 mb-1">
                                <Info className="h-4 w-4" /> Consultation concluded due to turn limit
                              </p>
                              <p>We have reached the maximum number of practical follow-up questions. The prediction below is based on limited evidence and confidence may improve with a clinical evaluation.</p>
                            </div>
                          )}
                          <ClinicalCards data={msg.response_data} />
                          <EvidenceViewer evidence={msg.response_data.evidence} treatments={msg.response_data.treatments} />
                        </>
                      )}
                      
                      {msg.response_data.state?.should_ask_followup && i === messages.length - 1 && (
                        <div className="mt-4 flex flex-col gap-3 w-full max-w-lg">
                          <p className="text-xs font-semibold text-slate-500 dark:text-ayur-500 uppercase tracking-wider">Follow-up Assessment</p>
                          {msg.response_data.followup.questions.map((q: any, idx: number) => (
                            <div key={idx} className="bg-white dark:bg-sidebar border border-slate-200 dark:border-ayur-800 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                              <p className="text-sm font-medium text-slate-800 dark:text-white leading-snug">{q.text}</p>
                              <div className="flex gap-2">
                                <button onClick={() => handleFollowup(q.id, q.text, true)} className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg text-sm font-medium transition-colors">Yes</button>
                                <button onClick={() => handleFollowup(q.id, q.text, false)} className="flex-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-sm font-medium transition-colors">No</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </motion.div>
            ))}
          </AnimatePresence>

          {loading && <ChatSkeleton />}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-ayur-950 dark:via-ayur-950 pt-8 pb-4 transition-colors">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>

    </div>
  );
}
