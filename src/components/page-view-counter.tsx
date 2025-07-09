"use client";

import { useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';

interface PageViewCounterProps {
  resetCount?: boolean;
  className?: string;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
}

export function PageViewCounter({ 
  resetCount = false, 
  className = "flex flex-col items-center gap-2 text-xs text-muted-foreground",
  showIcon = true,
  size = 'small'
}: PageViewCounterProps) {
  const [viewCount, setViewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const incrementView = useCallback(async () => {
    try {
      // POST to increment the view count
      const response = await fetch('/api/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const countText = await response.text();
        const count = parseInt(countText, 10);
        if (!isNaN(count)) {
          setViewCount(count);
        }
      }
    } catch (error) {
      console.error('Error incrementing view:', error);
      setViewCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const getViewCount = useCallback(async () => {
    try {
      // GET to fetch the current count without incrementing
      const response = await fetch('/api/views', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const countText = await response.text();
        const count = parseInt(countText, 10);
        if (!isNaN(count)) {
          setViewCount(count);
        }
      }
    } catch (error) {
      console.error('Error getting view count:', error);
      setViewCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!resetCount) {
      // POST to increment on main page
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => incrementView());
      } else {
        setTimeout(incrementView, 0);
      }
    } else {
      // GET to fetch count on other pages
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => getViewCount());
      } else {
        setTimeout(getViewCount, 0);
      }
    }
  }, [resetCount, incrementView, getViewCount]);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-2xl';
      case 'xl':
        return 'text-8xl sm:text-9xl font-bold tracking-wider drop-shadow-2xl';
      default:
        return 'text-xs';
    }
  };

  if (loading) {
    return (
      <div className={className}>
        {showIcon && <Eye className="h-3 w-3" />}
        <span>...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {showIcon && <Eye className="h-3 w-3" />}
      <span className={getSizeClasses()}>{viewCount.toLocaleString()}</span>
    </div>
  );
} 