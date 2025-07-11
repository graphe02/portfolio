#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Guitar RSS Feed Configuration
const GUITAR_RSS_FEEDS = [
  "https://www.youtube.com/feeds/videos.xml?channel_id=UC9JIdxAV6RUq4f_J8A8nHBw"
];

// Function to read existing guitar data
function readExistingGuitarData() {
  const guitarPath = path.join(process.cwd(), 'src/lib/guitar-data.json');
  
  try {
    if (fs.existsSync(guitarPath)) {
      const guitarData = JSON.parse(fs.readFileSync(guitarPath, 'utf8'));
      console.log(`Found existing guitar-data.json with ${guitarData.length} items`);
      return guitarData;
    }
  } catch (error) {
    console.warn('Error reading guitar-data.json:', error);
  }
  
  console.log('No existing guitar-data.json found, starting with empty data');
  return [];
}

// Function to parse RSS feed
async function parseGuitarRSSFeed(feedUrl) {
  try {
    console.log(`Fetching guitar RSS feed: ${feedUrl}`);
    const response = await fetch(feedUrl);
    const xmlText = await response.text();
    
    const items = [];
    
    // Handle both RSS (<item>) and Atom (<entry>) formats
    let itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    // Try RSS format first
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      const item = parseItemXml(itemXml);
      if (item) items.push(item);
    }
    
    // If no RSS items found, try Atom format
    if (items.length === 0) {
      console.log('No RSS items found, trying Atom format...');
      itemRegex = /<entry>([\s\S]*?)<\/entry>/g;
      
      while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemXml = match[1];
        const item = parseAtomEntry(itemXml);
        if (item) items.push(item);
      }
    }
    
    console.log(`Parsed ${items.length} guitar video items from RSS feed`);
    return items;
    
  } catch (error) {
    console.error(`Error parsing guitar RSS feed ${feedUrl}:`, error);
    return [];
  }
}

// Function to parse RSS item XML
function parseItemXml(itemXml) {
  // Extract title
  const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
  
  // Extract description
  const descMatch = itemXml.match(/<description>(.*?)<\/description>/);
  const description = descMatch ? descMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
  
  // Extract link
  const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
  const link = linkMatch ? linkMatch[1] : '';
  
  // Extract pubDate
  const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
  const pubDate = dateMatch ? dateMatch[1] : '';
  
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
    return {
      title,
      description,
      link,
      pubDate,
      youtubeVideoId
    };
  }
  
  return null;
}

