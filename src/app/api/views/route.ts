import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateVisitor, getTotalVisits } from '@/lib/db';
import { randomUUID } from 'crypto';

// Generate a unique visitor ID
function generateVisitorId(): string {
  return randomUUID();
}

// Get visitor ID from cookie or generate new one
function getVisitorId(request: NextRequest): string {
  const visitorId = request.cookies.get('visitor_id')?.value;
  return visitorId || generateVisitorId();
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/views - Starting view tracking...');
    
    const visitorId = getVisitorId(request);
    console.log('Visitor ID:', visitorId);
    
    // Track the visit in database
    const visitor = getOrCreateVisitor(visitorId);
    console.log('Visitor record:', visitor);
    
    // Get total visits
    const totalVisits = getTotalVisits();
    console.log('Total visits:', totalVisits);
    
    // Create response with cookie
    const response = new NextResponse(totalVisits.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
    // Set cookie if it doesn't exist (first visit)
    if (!request.cookies.get('visitor_id')) {
      console.log('Setting new visitor cookie');
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    } else {
      console.log('Visitor cookie already exists');
    }
    
    console.log('POST /api/views - Completed successfully');
    return response;
    
  } catch (error) {
    console.error('Error tracking view:', error);
    return new NextResponse('0', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

export async function GET() {
  try {
    console.log('GET /api/views - Fetching view count...');
    
    const { getTotalVisits } = await import('@/lib/db');
    const totalVisits = getTotalVisits();
    
    console.log('GET /api/views - Total visits:', totalVisits);
    
    return new NextResponse(totalVisits.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return new NextResponse('0', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
} 