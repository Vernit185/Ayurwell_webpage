import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ChatInputProps {
  onSend: (msg: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + (prev ? " " : "") + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      toast.error("Speech recognition failed.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !disabled) {
        onSend(text);
        setText('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 pb-6">
      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onSubmit={handleSubmit} 
        className={`relative flex items-end bg-white dark:bg-sidebar rounded-3xl border ${disabled ? 'border-slate-200 dark:border-ayur-900 opacity-70' : 'border-slate-300 dark:border-ayur-800 focus-within:border-ayur-500 dark:focus-within:border-ayur-600 focus-within:ring-4 focus-within:ring-ayur-500/20'} shadow-sm transition-all`}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isRecording}
          placeholder="Describe your symptoms...
For example: 'I have had fever and headache for two days.'"
          className="w-full max-h-[200px] bg-transparent py-4 pl-6 pr-14 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-ayur-500 resize-none outline-none custom-scrollbar leading-relaxed"
          rows={1}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {text.trim() === '' ? (
            <button 
              type="button"
              onClick={startListening}
              className={`p-2 transition-colors rounded-full ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-ayur-600 dark:text-ayur-500 dark:hover:text-ayur-300'}`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          ) : (
            <button 
              type="submit"
              disabled={disabled || !text.trim()}
              className="p-2 bg-ayur-700 hover:bg-ayur-600 text-white rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:hover:bg-ayur-700"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.form>
      <div className="text-center mt-3">
        <span className="text-xs font-medium text-slate-400 dark:text-ayur-500">
          AyurWell deterministically evaluates clinical cases. It does not replace professional medical advice.
        </span>
      </div>
    </div>
  );
}
