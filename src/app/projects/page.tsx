"use client";

import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { ProjectCard } from '@/components/project-card';
import { projects } from '@/lib/data';
import { FolderOpen } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Projects</h1>
          <p className="text-lg text-gray-600 mb-6">
            Explore my coding projects, experiments, and creative work
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <FolderOpen className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Projects</h2>
          </div>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No projects to display</p>
            </div>
          )}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
} 