// Function to parse Atom entry XML
function parseAtomEntry(entryXml) {
  // Extract title
  const titleMatch = entryXml.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
  
  // Extract description from YouTube's Atom format
  // YouTube uses media:description inside media:group
  const mediaGroupMatch = entryXml.match(/<media:group>([\s\S]*?)<\/media:group>/);
  let description = '';
  
  if (mediaGroupMatch) {
    const mediaGroup = mediaGroupMatch[1];
    const mediaDescMatch = mediaGroup.match(/<media:description>(.*?)<\/media:description>/);
    if (mediaDescMatch) {
      description = mediaDescMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
  }
  
  // Fallback to other description formats if media:description not found
  if (!description) {
    const contentMatch = entryXml.match(/<content[^>]*>(.*?)<\/content>/);
    const summaryMatch = entryXml.match(/<summary[^>]*>(.*?)<\/summary>/);
    
    if (contentMatch) {
      description = contentMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    } else if (summaryMatch) {
      description = summaryMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
  }
  
  // Extract link
  const linkMatch = entryXml.match(/<link[^>]*href="([^"]*)"[^>]*\/?>/);
  const link = linkMatch ? linkMatch[1] : '';
  
  // Extract published date
  const publishedMatch = entryXml.match(/<published>(.*?)<\/published>/);
  const updatedMatch = entryXml.match(/<updated>(.*?)<\/updated>/);
  const pubDate = publishedMatch ? publishedMatch[1] : (updatedMatch ? updatedMatch[1] : '');
  
  // Extract YouTube video ID from link if it's a YouTube URL
  let youtubeVideoId = '';
  if (link.includes('youtube.com/watch?v=')) {
    const videoIdMatch = link.match(/watch\?v=([^&]+)/);
    youtubeVideoId = videoIdMatch ? videoIdMatch[1] : '';
  } else if (link.includes('youtu.be/')) {
    const videoIdMatch = link.match(/youtu\.be\/([^?]+)/);
    youtubeVideoId = videoIdMatch ? videoIdMatch[1] : '';
  }
  
  // Also try to extract from yt:videoId if present
  if (!youtubeVideoId) {
    const ytVideoIdMatch = entryXml.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    youtubeVideoId = ytVideoIdMatch ? ytVideoIdMatch[1] : '';
  }
  
  // Only include items with YouTube video IDs
  if (youtubeVideoId) {
    return {
      title,
      description,
      link,
      pubDate,
      youtubeVideoId
    };
  }
  
  return null;
}

// Function to enhance with YouTube API data
async function enhanceWithYouTubeAPI(items) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!YOUTUBE_API_KEY) {
    console.log('No YouTube API key provided, skipping API enhancement');
    return items;
  }
  
  console.log('Enhancing guitar data with YouTube API...');
  
  for (const item of items) {
    if (item.youtubeVideoId) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?id=${item.youtubeVideoId}&key=${YOUTUBE_API_KEY}&part=snippet`
        );
        const apiData = await response.json();
        
        if (apiData.items && apiData.items[0]) {
          const snippet = apiData.items[0].snippet;
          item.title = snippet.title;
          item.description = snippet.description;
        }
      } catch (error) {
        console.error('Error fetching YouTube video details:', error);
      }
    }
  }
  
  return items;
}

// Function to convert RSS items to guitarItem format
function convertToGuitarItems(rssItems) {
  return rssItems.map((item, index) => ({
    id: `guitar_${Date.now()}_${index}`,
    title: item.title,
    description: item.description,
    youtubeVideoId: item.youtubeVideoId
  }));
}

// Function to merge with existing data (avoid duplicates)
function mergeGuitarData(existingData, newItems) {
  const existingIds = new Set(existingData.map(item => item.youtubeVideoId));
  const mergedData = [...existingData];
  
  let addedCount = 0;
  newItems.forEach(item => {
    if (!existingIds.has(item.youtubeVideoId)) {
      // Add new items to the beginning of the array (top of the list)
      mergedData.unshift(item);
      existingIds.add(item.youtubeVideoId);
      addedCount++;
    }
  });
  
  console.log(`Added ${addedCount} new guitar videos to the top of the list`);
  return mergedData;
}

// Main function to grab guitar RSS data
async function grabGuitarRSS() {
  console.log('🎸 Starting Guitar RSS Feed Grabber...');
  
  // Read existing guitar data
  const existingGuitarData = readExistingGuitarData();
  
  // Check if any RSS feeds are configured
  if (GUITAR_RSS_FEEDS.length === 0) {
    console.log('⚠️  No guitar RSS feeds configured!');
    console.log('Please add your YouTube channel RSS feeds to the GUITAR_RSS_FEEDS array.');
    console.log('Example: "https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID"');
    return;
  }
  
  // Fetch from all guitar RSS feeds
  console.log('Fetching guitar RSS feeds...');
  const allGuitarItems = [];
  
  for (const feedUrl of GUITAR_RSS_FEEDS) {
    const items = await parseGuitarRSSFeed(feedUrl);
    allGuitarItems.push(...items);
  }
  
  if (allGuitarItems.length === 0) {
    console.log('No guitar videos found in RSS feeds');
    return;
  }
  
  // Enhance with YouTube API if available
  const enhancedItems = await enhanceWithYouTubeAPI(allGuitarItems);
  
  // Convert to guitarItem format
  const guitarItems = convertToGuitarItems(enhancedItems);
  
  // Merge with existing data
  const mergedData = mergeGuitarData(existingGuitarData, guitarItems);
  
  // Write to guitar-data.json
  const guitarPath = path.join(process.cwd(), 'src/lib/guitar-data.json');
  fs.writeFileSync(guitarPath, JSON.stringify(mergedData, null, 2));
  
  console.log(`✅ Guitar RSS grabber completed!`);
  console.log(`📊 Total guitar videos: ${mergedData.length}`);
  console.log(`📁 Data written to: src/lib/guitar-data.json`);
}

async function main() {
  try {
    await grabGuitarRSS();
    console.log('🎸 Guitar RSS grabber finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error in guitar RSS grabber:', error);
    process.exit(1);
  }
}

main(); 