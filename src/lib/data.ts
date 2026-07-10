import projectsData from "../../content/projects.json";
import wipData from "../../content/wip.json";
import socialData from "../../content/social.json";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  repoUrl?: string;
  liveUrl?: string;
  youtubeVideoId?: string;
  imageUrl?: string;
}

export interface WipItem {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface SocialLink {
  name: string;
  url: string;
}

export const projects: ProjectItem[] = projectsData;
export const wipItems: WipItem[] = wipData;
export const socialLinks: SocialLink[] = socialData;
