"use client";

import { PageViewCounter } from '@/components/page-view-counter';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function EyesOfTheWorldPage() {
  const [isEyesOpen, setIsEyesOpen] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Blinking eyes effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsEyesOpen(prev => !prev);
    }, 2000); // Toggle every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Regular refresh for view counter
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full Screen Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/spinning.gif"
          alt="Eyes of the World"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Fixed Page View Counter with Eyes */}
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        {/* Eyes Images */}
        <div className="relative w-[300px] h-[150px] sm:w-[350px] sm:h-[175px] md:w-[400px] md:h-[200px] lg:w-[500px] lg:h-[250px] xl:w-[600px] xl:h-[300px]">
          <Image
            src="/eyes-open.png"
            alt="Eyes Open"
            fill
            className={`object-contain transition-opacity duration-300 ${
              isEyesOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <Image
            src="/eyes-closed.png"
            alt="Eyes Closed"
            fill
            className={`object-contain transition-opacity duration-300 ${
              isEyesOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
        
        {/* View Counter */}
        <PageViewCounter 
          key={refreshKey}
          className="flex flex-col items-center gap-4 text-amber-50"
          showIcon={false}
          size="xl"
        />
      </div>
    </div>
  );
} 