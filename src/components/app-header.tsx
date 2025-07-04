"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AppHeader({ isSidebarOpen, onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 h-16 flex items-center justify-between px-4">
      {/* Left side - Sidebar toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      
      {/* Center - Logo/Title */}
      <div className="flex-1 flex justify-center">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Daniel's Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-xl font-headline font-bold text-foreground">
            Daniel's Odds and Ends
          </span>
        </Link>
      </div>
      
      {/* Right side - Spacer for balance */}
      <div className="w-10" />
    </header>
  );
} 