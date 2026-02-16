import type { FastifyInstance } from 'fastify';
import '@fastify/multipart';
import { candidates } from '../data.js';

export async function hiringRoutes(fastify: FastifyInstance) {
    // GET /api/hiring/candidates
    fastify.get('/candidates', async () => {
        return {
            status: 200,
            data: candidates
        };
    });

    // POST /api/hiring/upload
    fastify.post('/upload', async (request, reply) => {
        try {
            const data = await request.file();
            if (!data) {
                return reply.status(400).send({ error: 'No file uploaded' });
            }

            const fields = data.fields as any;
            const role = fields?.role?.value || 'Unknown Role';
            const department = fields?.department?.value || 'General';

            console.log(`HR uploaded resume: ${data.filename} for ${role} in ${department}`);

            await data.toBuffer();

            const newCandidate = {
                id: 'c' + (candidates.length + 1),
                name: data.filename.split('.')[0] || 'Unknown Candidate',
                role: role,
                status: 'Applied',
                score: 75 + Math.floor(Math.random() * 20),
                department: department,
                email: 'candidate' + candidates.length + '@example.com',
                experience: 'Unknown',
                skills: ['TBD'],
                matchReason: 'Analyzed by Talent Scout AI.'
            };

            candidates.push(newCandidate);

            return {
                status: 200,
                message: 'Resume uploaded and analyzed successfully',
                data: {
                    candidateId: newCandidate.id,
                    analysis: {
                        score: newCandidate.score,
                        summary: 'Qualified candidate for ' + role,
                        keySkills: newCandidate.skills
                    }
                }
            };
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: 'Internal server error during upload' });
        }
    });

    // GET /api/hiring/ranking
    fastify.get('/ranking', async () => {
        return {
            status: 200,
            data: [...candidates].sort((a, b) => b.score - a.score)
        };
    });

    // POST /api/hiring/candidates/:id/approve
    fastify.post('/candidates/:id/approve', async (request, reply) => {
        const { id } = request.params as { id: string };
        const candidate = candidates.find(c => c.id === id);

        if (!candidate) {
            return reply.status(404).send({ error: 'Candidate not found' });
        }

        candidate.status = 'Approved';

        return {
            status: 200,
            message: `Candidate ${candidate.name} approved for the next stage`
        };
    });

    // POST /api/hiring/candidates/:id/interview
    fastify.post('/candidates/:id/interview', async (request, reply) => {
        const { id } = request.params as { id: string };
        const candidate = candidates.find(c => c.id === id);

        if (!candidate) {
            return reply.status(404).send({ error: 'Candidate not found' });
        }

        candidate.status = 'Interviewing';

        return {
            status: 200,
            message: `Interview started for ${candidate.name}`
        };
    });
}
