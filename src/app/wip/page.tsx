"use client";

import { AppFooter } from '@/components/app-footer';
import { Separator } from '@/components/ui/separator';
import { Construction } from 'lucide-react';

export default function WIPPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Work in Progress</h1>
          <p className="text-lg text-gray-600 mb-6">
            Projects I'm currently working on and experimenting with
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Construction className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold">In Development</h2>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="space-y-8">
            {/* Template */}
            {/* <div>
              <h3 className="text-xl font-semibold mb-2">...</h3>
              <p className="text-gray-600 mb-2">
                ...
              </p>
              <p className="text-sm text-gray-500">
                Status: ...
              </p>
            </div> */}
            {/* <Separator /> */}

            <div>
              <h3 className="text-xl font-semibold mb-2">Always working on some song...</h3>
              <p className="text-gray-600 mb-2">
                Guitar and my voice
              </p>
              <p className="text-sm text-gray-500">
                Status: 
              </p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2">osu! playing robot using STM32</h3>
              <p className="text-gray-600 mb-2">
                Electrical + YOLO + STM32
              </p>
              <p className="text-sm text-gray-500">
                Status: Stuck on figuring out a good algorithm
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Guitar Pedal using STM32</h3>
              <p className="text-gray-600 mb-2">
                Electrical + STM32
              </p>
              <p className="text-sm text-gray-500">
                Status: Stuck on software I/O
              </p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2">Guitar Jamming Platform</h3>
              <p className="text-gray-600 mb-2">
                Flutter
              </p>
              <p className="text-sm text-gray-500">
                Status: Can't figure out a good networking solution
              </p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2">Networked Pong</h3>
              <p className="text-gray-600 mb-2">
                C++, Raylib, TCP/UDP
              </p>
              <p className="text-sm text-gray-500">
                Status: Preoccupied with other projects
              </p>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-2">High Performance Aim Trainer</h3>
              <p className="text-gray-600 mb-2">
                C++, Raylib, Calculus
              </p>
              <p className="text-sm text-gray-500">
                Status: Figuring out a good way to implement equations for targets
              </p>
            </div>
            
            <Separator />
            
            <div className="text-center py-8">
              <p className="text-gray-500 italic">More projects coming soon...</p>
            </div>
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
} 