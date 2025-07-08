"use client";

import { AppFooter } from '@/components/app-footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function LifeUnderDayPage() {
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    {
      src: "/yi.png",
      alt: "Yi",
      title: "李",
      description: "This is my last name, 李 (Yi)."
    },
    {
      src: "/joon.png",
      alt: "Joon",
      title: "俊",
      description: "This is the first half of my first name, 俊 (Joon). It means 'handsome' or 'elegant'."
    },
    {
      src: "/seong.png",
      alt: "Seong",
      title: "星",
      description: "This is the latter half of my first name, 星 (Seong). It means 'star' and is composed of two parts: 生 (life) and 日 (day). They are quite literally the letter life underneath the letter day."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-grow container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-headline font-bold mb-8 sm:mb-12 text-center text-primary">
          lifeunderday
        </h1>
        <Card className="w-full max-w-6xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-center font-headline">What is lifeunderday?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Description Section */}
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                As a 1st generation Korean American, I am proud of my heritage and culture.
                "Life under day" is a phrase that captures the essence of my Korean name, 李俊星 (Yi Joon Seong). 
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The logo for my website is a combination of life and day, leaves wrapping around the sun.
                Big thanks to my friend, [] for designing this logo for me.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Together, they represent the idea of life existing under the light of day - a metaphor for 
                how we are the eyes of the world and live in no particular way.
              </p>
            </div>

            {/* Images Side by Side */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className="text-center cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setActiveImage(index)}
                >
                  <div className="aspect-square mb-2 sm:mb-4">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`w-full h-full object-cover rounded-lg shadow-md transition-all duration-300 ${
                        activeImage === index 
                          ? 'ring-4 ring-primary ring-opacity-50' 
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  </div>
                  {/* <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{image.title}</h3> */}
                </div>
              ))}
            </div>

            {/* Active Image Description */}
            <div className="text-center border-t pt-6">
              <h3 className="text-xl font-semibold mb-3">{images[activeImage].title}</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                {images[activeImage].description}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
} 