import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

// Look for Railway volume mount first, then local data folder
const dataDir = process.env.DATA_PATH ||
    (fs.existsSync('/app/data') ? '/app/data' : path.join(process.cwd(), 'data'));

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'talentscout.db');
const db: any = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize Database Schema
 */
export function initDB() {
    // Candidates table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS candidates (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT,
            status TEXT DEFAULT 'Applied',
            score INTEGER,
            department TEXT,
            experience TEXT,
            skills TEXT, -- JSON string
            matchReason TEXT,
            resumeUrl TEXT
        )
    `).run();

    // Profile table (Internal User/Candidate Profile)
    db.prepare(`
        CREATE TABLE IF NOT EXISTS profile (
            id TEXT PRIMARY KEY,
            firstName TEXT,
            lastName TEXT,
            email TEXT UNIQUE NOT NULL,
            headline TEXT,
            phone TEXT,
            summary TEXT,
            avatar TEXT,
            resumeUrl TEXT,
            status TEXT,
            skills TEXT, -- JSON string
            experience TEXT, -- JSON string
            totalYearsOfExperience INTEGER
        )
    `).run();

    // Interview Results table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS interview_results (
            candidateId TEXT PRIMARY KEY,
            sessionId TEXT,
            candidateName TEXT,
            candidateEmail TEXT,
            evaluation TEXT, -- JSON string
            answers TEXT, -- JSON string
            totalQuestions INTEGER,
            completedAt TEXT,
            status TEXT,
            hrDecision TEXT -- JSON string
        )
    `).run();

    // Employees table
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

    // Insert Default Candidate if empty
    const count = (db.prepare('SELECT COUNT(*) as count FROM candidates').get() as any).count;
    if (count === 0) {
        const insert = db.prepare(`
            INSERT INTO candidates (id, name, email, role, status, score, department, experience, skills, matchReason, resumeUrl)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        insert.run('c1', 'Sarah Chen', 'sarah.chen@example.com', 'Senior Full Stack Engineer', 'Shortlisted', 94, 'Engineering', '8 years', JSON.stringify(['React', 'Node.js', 'PostgreSQL']), 'Strong background in distributed systems.', '/uploads/sarah_chen_resume.pdf');
    }

    // Insert Default Employees if empty
    const empCount = (db.prepare('SELECT COUNT(*) as count FROM employees').get() as any).count;
    if (empCount === 0) {
        const insert = db.prepare('INSERT INTO employees (id, name, email, department, role, status, joinDate) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insert.run('e1', 'Alice Johnson', 'alice@company.com', 'Engineering', 'Senior Engineer', 'active', '2022-01-15');
        insert.run('e2', 'Bob Smith', 'bob@company.com', 'Product', 'Senior PM', 'active', '2021-06-10');
    }
}

export default db;
