"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { guitarItem } from "@/lib/data";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: guitarItem;
  className?: string;
  embedClassName?: string;
  thumbnailClassName?: string;
  playIconClassName?: string;
}

export function VideoCard({
  video,
  className,
  embedClassName,
  thumbnailClassName,
  playIconClassName,
}: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeVideoId}?autoplay=1`;
  const videoUrl = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;
  const thumbnailUrl = `https://i.ytimg.com/vi/${video.youtubeVideoId}/hqdefault.jpg`;

  return (
    <Card className={cn("overflow-hidden transition-shadow duration-200", className)}>
      <div className={cn("aspect-video w-full shrink-0", embedClassName)}>
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className={thumbnailClassName}
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${video.title}`}
          >
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            <span className={playIconClassName} aria-hidden="true">
              <Play className="h-10 w-10 fill-current" />
            </span>
          </button>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {video.description}
          </p>
        )}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Watch on YouTube
        </a>
      </CardContent>
    </Card>
  );
}
