import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'talentscout.db');
const db = new Database(dbPath);

console.log('Seeding Database...');

// Clear existing if needed? No, just insert if empty.

// Candidates already seeded in initDB()

// Create employees table if not exists (missed this in initDB)
db.prepare(`
    CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        department TEXT,
        role TEXT,
        status TEXT,
        joinDate TEXT
    )
`).run();

const empCount = (db.prepare('SELECT COUNT(*) as count FROM employees').get() as any).count;
if (empCount === 0) {
    const insert = db.prepare('INSERT INTO employees (id, name, email, department, role, status, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insert.run('1', 'Alice Johnson', 'alice@company.com', 'Engineering', 'Senior Engineer', 'active', '2022-01-15');
    insert.run('2', 'Bob Smith', 'bob@company.com', 'Product', 'Senior PM', 'active', '2021-06-10');
    insert.run('3', 'Charlie Davis', 'charlie@company.com', 'Design', 'Staff Designer', 'active', '2023-03-22');
    console.log('Employees seeded.');
}

console.log('Database seeded successfully!');
db.close();
