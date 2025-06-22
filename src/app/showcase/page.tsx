
"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { VideoCard } from '@/components/video-card';
import { ProjectCard } from '@/components/project-card';
import { guitarVideos, codingProjects, gamingVideos, VideoItem, ProjectItem } from '@/lib/data';
import { Music2, Code2, Gamepad2 } from 'lucide-react';

export default function ShowcasePage() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') || 'guitar';

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fade-in-down {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'guitar': return 'Guitar Covers & Tabs';
      case 'coding': return 'Coding Projects';
      case 'gaming': return 'Gaming Highlights';
      default: return 'Personal Showcase';
    }
  };

  const renderGuitarVideos = () => {
    if (guitarVideos.length === 0) {
      return <p className="text-muted-foreground col-span-full text-center py-8">No guitar videos to display.</p>;
    }
    return guitarVideos.map((video) => (
      <VideoCard key={video.id} video={video} />
    ));
  };

  const renderCodingProjects = () => {
    if (codingProjects.length === 0) {
      return <p className="text-muted-foreground col-span-full text-center py-8">No coding projects to display.</p>;
    }
    return codingProjects.map((project) => (
      <ProjectCard key={project.id} project={project} />
    ));
  };

  const renderGamingVideos = () => {
    if (gamingVideos.length === 0) {
      return <p className="text-muted-foreground col-span-full text-center py-8">No gaming videos to display.</p>;
    }
    return gamingVideos.map((video) => (
      <VideoCard key={video.id} video={video} />
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <AppHeader />
      <main className="flex-grow py-8 sm:py-12">
        <div className="px-4 sm:px-6 lg:px-8"> 
          <h1 className="text-4xl sm:text-5xl font-headline font-bold mb-8 sm:mb-12 text-center text-primary animate-fade-in-down">
            {getSectionTitle()}
          </h1>
        </div>

        {activeSection === 'guitar' && (
          <div className="w-full"> 
            <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-4 sm:mb-6 flex items-center">
                <Music2 className="mr-3 h-6 w-6 text-accent" />Guitar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {renderGuitarVideos()}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'coding' && (
          <div className="w-full mt-8 sm:mt-12"> 
             <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-4 sm:mb-6 flex items-center">
                <Code2 className="mr-3 h-6 w-6 text-accent" />Coding
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {renderCodingProjects()}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'gaming' && (
          <div className="w-full mt-8 sm:mt-12"> 
            <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-4 sm:mb-6 flex items-center">
                <Gamepad2 className="mr-3 h-6 w-6 text-accent" />Gaming
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {renderGamingVideos()}
              </div>
            </div>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
