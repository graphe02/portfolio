"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { VideoCard } from '@/components/video-card';
import { ProjectCard } from '@/components/project-card';
import { guitarVideos, codingProjects, gamingVideos, guitarItem, ProjectItem, gamingItem } from '@/lib/data';
import { Music2, Code2, Gamepad2 } from 'lucide-react';

// Static data - this will be populated at build time
const STATIC_DATA = {
  guitarVideos: guitarVideos,
  codingProjects: codingProjects,
  gamingVideos: gamingVideos
};

export default function ShowcasePage() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section') || 'guitar';

  const renderContent = () => {
    switch (section) {
      case 'guitar':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Music2 className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-bold">Guitar Videos</h2>
            </div>
            {STATIC_DATA.guitarVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STATIC_DATA.guitarVideos.map((video) => (
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
        );

      case 'coding':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Code2 className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold">Coding Projects</h2>
            </div>
            {STATIC_DATA.codingProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STATIC_DATA.codingProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No coding projects to display</p>
              </div>
            )}
          </div>
        );

      case 'gaming':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Gamepad2 className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-bold">Gaming Videos</h2>
            </div>
            {STATIC_DATA.gamingVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {STATIC_DATA.gamingVideos.map((video) => (
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Showcase</h1>
          <p className="text-lg text-gray-600 mb-6">
            Explore my guitar videos, coding projects, and gaming content
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/showcase?section=guitar"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                section === 'guitar'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Music2 className="inline h-4 w-4 mr-2" />
              Guitar
            </Link>
            
            <Link
              href="/showcase?section=coding"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                section === 'coding'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Code2 className="inline h-4 w-4 mr-2" />
              Coding
            </Link>
            
            <Link
              href="/showcase?section=gaming"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                section === 'gaming'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Gamepad2 className="inline h-4 w-4 mr-2" />
              Gaming
            </Link>
          </div>
        </div>
        
        {renderContent()}
      </main>
      
      <AppFooter />
    </div>
  );
}
