import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage (in production, use a database)
// This is just for demonstration - you'll want to replace with Vercel KV, etc.
let dailyStats: Record<string, { unique: number; ips: Set<string> }> = {};

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Initialize today's stats if not exists
    if (!dailyStats[today]) {
      dailyStats[today] = {
        unique: 0,
        ips: new Set()
      };
    }
    
    const todayStats = dailyStats[today];
    const isNewVisitor = !todayStats.ips.has(ip);
    
    // Update stats - only track unique visitors
    if (isNewVisitor) {
      todayStats.unique += 1;
      todayStats.ips.add(ip);
    }
    
    // Clean up old data (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    Object.keys(dailyStats).forEach(date => {
      if (date < cutoffDate) {
        delete dailyStats[date];
      }
    });
    
    // Calculate totals
    const totalUnique = Object.values(dailyStats).reduce((sum, day) => sum + day.unique, 0);
    const weeklyUnique = Object.entries(dailyStats)
      .filter(([date]) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo.toISOString().split('T')[0];
      })
      .reduce((sum, [, day]) => sum + day.unique, 0);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalUnique,
        weekly: weeklyUnique,
        todayUnique: todayStats.unique
      }
    });
    
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ success: false, error: 'Failed to track view' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Calculate totals
    const totalUnique = Object.values(dailyStats).reduce((sum, day) => sum + day.unique, 0);
    const weeklyUnique = Object.entries(dailyStats)
      .filter(([date]) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo.toISOString().split('T')[0];
      })
      .reduce((sum, [, day]) => sum + day.unique, 0);
    
    return NextResponse.json({
      stats: {
        totalUnique,
        weekly: weeklyUnique
      }
    });
    
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
} 