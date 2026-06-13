"use client";

import { useState, useEffect, useCallback } from 'react';
import { Eye } from 'lucide-react';

interface PageViewCounterProps {
  className?: string;
  showIcon?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
}

export function PageViewCounter({ 
  className = "flex flex-col items-center gap-2 text-xs text-muted-foreground",
  showIcon = true,
  size = 'small'
}: PageViewCounterProps) {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getVisitorCount = useCallback(async () => {
    try {
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
          setVisitorCount(count);
        }
      }
    } catch (error) {
      console.error('Error getting visitor count:', error);
      setVisitorCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => getVisitorCount());
    } else {
      setTimeout(getVisitorCount, 0);
    }
  }, [getVisitorCount]);

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
      <span className={getSizeClasses()}>{visitorCount.toLocaleString()}</span>
    </div>
  );
} 