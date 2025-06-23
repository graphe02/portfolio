#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { RSS_FEEDS } = require('../src/lib/rss-config.js');

// Function to read existing data from separate JSON files
function readExistingData() {
  const guitarPath = path.join(process.cwd(), 'src/lib/guitar-data.json');
  const codingPath = path.join(process.cwd(), 'src/lib/coding-data.json');
  const gamingPath = path.join(process.cwd(), 'src/lib/gaming-data.json');
  
  let guitarData = [];
  let codingData = [];
  let gamingData = [];
  
  try {
    if (fs.existsSync(guitarPath)) {
      guitarData = JSON.parse(fs.readFileSync(guitarPath, 'utf8'));
      console.log('Found existing guitar-data.json');
    }
  } catch (error) {
    console.warn('Error reading guitar-data.json:', error);
  }
  
  try {
    if (fs.existsSync(codingPath)) {
      codingData = JSON.parse(fs.readFileSync(codingPath, 'utf8'));
      console.log('Found existing coding-data.json');
    }
  } catch (error) {
    console.warn('Error reading coding-data.json:', error);
  }
  
  try {
    if (fs.existsSync(gamingPath)) {
      gamingData = JSON.parse(fs.readFileSync(gamingPath, 'utf8'));
      console.log('Found existing gaming-data.json');
    }
  } catch (error) {
    console.warn('Error reading gaming-data.json:', error);
  }
  
  return {
    guitarVideos: guitarData,
    codingProjects: codingData,
    gamingVideos: gamingData
  };
}

// Function to parse RSS feed
async function parseRSSFeed(feedUrl) {
  try {
    console.log(`Fetching RSS feed: ${feedUrl}`);
    const response = await fetch(feedUrl);
    const xmlText = await response.text();
    
    // Simple XML parsing
    const items = [];
    
    // Extract items from RSS feed
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      
      // Extract title
      const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
      
      // Extract description
      const descMatch = itemXml.match(/<description>(.*?)<\/description>/);
      const description = descMatch ? descMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
      
      // Extract link
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const link = linkMatch ? linkMatch[1] : '';
      
      // Extract YouTube video ID from link if it's a YouTube URL
      let youtubeVideoId = '';
      if (link.includes('youtube.com/watch?v=')) {
        const videoIdMatch = link.match(/watch\?v=([^&]+)/);
        youtubeVideoId = videoIdMatch ? videoIdMatch[1] : '';
      } else if (link.includes('youtu.be/')) {
        const videoIdMatch = link.match(/youtu\.be\/([^?]+)/);
        youtubeVideoId = videoIdMatch ? videoIdMatch[1] : '';
      }
      
      // Only include items with YouTube video IDs
      if (youtubeVideoId) {
        items.push({
          title,
          description,
          youtubeVideoId
        });
      }
    }
    
    console.log(`Parsed ${items.length} video items from RSS feed`);
    return items;
    
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error);
    return [];
  }
}

// Function to categorize RSS items into guitarItem and gamingItem
function categorizeRSSItems(items) {
  const guitarVideos = [];
  const gamingVideos = [];
  
  items.forEach((item, index) => {
    const baseItem = {
      id: `rss_${index + 1}`,
      title: item.title,
      description: item.description,
      youtubeVideoId: item.youtubeVideoId
    };
    
    // Simple categorization: alternate between guitar and gaming
    // You can modify this logic based on your needs
    if (index % 2 === 0) {
      guitarVideos.push(baseItem);
    } else {
      gamingVideos.push(baseItem);
    }
  });
  
  return { guitarVideos, gamingVideos };
}

// Function to write data to separate JSON files
async function writeDataToFiles() {
  console.log('Starting data generation...');
  
  // Start with existing data from separate JSON files
  const data = readExistingData();
  
  // Fetch and parse RSS feeds
  console.log('Fetching RSS feeds...');
  const allRSSItems = [];
  
  // Fetch from all configured RSS feeds
  for (const [category, feeds] of Object.entries(RSS_FEEDS)) {
    for (const feedUrl of feeds) {
      const items = await parseRSSFeed(feedUrl);
      allRSSItems.push(...items);
    }
  }
  
  // Categorize RSS items
  const categorizedItems = categorizeRSSItems(allRSSItems);
  
  // Merge with existing data (avoid duplicates)
  const existingGuitarIds = new Set(data.guitarVideos.map(v => v.id));
  const existingGamingIds = new Set(data.gamingVideos.map(v => v.id));
  
  // Add new RSS items that don't already exist
  categorizedItems.guitarVideos.forEach(item => {
    if (!existingGuitarIds.has(item.id)) {
      data.guitarVideos.push(item);
      existingGuitarIds.add(item.id);
    }
  });
  
  categorizedItems.gamingVideos.forEach(item => {
    if (!existingGamingIds.has(item.id)) {
      data.gamingVideos.push(item);
      existingGamingIds.add(item.id);
    }
  });
  
  // Optional: Enhance with YouTube API data (if API key is provided)
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (YOUTUBE_API_KEY) {
    console.log('Enhancing data with YouTube API...');
    
    // Enhance guitar videos
    for (const video of data.guitarVideos) {
      if (video.youtubeVideoId) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${video.youtubeVideoId}&key=${YOUTUBE_API_KEY}&part=snippet`
          );
          const apiData = await response.json();
          
          if (apiData.items && apiData.items[0]) {
            const snippet = apiData.items[0].snippet;
            video.title = snippet.title;
            video.description = snippet.description;
          }
        } catch (error) {
          console.error('Error fetching YouTube video details:', error);
        }
      }
    }

    // Enhance gaming videos
    for (const video of data.gamingVideos) {
      if (video.youtubeVideoId) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${video.youtubeVideoId}&key=${YOUTUBE_API_KEY}&part=snippet`
          );
          const apiData = await response.json();
          
          if (apiData.items && apiData.items[0]) {
            const snippet = apiData.items[0].snippet;
            video.title = snippet.title;
            video.description = snippet.description;
          }
        } catch (error) {
          console.error('Error fetching YouTube video details:', error);
        }
      }
    }
  } else {
    console.log('No YouTube API key provided, using data as-is');
  }

  // Write to separate JSON files
  const guitarPath = path.join(process.cwd(), 'src/lib/guitar-data.json');
  const codingPath = path.join(process.cwd(), 'src/lib/coding-data.json');
  const gamingPath = path.join(process.cwd(), 'src/lib/gaming-data.json');
  
  fs.writeFileSync(guitarPath, JSON.stringify(data.guitarVideos, null, 2));
  fs.writeFileSync(codingPath, JSON.stringify(data.codingProjects, null, 2));
  fs.writeFileSync(gamingPath, JSON.stringify(data.gamingVideos, null, 2));
  
  console.log('Data written to separate JSON files:');
  console.log(`- guitar-data.json: ${data.guitarVideos.length} items`);
  console.log(`- coding-data.json: ${data.codingProjects.length} items`);
  console.log(`- gaming-data.json: ${data.gamingVideos.length} items`);
}

async function main() {
  try {
    await writeDataToFiles();
    console.log('Data generation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error generating data:', error);
    process.exit(1);
  }
}

main(); 