"use client";

import { useState, useEffect } from 'react';
import { Eye, Calendar, TrendingUp } from 'lucide-react';

interface PageViewCounterProps {
  resetCount?: boolean;
}

interface ViewData {
  total: number;
  weekly: number;
  lastWeekStart: string;
}

export function PageViewCounter({ resetCount = false }: PageViewCounterProps) {
  const [viewData, setViewData] = useState<ViewData>({
    total: 0,
    weekly: 0,
    lastWeekStart: ''
  });

  useEffect(() => {
    if (resetCount) {
      // Reset the counts
      const resetData: ViewData = {
        total: 0,
        weekly: 0,
        lastWeekStart: getWeekStart()
      };
      localStorage.setItem('pageViews', JSON.stringify(resetData));
      setViewData(resetData);
    } else {
      // Get current view data from localStorage
      const stored = localStorage.getItem('pageViews');
      let currentData: ViewData;
      
      if (stored) {
        try {
          // Try to parse as JSON first (new format)
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object' && 'total' in parsed) {
            currentData = parsed;
          } else {
            // Old format - convert number to new format
            const oldTotal = parseInt(stored) || 0;
            currentData = {
              total: oldTotal,
              weekly: 0,
              lastWeekStart: getWeekStart()
            };
          }
        } catch (error) {
          // Invalid JSON - treat as old format
          const oldTotal = parseInt(stored) || 0;
          currentData = {
            total: oldTotal,
            weekly: 0,
            lastWeekStart: getWeekStart()
          };
        }
      } else {
        // No existing data
        currentData = {
          total: 0,
          weekly: 0,
          lastWeekStart: getWeekStart()
        };
      }

      // Check if we're in a new week
      const currentWeekStart = getWeekStart();
      if (currentData.lastWeekStart !== currentWeekStart) {
        // Reset weekly count for new week
        currentData.weekly = 0;
        currentData.lastWeekStart = currentWeekStart;
      }

      // Increment both counts
      currentData.total += 1;
      currentData.weekly += 1;

      // Save updated data
      localStorage.setItem('pageViews', JSON.stringify(currentData));
      setViewData(currentData);
    }
  }, [resetCount]);

  // Helper function to get the start of the current week (Monday)
  function getWeekStart(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToSubtract);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  return (
    <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3" />
        <span>{viewData.total.toLocaleString()} total views</span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        <span>{viewData.weekly.toLocaleString()} this week</span>
      </div>
    </div>
  );
} 