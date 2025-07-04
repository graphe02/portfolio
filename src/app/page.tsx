"use client";

import { AppFooter } from '@/components/app-footer';
import { PageViewCounter } from '@/components/page-view-counter';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FiGithub, 
  FiLinkedin, 
  FiYoutube, 
  FiMail,
  FiExternalLink
} from 'react-icons/fi';

export default function AboutPage() {
  // Social media links - update these with your actual URLs
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/daniel02yi/',
      icon: FiLinkedin,
      color: 'hover:bg-blue-600 hover:text-white'
    },
    {
      name: 'Guitar and Projects',
      url: 'https://youtube.com/@DanielsOddsEnds',
      icon: FiYoutube,
      color: 'hover:bg-red-600 hover:text-white'
    },
    {
      name: 'Gaming',
      url: 'https://youtube.com/@graphe0292',
      icon: FiYoutube,
      color: 'hover:bg-red-600 hover:text-white'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/graphe02',
      icon: FiGithub,
      color: 'hover:bg-gray-800 hover:text-white'
    },
    {
      name: 'Email',
      url: 'mailto:daniel02yi@gmail.com',
      icon: FiMail,
      color: 'hover:bg-gray-600 hover:text-white'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold mb-8 sm:mb-12 text-center text-primary animate-fade-in-down">
          About Me
        </h1>
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-center font-headline">Welcome to My Website!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex justify-center mb-8">
              <Image
                src="/pfp3.jpg"
                alt="Daniel's Profile Picture"
                width={200}
                height={200}
                className="rounded-full shadow-md"
                data-ai-hint="profile person"
              />
            </div>
            <p>
              Hi! I'm Daniel — an engineer, musician, and gamer.
              This space is a collection of the things I enjoy creating and exploring.
            </p>
            <p>
              I believe that as times change, we should grow and adapt—and that everyone needs a platform to share their thoughts and passions. 
              It is becoming harder and harder to find unique ways to represent oneself, and I think the internet serves a great purpose in that aspect.
              Whether it's a website, blog, social media feed, or podcast, it's all about expressing who you are.
            </p>
            <p>
              This site is a showcase of my projects, ideas, and hobbies. I hope it sparks conversations, inspires feedback, and keeps me motivated to keep learning and building.
            </p>
            <p>
              Thanks for stopping by!
            </p>
            
            {/* Social Media Buttons */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-semibold mb-4 text-center">Connect With Me</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Button
                      key={social.name}
                      asChild
                      variant="outline"
                      size="sm"
                      className={`transition-all duration-200 ${social.color}`}
                    >
                      <a 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{social.name}</span>
                        <FiExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Page View Counter */}
            <div className="pt-6 border-t border-border">
              <PageViewCounter />
            </div>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
