import type { FastifyInstance } from 'fastify';
import '@fastify/multipart';
import db from '../db.js';
import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { TalentScoutOrchestrator } from '../core/orchestrator.js';

export async function profileRoutes(fastify: any, options: { orchestrator?: TalentScoutOrchestrator }) {
    const orchestrator = options.orchestrator;

    // Helper to get or create active profile
    const getActiveProfile = () => {
        let profile = db.prepare('SELECT * FROM profile ORDER BY id LIMIT 1').get() as any;
        if (!profile) {
            // Create default profile if empty
            db.prepare(`
                INSERT INTO profile (id, firstName, lastName, email, headline, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run('u1', 'Hariharan', 'S', 'john.doe@example.com', 'Full Stack Developer', 'Active');
            profile = db.prepare('SELECT * FROM profile WHERE id = ?').get('u1');
        }

        // Parse JSON fields
        return {
            ...profile,
            skills: JSON.parse(profile.skills || '{"technical":[],"soft":[],"tools":[]}'),
            experience: JSON.parse(profile.experience || '[]')
        };
    };

    // GET /api/profile
    fastify.get('/', async () => {
        const profile = getActiveProfile();
        const candidate = db.prepare('SELECT status FROM candidates WHERE email = ?').get(profile.email) as any;

        return {
            ...profile,
            status: candidate?.status || profile.status || 'Active'
        };
    });

    // PUT /api/profile
    fastify.put('/', async (request: any) => {
        const data = request.body as any;
        const profile = getActiveProfile();

        const update = db.prepare(`
            UPDATE profile 
            SET firstName = ?, lastName = ?, headline = ?, summary = ?, phone = ?, 
                skills = ?, experience = ?, totalYearsOfExperience = ?
            WHERE id = ?
        `);

        update.run(
            data.firstName || profile.firstName,
            data.lastName || profile.lastName,
            data.headline || profile.headline,
            data.summary || profile.summary,
            data.phone || profile.phone,
            JSON.stringify(data.skills || profile.skills),
            JSON.stringify(data.experience || profile.experience),
            data.totalYearsOfExperience || profile.totalYearsOfExperience,
            profile.id
        );

        return { success: true, profile: getActiveProfile() };
    });

    // POST /api/profile/resume
    fastify.post('/resume', async (request: any, reply: any) => {
        try {
            const data = await request.file();
            if (!data) {
                return reply.status(400).send({ error: 'No file uploaded' });
            }

            const profile = getActiveProfile();
            const uploadDir = path.join(process.cwd(), 'data', 'uploads');
            if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

            const personName = `${profile.firstName}_${profile.lastName}`.replace(/[^a-zA-Z0-9]/g, '_');
            const personDir = path.join(uploadDir, personName);
            if (!existsSync(personDir)) mkdirSync(personDir);

            const filePath = path.join(personDir, data.filename);
            const buffer = await data.toBuffer();
            await fs.writeFile(filePath, buffer);

            const resumeUrl = `/uploads/${personName}/${data.filename}`;
            let analyzedProfile: any = null;

            if (orchestrator) {
                try {
                    const loader = orchestrator.getResumeLoader();
                    const result = await loader.loadResume(filePath);
                    analyzedProfile = await orchestrator.analyzeResume(result.content);
                } catch (err) {
                    console.error('AI Resume Analysis failed:', err);
                }
            }

            // Update DB Profile with AI data
            if (analyzedProfile) {
                const names = (analyzedProfile.name || '').split(' ');
                const fName = names[0] || profile.firstName;
                const lName = names.slice(1).join(' ') || profile.lastName;

                const update = db.prepare(`
                    UPDATE profile 
                    SET firstName = ?, lastName = ?, summary = ?, skills = ?, 
                        experience = ?, totalYearsOfExperience = ?, headline = ?, 
                        resumeUrl = ?, status = ?
                    WHERE id = ?
                `);

                update.run(
                    fName,
                    lName,
                    analyzedProfile.summary || profile.summary,
                    JSON.stringify(analyzedProfile.skills || profile.skills),
                    JSON.stringify(analyzedProfile.experience || profile.experience),
                    analyzedProfile.totalYearsOfExperience || profile.totalYearsOfExperience,
                    analyzedProfile.headline || profile.headline,
                    resumeUrl,
                    'Applied',
                    profile.id
                );
            } else {
                db.prepare('UPDATE profile SET resumeUrl = ? WHERE id = ?').run(resumeUrl, profile.id);
            }

            // Sync with candidates table
            const finalProfile = getActiveProfile();
            const existingCandidate = db.prepare('SELECT id FROM candidates WHERE email = ?').get(finalProfile.email) as any;

            const candidateId = existingCandidate ? existingCandidate.id : 'c' + Date.now();
            const candidateData = {
                id: candidateId,
                name: `${finalProfile.firstName} ${finalProfile.lastName}`,
                role: finalProfile.headline || 'Software Engineer',
                status: 'Applied',
                score: 85,
                department: 'Engineering',
                email: finalProfile.email,
                experience: `${finalProfile.totalYearsOfExperience || 0} years`,
                skills: JSON.stringify(finalProfile.skills?.technical || []),
                matchReason: finalProfile.summary ? (finalProfile.summary.substring(0, 150) + '...') : 'Analyzed from uploaded resume.',
                resumeUrl: resumeUrl
            };

            if (existingCandidate) {
                db.prepare(`
                    UPDATE candidates 
                    SET name = ?, role = ?, status = ?, score = ?, department = ?, experience = ?, skills = ?, matchReason = ?, resumeUrl = ?
                    WHERE id = ?
                `).run(candidateData.name, candidateData.role, candidateData.status, candidateData.score, candidateData.department, candidateData.experience, candidateData.skills, candidateData.matchReason, candidateData.resumeUrl, candidateId);
            } else {
                db.prepare(`
                    INSERT INTO candidates (id, name, email, role, status, score, department, experience, skills, matchReason, resumeUrl)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(candidateData.id, candidateData.name, candidateData.email, candidateData.role, candidateData.status, candidateData.score, candidateData.department, candidateData.experience, candidateData.skills, candidateData.matchReason, candidateData.resumeUrl);
            }

            return {
                success: true,
                url: resumeUrl,
                profile: getActiveProfile(),
                message: 'Resume uploaded and analyzed successfully'
            };
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: 'Internal server error during upload' });
        }
    });
}
