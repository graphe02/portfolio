
"use client";

import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold mb-8 sm:mb-12 text-center text-primary animate-fade-in-down">
          About Me
        </h1>
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-center font-headline">Welcome to My Showcase!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex justify-center mb-8">
              <Image
                src="https://placehold.co/200x200.png"
                alt="My Profile Picture"
                width={200}
                height={200}
                className="rounded-full shadow-md"
                data-ai-hint="profile person"
              />
            </div>
            <p>
              Hello! I'm Daniel, a passionate developer, musician, and gamer
              with a love for creating and sharing. This space is a collection of my various projects, musical endeavors,
              and gaming highlights.
            </p>
            <p>
              My journey into [mention a key area like coding or music] began [mention when or how]. Since then, I've been
              captivated by [mention what captivates you]. I believe in [mention a core belief related to your work/hobbies].
            </p>
            <p>
              Through this showcase, I hope to [mention your goal for the showcase - e.g., share my work, connect with others,
              document my progress]. Feel free to explore the different sections to see what I've been up to.
            </p>
            <p>
              When I'm not [coding/playing guitar/gaming], you can find me [mention other hobbies or interests].
            </p>
            <p>
              Thanks for stopping by!
            </p>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
