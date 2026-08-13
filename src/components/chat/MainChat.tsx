import React from 'react';
import { Activity } from 'lucide-react';

export default function MainChat() {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-white shrink-0 sticky top-0 z-10">
        <h2 className="font-semibold text-sm text-text flex items-center gap-2">
          <Activity size={16} className="text-primary" /> 
          AyurWell Chatbot
        </h2>
      </header>
      <div className="flex-1 w-full h-full">
        <iframe 
          src="https://ayurwell-lime.vercel.app" 
          title="AyurWell Chatbot"
          className="w-full h-full border-none"
          allow="microphone"
        />
      </div>
    </div>
  );
}
