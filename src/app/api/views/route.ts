import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface PageViewData {
  totalViews: number;
  lastUpdated: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'page-views.json');

async function readPageViewData(): Promise<PageViewData> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return default structure
    return {
      totalViews: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

async function writePageViewData(data: PageViewData): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
  try {
    // Read current data
    const pageViewData = await readPageViewData();
    
    // Increment total views
    pageViewData.totalViews += 1;
    pageViewData.lastUpdated = new Date().toISOString();
    
    // Write updated data back to file
    await writePageViewData(pageViewData);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalViews: pageViewData.totalViews
      }
    });
    
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ success: false, error: 'Failed to track view' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pageViewData = await readPageViewData();
    
    return NextResponse.json({
      stats: {
        totalViews: pageViewData.totalViews
      }
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
} 