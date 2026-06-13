"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Music2, Code2, UserCircle, FolderOpen, Construction, Star, Eye } from 'lucide-react';
import { useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();

  const getActiveSection = () => {
    if (pathname === '/') { // Root is now the About page
      return 'about';
    }
    if (pathname === '/projects') {
      return 'projects';
    }
    if (pathname === '/lifeunderday') {
      return 'lifeunderday';
    }
    if (pathname.startsWith('/guitar')) {
      return 'guitar';
    }
    if (pathname === '/wip') {
      return 'wip';
    }
    if (pathname === '/eyes-of-the-world') {
      return 'eyes-of-the-world';
    }
    if (pathname.startsWith('/tab/')) {
      return 'guitar';
    }
    return ''; 
  };

  const activeSection = getActiveSection();

  const navLinkClasses = (sectionName: string) => cn(
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full",
    activeSection === sectionName
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:text-primary hover:bg-muted"
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className={navLinkClasses('about')} onClick={onClose}>
            <UserCircle className="h-5 w-5" />
            <span>About</span>
          </Link>
          <Link href="/lifeunderday" className={navLinkClasses('lifeunderday')} onClick={onClose}>
            <Star className="h-5 w-5" />
            <span>lifeunderday</span>
          </Link>
          <Link href="/guitar" className={navLinkClasses('guitar')} onClick={onClose}>
            <Music2 className="h-5 w-5" />
            <span>Guitar</span>
          </Link>
          <Link href="/projects" className={navLinkClasses('projects')} onClick={onClose}>
            <FolderOpen className="h-5 w-5" />
            <span>Projects</span>
          </Link>
          <Link href="/eyes-of-the-world" className={navLinkClasses('eyes-of-the-world')} onClick={onClose}>
            <Eye className="h-5 w-5" />
            <span>Eyes of the World</span>
          </Link>
          <Link href="/wip" className={navLinkClasses('wip')} onClick={onClose}>
            <Construction className="h-5 w-5" />
            <span>WIP</span>
          </Link>
        </nav>
      </aside>
    </>
  );
} 