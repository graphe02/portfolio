import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'visitors.db');

function initDB() {
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS visitors (
      visitor_id TEXT PRIMARY KEY
    )
  `);

  return db;
}

export function registerVisitor(visitorId: string) {
  const db = initDB();
  db.prepare('INSERT OR IGNORE INTO visitors (visitor_id) VALUES (?)').run(visitorId);
  db.close();
}

export function getTotalVisitors() {
  const db = initDB();
  const result = db.prepare('SELECT COUNT(*) as count FROM visitors').get() as { count: number };
  db.close();
  return result.count;
}
