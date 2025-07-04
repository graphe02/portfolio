"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Music2, Code2, Gamepad2, UserCircle, FolderOpen } from 'lucide-react';
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
    if (pathname === '/guitar') {
      return 'guitar';
    }
    if (pathname === '/projects') {
      return 'projects';
    }
    if (pathname === '/gaming') {
      return 'gaming';
    }
    if (pathname.startsWith('/tab/')) {
      return 'guitar'; // Keep guitar active when viewing a tab
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
          <Link href="/guitar" className={navLinkClasses('guitar')} onClick={onClose}>
            <Music2 className="h-5 w-5" />
            <span>Guitar</span>
          </Link>
          <Link href="/projects" className={navLinkClasses('projects')} onClick={onClose}>
            <FolderOpen className="h-5 w-5" />
            <span>Projects</span>
          </Link>
          <Link href="/gaming" className={navLinkClasses('gaming')} onClick={onClose}>
            <Gamepad2 className="h-5 w-5" />
            <span>Gaming</span>
          </Link>
        </nav>
      </aside>
    </>
  );
} 