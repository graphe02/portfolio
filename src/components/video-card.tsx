import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { guitarItem } from '@/lib/data';
import { ExternalLink } from 'lucide-react';

interface VideoCardProps {
  video: guitarItem;
}

export function VideoCard({ video }: VideoCardProps) {
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeVideoId}`;
  const videoUrl = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
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
