"use client";


import { AppFooter } from '@/components/app-footer';
import { VideoCard } from '@/components/video-card';
import { guitarVideos } from '@/lib/data';
import { Music2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GuitarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Guitar Videos</h1>
          <p className="text-lg text-gray-600 mb-6">
            Explore my guitar demos and covers
          </p>
          
          {/* Large centered Edit Tablatures button
          <div className="flex justify-center mb-8">
            <Button asChild size="lg" className="w-full max-w-4xl h-16 text-xl font-semibold">
              <Link href="/tab/editor">
                <Edit3 className="mr-3 h-6 w-6" />
                Edit Tablatures
              </Link>
            </Button>
          </div> */}
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Music2 className="h-6 w-6 text-red-500" />
            <h2 className="text-2xl font-bold">Guitar Videos</h2>
          </div>
          {guitarVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guitarVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No guitar videos to display</p>
            </div>
          )}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
} 