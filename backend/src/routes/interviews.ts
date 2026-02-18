import type { FastifyInstance } from 'fastify';
import db from '../db.js';

export async function interviewRoutes(fastify: FastifyInstance) {
    // GET /api/interviews - Get all interview results
    fastify.get('/', async () => {
        const results = db.prepare('SELECT * FROM interview_results').all();
        const formattedResults = results.map((r: any) => ({
            ...r,
            evaluation: JSON.parse(r.evaluation || '{}'),
            answers: JSON.parse(r.answers || '[]'),
            hrDecision: JSON.parse(r.hrDecision || 'null')
        }));

        return {
            status: 200,
            data: formattedResults
        };
    });

    // GET /api/interviews/:candidateId - Get interview results for a specific candidate
    fastify.get('/:candidateId', async (request, reply) => {
        const { candidateId } = request.params as { candidateId: string };
        const result = db.prepare('SELECT * FROM interview_results WHERE candidateId = ?').get(candidateId) as any;

        if (!result) {
            return reply.status(404).send({ error: 'Interview results not found' });
        }

        return {
            status: 200,
            data: {
                ...result,
                evaluation: JSON.parse(result.evaluation || '{}'),
                answers: JSON.parse(result.answers || '[]'),
                hrDecision: JSON.parse(result.hrDecision || 'null')
            }
        };
    });

    // POST /api/interviews/save - Save interview results
    fastify.post('/save', async (request: any, reply: any) => {
        const { candidateId, sessionId, evaluation, answers, profile } = request.body as any;

        const interviewData = {
            candidateId,
            sessionId,
            candidateName: profile?.name || profile?.firstName + ' ' + profile?.lastName || 'Unknown',
            candidateEmail: profile?.email || 'N/A',
            evaluation: {
                overallScore: evaluation.overallScore,
                technicalScore: evaluation.technicalScore || evaluation.overallScore,
                communicationScore: evaluation.communicationScore || 85,
                confidenceScore: evaluation.confidenceScore || 90,
                strengths: evaluation.strengths || [],
                improvements: evaluation.improvements || evaluation.weaknesses || [],
                recommendation: evaluation.recommendation,
                detailedFeedback: evaluation.detailedFeedback
            },
            answers: answers || [],
            totalQuestions: answers?.length || 0,
            completedAt: new Date().toISOString(),
            status: evaluation.overallScore >= 70 ? 'Passed' : 'Needs Review'
        };

        const existing = db.prepare('SELECT candidateId FROM interview_results WHERE candidateId = ?').get(candidateId);

        if (existing) {
            const update = db.prepare(`
                UPDATE interview_results 
                SET sessionId = ?, candidateName = ?, candidateEmail = ?, evaluation = ?, 
                    answers = ?, totalQuestions = ?, completedAt = ?, status = ?
                WHERE candidateId = ?
            `);
            update.run(
                interviewData.sessionId, interviewData.candidateName, interviewData.candidateEmail,
                JSON.stringify(interviewData.evaluation), JSON.stringify(interviewData.answers),
                interviewData.totalQuestions, interviewData.completedAt, interviewData.status,
                candidateId
            );
        } else {
            const insert = db.prepare(`
                INSERT INTO interview_results (candidateId, sessionId, candidateName, candidateEmail, evaluation, answers, totalQuestions, completedAt, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            insert.run(
                candidateId, interviewData.sessionId, interviewData.candidateName, interviewData.candidateEmail,
                JSON.stringify(interviewData.evaluation), JSON.stringify(interviewData.answers),
                interviewData.totalQuestions, interviewData.completedAt, interviewData.status
            );
        }

        return {
            status: 200,
            message: 'Interview results saved successfully',
            data: interviewData
        };
    });

    // GET /api/interviews/stats/summary - Get interview statistics
    fastify.get('/stats/summary', async () => {
        const results = db.prepare('SELECT * FROM interview_results').all();
        const formattedResults = results.map((r: any) => ({
            ...r,
            evaluation: JSON.parse(r.evaluation || '{}')
        }));

        const stats = {
            totalInterviews: formattedResults.length,
            averageScore: formattedResults.length > 0
                ? Math.round(formattedResults.reduce((sum: number, r: any) => sum + r.evaluation.overallScore, 0) / formattedResults.length)
                : 0,
            passed: formattedResults.filter((r: any) => r.status === 'Passed').length,
            needsReview: formattedResults.filter((r: any) => r.status === 'Needs Review').length,
            recentInterviews: formattedResults
                .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 5)
        };

        return {
            status: 200,
            data: stats
        };
    });

    // POST /api/interviews/decision - Save HR decision for candidate
    fastify.post('/decision', async (request: any, reply: any) => {
        const { candidateId, decision, reasoning } = request.body as any;

        const result = db.prepare('SELECT * FROM interview_results WHERE candidateId = ?').get(candidateId) as any;
        if (!result) {
            return reply.status(404).send({ error: 'Interview results not found' });
        }

        const hrDecision = {
            decision, // 'approved' | 'rejected' | 'waitlist'
            reasoning,
            decidedAt: new Date().toISOString()
        };

        db.prepare('UPDATE interview_results SET hrDecision = ? WHERE candidateId = ?').run(JSON.stringify(hrDecision), candidateId);

        return {
            status: 200,
            message: 'Decision saved successfully',
            data: { ...result, hrDecision }
        };
    });
}
