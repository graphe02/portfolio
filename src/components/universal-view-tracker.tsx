"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function UniversalViewTracker() {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    console.log('UniversalViewTracker: useEffect triggered, pathname:', pathname);
    console.log('UniversalViewTracker: hasTracked.current:', hasTracked.current);
    
    // Only track once per page load
    if (hasTracked.current) {
      console.log('UniversalViewTracker: Already tracked, skipping');
      return;
    }
    
    // Don't track on certain paths if needed
    const excludedPaths = ['/api', '/_next', '/favicon.ico'];
    if (excludedPaths.some(path => pathname?.startsWith(path))) {
      console.log('UniversalViewTracker: Path excluded from tracking');
      return;
    }

    const registerVisitor = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          hasTracked.current = true;
        } else {
          console.error('UniversalViewTracker: Response not ok:', response.status);
        }
      } catch (error) {
        console.error('UniversalViewTracker: Error registering visitor:', error);
      }
    };

    // Track view after a small delay to ensure page is fully loaded
    console.log('UniversalViewTracker: Setting timeout to track view...');
    const timeoutId = setTimeout(registerVisitor, 1000);

    return () => {
      console.log('UniversalViewTracker: Cleaning up timeout');
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  // This component doesn't render anything visible
  return null;
} 