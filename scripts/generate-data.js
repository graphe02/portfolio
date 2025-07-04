#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration: Add new scripts here to include them in data generation
const SCRIPTS_TO_RUN = [
  'scripts/grab-guitar-rss.js'
  // Add new scripts here as needed:
  // 'scripts/grab-blog-rss.js',
  // 'scripts/grab-podcast-rss.js',
];

// Function to read existing data from separate JSON files
function readExistingData() {
  const guitarPath = path.join(process.cwd(), 'src/lib/guitar-data.json');
  const codingPath = path.join(process.cwd(), 'src/lib/coding-data.json');
  
  let guitarData = [];
  let codingData = [];
  
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
  
  return {
    guitarVideos: guitarData,
    codingProjects: codingData
  };
}

// Function to run a script and return a promise
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`Running ${scriptPath}...`);
    
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`${scriptPath} completed successfully`);
        resolve();
      } else {
        console.error(`${scriptPath} failed with code ${code}`);
        reject(new Error(`${scriptPath} failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.error(`Error running ${scriptPath}:`, error);
      reject(error);
    });
  });
}

// Function to write data to separate JSON files
async function writeDataToFiles() {
  console.log('Starting data generation...');
  
  // Start with existing data from separate JSON files
  const data = readExistingData();
  
  // Run RSS grabber
  try {
    await runScript('scripts/grab-guitar-rss.js');
  } catch (error) {
    console.warn('RSS grabber failed, continuing with existing data:', error.message);
  }
  
  // Read the updated data after RSS grabber has run
  const updatedData = readExistingData();
  
  console.log('Data generation completed!');
  console.log(`- guitar-data.json: ${updatedData.guitarVideos.length} items`);
  console.log(`- coding-data.json: ${updatedData.codingProjects.length} items`);
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