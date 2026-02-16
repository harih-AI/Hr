import type { FastifyInstance } from 'fastify';
import '@fastify/multipart';
import { profile, candidates } from '../data.js';
import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { TalentScoutOrchestrator } from '../core/orchestrator.js';

export async function profileRoutes(fastify: FastifyInstance, options: { orchestrator?: TalentScoutOrchestrator }) {
    const orchestrator = options.orchestrator;

    // GET /api/profile
    fastify.get('/', async () => {
        const candidate = candidates.find(c => c.email === profile.email);
        return {
            ...profile,
            status: candidate?.status || 'Active'
        };
    });

    // PUT /api/profile
    fastify.put('/', async (request) => {
        const data = request.body as any;
        Object.assign(profile, data);
        return { success: true, profile };
    });

    // POST /api/profile/resume
    fastify.post('/resume', async (request, reply) => {
        try {
            const data = await request.file();
            if (!data) {
                return reply.status(400).send({ error: 'No file uploaded' });
            }

            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!existsSync(uploadDir)) mkdirSync(uploadDir);

            // Folder based on person
            const fName = profile.firstName || 'Unknown';
            const lName = profile.lastName || 'Candidate';
            const personName = `${fName}_${lName}`.replace(/[^a-zA-Z0-9]/g, '_');
            const personDir = path.join(uploadDir, personName);
            if (!existsSync(personDir)) mkdirSync(personDir);

            const filePath = path.join(personDir, data.filename);
            const buffer = await data.toBuffer();
            await fs.writeFile(filePath, buffer);

            console.log(`Resume saved to: ${filePath}`);

            // Analyze resume content
            if (orchestrator) {
                const orch = orchestrator;
                try {
                    const loader = orch.getResumeLoader();
                    const result = await loader.loadResume(filePath);
                    const resumeText = result.content;

                    const analyzedProfile = await orch.analyzeResume(resumeText);

                    // Update global profile with AI extracted data
                    if (analyzedProfile) {
                        profile.summary = analyzedProfile.summary || profile.summary || '';
                        profile.skills = analyzedProfile.skills || profile.skills;
                        profile.experience = analyzedProfile.experience || profile.experience;
                        profile.totalYearsOfExperience = analyzedProfile.totalYearsOfExperience || profile.totalYearsOfExperience;
                        profile.headline = analyzedProfile.headline || profile.headline || '';

                        if (analyzedProfile.name) {
                            const names = analyzedProfile.name.split(' ');
                            profile.firstName = names[0];
                            if (names.length > 1) profile.lastName = names.slice(1).join(' ');
                        }
                    }
                } catch (err) {
                    console.error('AI Resume Analysis failed, but file was saved:', err);
                }
            }

            // Store the resume URL
            profile.resumeUrl = `/uploads/${personName}/${data.filename}`;

            // Add/Update candidate in the list
            let candidateIdx = candidates.findIndex(c => c.email === profile.email);
            const candidateData = {
                id: candidateIdx !== -1 ? candidates[candidateIdx].id : 'c' + (candidates.length + 1),
                name: `${profile.firstName} ${profile.lastName}`,
                role: profile.headline || 'Software Engineer',
                status: 'Applied',
                score: 85,
                department: 'Engineering',
                email: profile.email,
                experience: `${profile.totalYearsOfExperience} years`,
                skills: (profile as any).skills?.technical || ['N/A'],
                matchReason: 'Analyzed from uploaded resume.',
                resumeUrl: profile.resumeUrl
            };

            if (candidateIdx !== -1) {
                candidates[candidateIdx] = candidateData;
            } else {
                candidates.push(candidateData);
            }

            return {
                success: true,
                url: profile.resumeUrl,
                profile: profile, // Return updated profile to frontend
                message: 'Resume uploaded and analyzed successfully'
            };
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: 'Internal server error during upload' });
        }
    });
}
