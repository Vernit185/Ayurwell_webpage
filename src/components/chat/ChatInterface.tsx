import React, { useState } from 'react';
import { Send, Loader2, User, Bot, Check, X } from 'lucide-react';
import type { AyurWellResponse } from '../../types/api';

interface ChatInterfaceProps {
  loading: boolean;
  response: AyurWellResponse | null;
  onSendQuery: (q: string) => void;
  onSendFollowup: (answers: Record<string, boolean>) => void;
  onReset: () => void;
}

export default function ChatInterface({ loading, response, onSendQuery, onSendFollowup, onReset }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    // In a real app we'd keep full history in state, here we just show latest
    setHistory(prev => [...prev, { role: 'user', text: input }]);
    onSendQuery(input);
    setInput('');
  };

  const handleFollowup = (q: string, ans: boolean) => {
    setHistory(prev => [...prev, { role: 'user', text: `${q} -> ${ans ? 'Yes' : 'No'}` }]);
    onSendFollowup({ [q]: ans });
  };

  const handleReset = () => {
    setHistory([]);
    onReset();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="font-semibold text-slate-800">Clinical Consultation</h2>
        <button 
          onClick={handleReset}
          className="text-xs font-medium text-slate-500 hover:text-ayur-600 transition-colors"
        >
          Reset Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
        {history.length === 0 && !loading && (
          <div className="text-center text-slate-400 my-auto pt-20">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Describe the patient's symptoms to begin.</p>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-ayur-100 text-ayur-700' : 'bg-slate-100 text-slate-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-ayur-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="shrink-0 h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 rounded-tl-none flex items-center gap-2 text-sm">
              <Loader2 className="animate-spin" size={16} />
              Reasoning...
            </div>
          </div>
        )}

        {/* LLM Explanation & Follow-ups */}
        {response && !loading && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="shrink-0 h-8 w-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-tl-none prose prose-sm max-w-full">
                {response.llm.text}
              </div>
            </div>
            
            {response.followup.questions.length > 0 && (
              <div className="ml-11 flex flex-col gap-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Follow-up Questions</p>
                {response.followup.questions.map((q, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 bg-white border border-ayur-200 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-slate-800">{q}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleFollowup(q, true)} className="flex-1 py-1.5 flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors border border-emerald-200">
                        <Check size={14} /> Yes
                      </button>
                      <button onClick={() => handleFollowup(q, false)} className="flex-1 py-1.5 flex items-center justify-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-200">
                        <X size={14} /> No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="E.g. I have a severe headache and nausea..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-ayur-500 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1.5 p-2 bg-ayur-600 text-white rounded-full hover:bg-ayur-700 disabled:opacity-50 disabled:hover:bg-ayur-600 transition-colors flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">
          Queries are deterministically processed against Government datasets.
        </p>
      </form>
    </div>
  );
}
