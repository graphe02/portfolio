import { TablatureItem } from './data';

// Function to get a tablature by ID
export function getTablatureById(id: string, tablatures: TablatureItem[]): TablatureItem | undefined {
  return tablatures.find(tab => tab.id === id);
}

// Function to get all tablatures
export function getAllTablatures(tablatures: TablatureItem[]): TablatureItem[] {
  return tablatures;
}

// Function to get tablatures by difficulty
export function getTablaturesByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard', tablatures: TablatureItem[]): TablatureItem[] {
  return tablatures.filter(tab => tab.difficulty === difficulty);
}

// Function to search tablatures by title or artist
export function searchTablatures(query: string, tablatures: TablatureItem[]): TablatureItem[] {
  const lowerQuery = query.toLowerCase();
  return tablatures.filter(tab => 
    tab.title.toLowerCase().includes(lowerQuery) ||
    tab.artist.toLowerCase().includes(lowerQuery) ||
    tab.description.toLowerCase().includes(lowerQuery)
  );
} 