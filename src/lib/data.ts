import tab1 from './tablatures/tab1.json';
import tab2 from './tablatures/tab2.json';
import guitarData from './guitar-data.json';
import codingData from './coding-data.json';

export interface TablatureItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  asciiContent?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface guitarItem {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  tablatureId?: string; 
  googleDriveUrl?: string;
}

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

// Import data from separate JSON files
export const guitarVideos: guitarItem[] = guitarData;
export const projects: ProjectItem[] = codingData;

// Import tablatures
export const tablatures: TablatureItem[] = [
  tab1 as TablatureItem,
  tab2 as TablatureItem,
];
