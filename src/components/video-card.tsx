import Link from 'next/link';
import { Youtube, FileText, FolderOpen } from 'lucide-react';
import type { guitarItem, gamingItem } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoCardProps {
  video: guitarItem | gamingItem;
}

export function VideoCard({ video }: VideoCardProps) {
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeVideoId}`;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-t-lg"
          ></iframe>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">{video.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">{video.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2 justify-start items-stretch sm:items-center">
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
          <Link href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`} target="_blank" rel="noopener noreferrer">
            <Youtube className="mr-2 h-4 w-4" /> Watch on YouTube
          </Link>
        </Button>
        {'tablatureId' in video && video.tablatureId && (
          <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
            <Link href={`/tab/${video.tablatureId}`}>
              <FileText className="mr-2 h-4 w-4" /> View Tab
            </Link>
          </Button>
        )}
        {'googleDriveUrl' in video && video.googleDriveUrl && (
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href={video.googleDriveUrl} target="_blank" rel="noopener noreferrer">
              <FolderOpen className="mr-2 h-4 w-4" /> Google Drive
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
