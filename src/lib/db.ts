import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'visitors.db');

// Initialize database
function initDB() {
  const db = new Database(DB_PATH);
  
  // Drop existing tables to ensure clean schema
  db.exec('DROP TABLE IF EXISTS visitors');
  db.exec('DROP TABLE IF EXISTS stats');
  
  // Create visitors table
  db.exec(`
    CREATE TABLE visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitor_id TEXT UNIQUE NOT NULL,
      first_visit TEXT NOT NULL,
      last_visit TEXT NOT NULL,
      visit_count INTEGER DEFAULT 1
    )
  `);
  
  // Create stats table for total counts
  db.exec(`
    CREATE TABLE stats (
      key TEXT PRIMARY KEY,
      value INTEGER DEFAULT 0,
      updated_at TEXT NOT NULL
    )
  `);
  
  return db;
}

// Get or create visitor record
export function getOrCreateVisitor(visitorId: string) {
  const db = initDB();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO visitors (visitor_id, first_visit, last_visit, visit_count)
    VALUES (?, ?, ?, COALESCE(
      (SELECT visit_count + 1 FROM visitors WHERE visitor_id = ?), 1
    ))
  `);
  
  const now = new Date().toISOString();
  stmt.run(visitorId, now, now, visitorId);
  
  // Get the visitor record
  const visitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?').get(visitorId);
  
  db.close();
  return visitor;
}

// Get total unique visitors
export function getTotalVisitors() {
  const db = initDB();
  const result = db.prepare('SELECT COUNT(*) as count FROM visitors').get() as { count: number };
  db.close();
  return result.count;
}

// Get total visits (sum of all visit counts)
export function getTotalVisits() {
  const db = initDB();
  const result = db.prepare('SELECT SUM(visit_count) as total FROM visitors').get() as { total: number | null };
  db.close();
  return result.total || 0;
}

// Update stats
export function updateStats() {
  const db = initDB();
  const now = new Date().toISOString();
  
  const totalVisitors = getTotalVisitors();
  const totalVisits = getTotalVisits();
  
  db.prepare(`
    INSERT OR REPLACE INTO stats (key, value, updated_at)
    VALUES (?, ?, ?)
  `).run('total_visitors', totalVisitors, now);
  
  db.prepare(`
    INSERT OR REPLACE INTO stats (key, value, updated_at)
    VALUES (?, ?, ?)
  `).run('total_visits', totalVisits, now);
  
  db.close();
}

// Get stats
export function getStats() {
  const db = initDB();
  const stats = db.prepare('SELECT * FROM stats').all() as Array<{ key: string; value: number; updated_at: string }>;
  db.close();
  
  const result: Record<string, number> = {};
  stats.forEach((stat) => {
    result[stat.key] = stat.value;
  });
  
  return result;
} 