import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonBlock({ width = '100%', height = '16px', className = '' }: { width?: string, height?: string, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}
      style={{ width, height }}
      className={`bg-slate-200 dark:bg-ayur-900 rounded-lg ${className}`}
    />
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex gap-4 w-full justify-start mt-6">
      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-ayur-900 animate-pulse" />
      <div className="flex flex-col gap-3 w-full max-w-3xl pt-1">
        <SkeletonBlock width="80%" height="16px" />
        <SkeletonBlock width="60%" height="16px" />
        <SkeletonBlock width="90%" height="16px" />
        
        {/* Clinical Section Skeleton */}
        <div className="mt-6 border border-slate-200 dark:border-ayur-900/50 rounded-2xl p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <SkeletonBlock width="150px" height="24px" />
            <SkeletonBlock width="100px" height="20px" className="rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBlock height="120px" className="rounded-xl" />
            <SkeletonBlock height="120px" className="rounded-xl" />
          </div>
          <SkeletonBlock width="100%" height="40px" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}
