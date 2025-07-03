"use client";

import { AppFooter } from '@/components/app-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';
import { useEffect } from 'react';

export default function GamingPage() {
  useEffect(() => {
    // Load the YouTube API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gaming</h1>
          <p className="text-lg text-gray-600 mb-6">
            Check out my gaming content and highlights
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Channel Info Card */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Gamepad2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Gaming Channel</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                I share gaming highlights, gameplay, and content with my friends on YouTube. 
                Check out my channel for the latest videos.
              </p>
              <div className="flex justify-center">
                <div 
                  className="g-ytsubscribe" 
                  data-channelid="UCxttKkO36w7DQILTgdXa0mw" 
                  data-layout="full" 
                  data-count="default"
                  style={{
                    transform: 'scale(1)',
                    transformOrigin: 'center'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
} 