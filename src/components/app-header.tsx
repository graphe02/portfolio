"use client";

import Link from 'next/link';
import { VenetianMask, Music2, Code2, Gamepad2, UserCircle, FolderOpen } from 'lucide-react';
import { useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
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
    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
    activeSection === sectionName
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:text-primary hover:bg-muted"
  );

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2"> {/* Logo/Title links to About page (root) */}
          <VenetianMask className="h-8 w-8 text-primary" />
          <span className="text-2xl font-headline font-bold text-foreground">
            Daniel's Odds and Ends
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/" className={navLinkClasses('about')}> {/* About link points to root */}
            <UserCircle className="h-4 w-4" /> About
          </Link>
          <Link href="/guitar" className={navLinkClasses('guitar')}>
            <Music2 className="h-4 w-4" /> Guitar
          </Link>
          <Link href="/projects" className={navLinkClasses('projects')}>
            <FolderOpen className="h-4 w-4" /> Projects
          </Link>
          <Link href="/gaming" className={navLinkClasses('gaming')}>
            <Gamepad2 className="h-4 w-4" /> Gaming
          </Link>
        </nav>
      </div>
    </header>
  );
}
