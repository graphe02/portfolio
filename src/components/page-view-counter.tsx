"use client";

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

export function PageViewCounter() {
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    // Get current view count from localStorage
    const currentViews = localStorage.getItem('pageViews');
    const views = currentViews ? parseInt(currentViews) : 0;
    
    // Increment view count
    const newViews = views + 1;
    localStorage.setItem('pageViews', newViews.toString());
    
    setViewCount(newViews);
  }, []);

  return (
    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
      <Eye className="h-3 w-3" />
      <span>{viewCount.toLocaleString()} views</span>
    </div>
  );
} 