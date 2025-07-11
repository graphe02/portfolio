"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function UniversalViewTracker() {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load
    if (hasTracked.current) return;
    
    // Don't track on certain paths if needed
    const excludedPaths = ['/api', '/_next', '/favicon.ico'];
    if (excludedPaths.some(path => pathname?.startsWith(path))) {
      return;
    }

    const trackView = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          hasTracked.current = true;
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    // Track view after a small delay to ensure page is fully loaded
    const timeoutId = setTimeout(trackView, 1000);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // This component doesn't render anything visible
  return null;
} 