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
            experience: JSON.parse(profile.experience || '[]'),
            links: JSON.parse(profile.links || '{"linkedin":"","github":"","portfolio":""}')
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
                skills = ?, experience = ?, totalYearsOfExperience = ?, links = ?
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
            JSON.stringify(data.links || profile.links),
            profile.id
        );

        // Sync with candidates table to make it visible in the HR Console
        const finalProfile = getActiveProfile();
        const existingCandidate = db.prepare('SELECT id, score FROM candidates WHERE email = ?').get(finalProfile.email) as any;

        const candidateId = existingCandidate ? existingCandidate.id : 'c' + Date.now();
        const score = existingCandidate?.score || 85; // Use existing AI score or default

        const candidateData = {
            id: candidateId,
            name: `${finalProfile.firstName} ${finalProfile.lastName}`,
            role: finalProfile.headline || 'Software Engineer',
            status: 'Applied',
            score: score,
            department: finalProfile.department || 'Engineering',
            email: finalProfile.email,
            experience: finalProfile.totalYearsOfExperience ? `${finalProfile.totalYearsOfExperience} years` : '0 years',
            skills: JSON.stringify(finalProfile.skills?.technical || []),
            links: JSON.stringify(finalProfile.links),
            matchReason: finalProfile.summary || 'Profile updated by candidate.',
            resumeUrl: finalProfile.resumeUrl
        };

        if (existingCandidate) {
            db.prepare(`
                UPDATE candidates 
                SET name = ?, role = ?, status = ?, score = ?, department = ?, experience = ?, skills = ?, links = ?, matchReason = ?, resumeUrl = ?
                WHERE id = ?
            `).run(candidateData.name, candidateData.role, candidateData.status, candidateData.score, candidateData.department, candidateData.experience, candidateData.skills, candidateData.links, candidateData.matchReason, candidateData.resumeUrl, candidateId);
        } else {
            db.prepare(`
                INSERT INTO candidates (id, name, email, role, status, score, department, experience, skills, links, matchReason, resumeUrl)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(candidateData.id, candidateData.name, candidateData.email, candidateData.role, candidateData.status, candidateData.score, candidateData.department, candidateData.experience, candidateData.skills, candidateData.links, candidateData.matchReason, candidateData.resumeUrl);
        }

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
                        links = ?, resumeUrl = ?, status = ?
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
                    JSON.stringify(analyzedProfile.links || profile.links),
                    resumeUrl,
                    'Applied',
                    profile.id
                );
            } else {
                db.prepare('UPDATE profile SET resumeUrl = ? WHERE id = ?').run(resumeUrl, profile.id);
            }

            // Return the updated profile for the frontend to auto-fill
            return {
                success: true,
                url: resumeUrl,
                profile: getActiveProfile(),
                message: 'Resume uploaded and analyzed successfully. Summary: ' + (analyzedProfile?.summary || 'Extracted basic details.')
            };
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: 'Internal server error during upload' });
        }
    });
}
