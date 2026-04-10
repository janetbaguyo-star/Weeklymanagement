import Database from 'better-sqlite3';
import path from 'path';

// Connect to or create a simple SQLite database file in the project workspace
const dbPath = path.join(process.cwd(), 'reports.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Initial Table Creation
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department TEXT NOT NULL,
    highlights TEXT,
    accomplishments TEXT,
    issues TEXT,
    actionPlans TEXT,
    kpis TEXT,
    status TEXT DEFAULT 'Draft',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
