"use client";

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface PageViewCounterProps {
  resetCount?: boolean;
}

export function PageViewCounter({ resetCount = false }: PageViewCounterProps) {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    if (resetCount) {
      // Reset the count
      localStorage.setItem('pageViews', '0');
      setViewCount(0);
    } else {
      // Get current view count from localStorage
      const currentViews = localStorage.getItem('pageViews');
      const views = currentViews ? parseInt(currentViews) : 0;
      
      // Increment view count
      const newViews = views + 1;
      localStorage.setItem('pageViews', newViews.toString());
      
      setViewCount(newViews);
    }
  }, [resetCount]);

  return (
    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
      <Eye className="h-3 w-3" />
      <span>{viewCount.toLocaleString()} views</span>
    </div>
  );
} 