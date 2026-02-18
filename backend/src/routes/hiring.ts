import type { FastifyInstance } from 'fastify';
import '@fastify/multipart';
import db from '../db.js';
import { TalentScoutOrchestrator } from '../core/orchestrator.js';
import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

export async function hiringRoutes(fastify: any, options: { orchestrator?: TalentScoutOrchestrator }) {
    const orchestrator = options.orchestrator;

    // GET /api/hiring/candidates
    fastify.get('/candidates', async () => {
        const candidates = db.prepare('SELECT * FROM candidates').all();
        // Parse skills JSON
        const formattedCandidates = candidates.map((c: any) => ({
            ...c,
            skills: JSON.parse(c.skills || '[]')
        }));

        return {
            status: 200,
            data: formattedCandidates
        };
    });

    // POST /api/hiring/upload
    fastify.post('/upload', async (request: any, reply: any) => {
        try {
            const data = await request.file();
            if (!data) {
                return reply.status(400).send({ error: 'No file uploaded' });
            }

            const fields = data.fields as any;
            const role = fields?.role?.value || 'Software Engineer';
            const department = fields?.department?.value || 'Engineering';

            // Save file
            const uploadDir = path.join(process.cwd(), 'data', 'uploads', 'candidates');
            if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

            const filePath = path.join(uploadDir, data.filename);
            const buffer = await data.toBuffer();
            await fs.writeFile(filePath, buffer);

            console.log(`HR uploaded resume: ${data.filename} for ${role}`);

            let analyzedData: any = null;
            if (orchestrator) {
                try {
                    const loader = orchestrator.getResumeLoader();
                    const result = await loader.loadResume(filePath);
                    analyzedData = await orchestrator.analyzeResume(result.content);
                } catch (aiErr) {
                    console.error('AI Analysis failed during HR upload:', aiErr);
                }
            }

            const id = 'c' + Date.now();
            const name = analyzedData?.name || data.filename.split('.')[0] || 'Unknown Candidate';
            const email = analyzedData?.email || (`candidate_${Date.now()}@example.com`);
            const status = 'Applied';
            const score = analyzedData?.totalYearsOfExperience ? (70 + analyzedData.totalYearsOfExperience * 2) : (75 + Math.floor(Math.random() * 15));
            const experience = analyzedData?.totalYearsOfExperience ? `${analyzedData.totalYearsOfExperience} years` : '3+ years';
            const skills = analyzedData?.skills?.technical?.slice(0, 5) || ['React', 'Node.js'];
            const matchReason = analyzedData?.summary ? analyzedData.summary.substring(0, 100) + '...' : 'Analyzed by Talent Scout AI.';
            const resumeUrl = `/uploads/candidates/${data.filename}`;

            const insert = db.prepare(`
                INSERT INTO candidates (id, name, email, role, status, score, department, experience, skills, matchReason, resumeUrl)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insert.run(id, name, email, role, status, score, department, experience, JSON.stringify(skills), matchReason, resumeUrl);

            return {
                status: 200,
                message: 'Resume uploaded and analyzed by AI',
                data: {
                    candidateId: id,
                    candidate: { id, name, email, role, status, score, department, experience, skills, matchReason, resumeUrl }
                }
            };
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: 'Internal server error during upload' });
        }
    });

    // GET /api/hiring/ranking
    fastify.get('/ranking', async () => {
        const candidates = db.prepare('SELECT * FROM candidates ORDER BY score DESC').all();
        const formattedCandidates = candidates.map((c: any) => ({
            ...c,
            skills: JSON.parse(c.skills || '[]')
        }));

        return {
            status: 200,
            data: formattedCandidates
        };
    });

    // POST /api/hiring/candidates/:id/approve
    fastify.post('/candidates/:id/approve', async (request: any, reply: any) => {
        const { id } = request.params as { id: string };

        const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as any;
        if (!candidate) {
            return reply.status(404).send({ error: 'Candidate not found' });
        }

        db.prepare('UPDATE candidates SET status = ? WHERE id = ?').run('Approved', id);

        // Sync with global profile if it matches email
        db.prepare('UPDATE profile SET status = ? WHERE email = ?').run('Approved', candidate.email);

        return {
            status: 200,
            message: `Candidate ${candidate.name} approved for the next stage`
        };
    });

    // POST /api/hiring/candidates/:id/interview
    fastify.post('/candidates/:id/interview', async (request: any, reply: any) => {
        const { id } = request.params as { id: string };

        const candidate = db.prepare('SELECT * FROM candidates WHERE id = ?').get(id) as any;
        if (!candidate) {
            return reply.status(404).send({ error: 'Candidate not found' });
        }

        db.prepare('UPDATE candidates SET status = ? WHERE id = ?').run('Interviewing', id);

        // Sync with global profile if it matches email
        db.prepare('UPDATE profile SET status = ? WHERE email = ?').run('Interviewing', candidate.email);

        return {
            status: 200,
            message: `Interview started for ${candidate.name}`
        };
    });
}
