import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-ayur-950 flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-white dark:bg-sidebar rounded-3xl p-10 border border-slate-200 dark:border-ayur-900 shadow-premium"
          >
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
              <AlertOctagon className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-heading font-semibold text-slate-900 dark:text-white mb-3">
              Something went wrong.
            </h1>
            <p className="text-slate-500 dark:text-ayur-400 mb-8 leading-relaxed">
              We encountered an unexpected error while rendering this page. Your session data is safe.
            </p>
            
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/app';
              }}
              className="w-full py-3.5 bg-ayur-700 hover:bg-ayur-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <RotateCcw className="w-5 h-5" /> Return to Workspace
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
