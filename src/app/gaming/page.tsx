"use client";


import { AppFooter } from '@/components/app-footer';
import { VideoCard } from '@/components/video-card';
import { gamingVideos } from '@/lib/data';
import { Gamepad2 } from 'lucide-react';

export default function GamingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gaming Videos</h1>
          <p className="text-lg text-gray-600 mb-6">
            Check out my gaming content, highlights, and gameplay
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Gamepad2 className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold">Gaming Videos</h2>
          </div>
          {gamingVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gamingVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No gaming videos to display</p>
            </div>
          )}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
} 