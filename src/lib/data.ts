
export interface TablatureItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  asciiContent: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
  category: 'guitar' | 'gaming';
  thumbnailUrl?: string; 
  tablatureId?: string; 
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

const sampleAsciiTab = `
e|---------------------------------------------------------------------------|
B|---------------------------------------------------------------------------|
G|---------------------------------------------------------------------------|
D|---------------------------------------------------------------------------|
A|---------------------------------------------------------------------------|
E|---------------------------------------------------------------------------|

Artist: Your Artist
Song: Your Song Title
Tabbed by: Your Name

[Intro]
e|-----------------------------|-----------------------------|
B|-------1-------------1-------|-------1-------------1-------|
G|-----0---0---------0---0-----|-----2---2---------2---2-----|
D|---2-------2-----2-------2---|---3-------3-----3-------3---|
A|-3-----------3-2-----------2-|-0-----------0---------------|
E|-----------------------------|---------------3-----------3-|

[Verse]
e|-----------------------------|-----------------------------|
B|-------1-------------1-------|-------1-------------1-------|
G|-----0---0---------0---0-----|-----2---2---------2---2-----|
D|---2-------2-----2-------2---|---3-------3-----3-------3---|
A|-3-----------3-2-----------2-|-0-----------0---------------|
E|-----------------------------|---------------3-----------3-|

Repeat as needed. Add more sections like [Chorus], [Bridge], [Solo] etc.
`;

export const tablatures: TablatureItem[] = [
  {
    id: 'tab1',
    title: 'Stairway to Heaven (Intro Snippet)',
    artist: 'Led Zeppelin',
    description: 'A small snippet of the classic fingerpicked intro.',
    asciiContent: `
e|-----------5-7-----7-|-8-----8-2-----2-|-0---------0-----|-----------------|
B|---------5-----5-----|---5-------3-----|---1---1-----1---|-----------------|
G|-------5---------5---|-----5-------2---|-----2---------2-|-0-2-4-5-2-0-----|
D|-----7-------6-------|-5-------4-------|-3---------------|-------------3-2-|
A|---7-----------------|-----------------|-----------------|-----------------|
E|-5-------------------|-----------------|-----------------|-----------------|
    `,
    difficulty: 'Medium',
  },
  {
    id: 'tab2',
    title: 'Simple Blues Riff',
    artist: 'Original',
    description: 'An easy and fun blues riff.',
    asciiContent: sampleAsciiTab.replace('Your Artist', 'Original').replace('Your Song Title', 'Simple Blues Riff'),
    difficulty: 'Easy',
  },
];

export const guitarVideos: VideoItem[] = [
  {
    id: 'gv1',
    title: 'Mastering the Pentatonic Scale',
    description: 'A deep dive into the most versatile scale for guitarists. Tab available for a sample lick.',
    youtubeVideoId: 'rokGy0huYEA',
    category: 'guitar',
    tablatureId: 'tab2',
  },
  {
    id: 'gv2',
    title: 'Acoustic Fingerstyle Tutorial',
    description: 'Learn a beautiful fingerstyle piece for acoustic guitar. Includes tab for the intro.',
    youtubeVideoId: 'qBqP_g00gEc',
    category: 'guitar',
    tablatureId: 'tab1',
  },
  {
    id: 'gv3',
    title: 'Another Great Cover',
    description: 'Check out this cool guitar cover. No tab for this one yet!',
    youtubeVideoId: 'LuJ4i3z_lfY',
    category: 'guitar',
  },
];

export const codingProjects: ProjectItem[] = [
  {
    id: 'cp1',
    title: 'Personal Portfolio Website',
    description: 'The very website you are looking at! Built with Next.js, Tailwind CSS, and ShadCN UI.',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'ShadCN UI'],
    repoUrl: 'https://github.com/example/portfolio',
    liveUrl: '/', // Updated: Link to the current site (root which is now About page)
    youtubeVideoId: 'dQw4w9WgXcQ', 
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'cp2',
    title: 'E-commerce Platform Backend',
    description: 'A robust backend system for an e-commerce application, featuring product management, user authentication, and order processing.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    repoUrl: 'https://github.com/example/ecommerce-backend',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

export const gamingVideos: VideoItem[] = [
  {
    id: 'gmv1',
    title: 'My Best Apex Legends Plays',
    description: 'A compilation of my most exciting moments and squad wipes in Apex Legends.',
    youtubeVideoId: 'f4ZVj43qpyM', 
    category: 'gaming',
  },
  {
    id: 'gmv2',
    title: 'Exploring the World of Elden Ring',
    description: 'A scenic walkthrough of some of the most beautiful areas in Elden Ring.',
    youtubeVideoId: 'JldMvQMO_cs', 
    category: 'gaming',
  },
];
