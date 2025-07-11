import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { guitarItem } from '@/lib/data';
import { Play, ExternalLink } from 'lucide-react';

interface VideoCardProps {
  video: guitarItem;
}

export function VideoCard({ video }: VideoCardProps) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`;
  const videoUrl = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackThumbnailUrl;
          }}
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Play className="h-12 w-12 text-white drop-shadow-lg" />
        </div>
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
