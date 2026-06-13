import { NextRequest, NextResponse } from 'next/server';
import { registerVisitor, getTotalVisitors } from '@/lib/db';
import { randomUUID } from 'crypto';

function generateVisitorId(): string {
  return randomUUID();
}

function getVisitorId(request: NextRequest): string {
  return request.cookies.get('visitor_id')?.value || generateVisitorId();
}

export async function POST(request: NextRequest) {
  try {
    const isNewVisitor = !request.cookies.get('visitor_id');
    const visitorId = getVisitorId(request);

    if (isNewVisitor) {
      registerVisitor(visitorId);
    }

    const totalVisitors = getTotalVisitors();

    const response = new NextResponse(totalVisitors.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (isNewVisitor) {
      response.cookies.set('visitor_id', visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Error tracking visitor:', error);
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
    const totalVisitors = getTotalVisitors();

    return new NextResponse(totalVisitors.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return new NextResponse('0', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
