import Image from 'next/image';
import Link from 'next/link';
import { FiGithub, FiExternalLink, FiVideo } from 'react-icons/fi';
import type { ProjectItem } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: ProjectItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const embedUrl = project.youtubeVideoId ? `https://www.youtube.com/embed/${project.youtubeVideoId}` : null;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardHeader className="p-0">
        {embedUrl ? (
          <div className="aspect-video w-full">
            <iframe
              src={embedUrl}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full rounded-t-lg"
            ></iframe>
          </div>
        ) : project.imageUrl ? (
          <div className="aspect-video relative w-full">
            <Image
              src={project.imageUrl}
              alt={project.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
              data-ai-hint="technology code"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-muted rounded-t-lg flex items-center justify-center">
            <Code2 className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1">{project.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-4">{project.description}</CardDescription>
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2 justify-start items-stretch sm:items-center">
        {project.repoUrl && (
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <FiGithub className="mr-2 h-4 w-4" /> GitHub
            </Link>
          </Button>
        )}
        {project.liveUrl && (
          <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <FiExternalLink className="mr-2 h-4 w-4" /> Live Demo
            </Link>
          </Button>
        )}
         {project.youtubeVideoId && (
             <Button asChild variant="outline" size="sm" className="w-full sm:w-auto sm:hidden">
                <Link href={`https://www.youtube.com/watch?v=${project.youtubeVideoId}`} target="_blank" rel="noopener noreferrer">
                    <FiVideo className="mr-2 h-4 w-4" /> Watch Video
                </Link>
            </Button>
         )}
      </CardFooter>
    </Card>
  );
}

// Helper icon if not imported elsewhere
const Code2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
