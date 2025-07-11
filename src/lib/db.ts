import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'visitors.db');

// Initialize database
function initDB() {
  const db = new Database(DB_PATH);
  
  // Create simplified visitors table - just visitor_id and visit_count
  db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      visitor_id TEXT PRIMARY KEY,
      visit_count INTEGER DEFAULT 1
    )
  `);
  
  return db;
}

// Get or create visitor record
export function getOrCreateVisitor(visitorId: string) {
  const db = initDB();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO visitors (visitor_id, visit_count)
    VALUES (?, COALESCE(
      (SELECT visit_count + 1 FROM visitors WHERE visitor_id = ?), 1
    ))
  `);
  
  stmt.run(visitorId, visitorId);
  
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