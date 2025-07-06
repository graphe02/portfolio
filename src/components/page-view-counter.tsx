"use client";

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Users } from 'lucide-react';

interface PageViewCounterProps {
  resetCount?: boolean;
}

interface ViewStats {
  totalUnique: number;
  weekly: number;
}

export function PageViewCounter({ resetCount = false }: PageViewCounterProps) {
  const [viewStats, setViewStats] = useState<ViewStats>({
    totalUnique: 0,
    weekly: 0
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
            totalUnique: data.stats.totalUnique,
            weekly: data.stats.weekly
          });
        }
      }
    } catch (error) {
      console.error('Error tracking view:', error);
      // Fallback to showing 0 if API fails
      setViewStats({ totalUnique: 0, weekly: 0 });
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
          <Users className="h-3 w-3" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        <span>{viewStats.totalUnique.toLocaleString()} today</span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>{viewStats.weekly.toLocaleString()} this week</span>
      </div>
    </div>
  );
} 