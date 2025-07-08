"use client";

import { useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';

interface PageViewCounterProps {
  resetCount?: boolean;
}

interface ViewStats {
  totalViews: number;
}

export function PageViewCounter({ resetCount = false }: PageViewCounterProps) {
  const [viewStats, setViewStats] = useState<ViewStats>({
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);

  const trackView = useCallback(async () => {
    try {
      // Track the view
      const response = await fetch('/api/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setViewStats({
            totalViews: data.stats.totalViews
          });
        }
      }
    } catch (error) {
      console.error('Error tracking view:', error);
      // Fallback to showing 0 if API fails
      setViewStats({ totalViews: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!resetCount) {
      // Use requestIdleCallback for better performance
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => trackView());
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(trackView, 0);
      }
    } else {
      setLoading(false);
    }
  }, [resetCount, trackView]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3" />
        <span>{viewStats.totalViews.toLocaleString()}</span>
      </div>
    </div>
  );
} 