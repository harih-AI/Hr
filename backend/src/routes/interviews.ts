import type { FastifyInstance } from 'fastify';

// In-memory storage for interview results
export const interviewResults = new Map<string, any>();

export async function interviewRoutes(fastify: FastifyInstance) {
    // GET /api/interviews - Get all interview results
    fastify.get('/', async () => {
        const results = Array.from(interviewResults.values());
        return {
            status: 200,
            data: results
        };
    });

    // GET /api/interviews/:candidateId - Get interview results for a specific candidate
    fastify.get('/:candidateId', async (request, reply) => {
        const { candidateId } = request.params as { candidateId: string };
        const result = interviewResults.get(candidateId);

        if (!result) {
            return reply.status(404).send({ error: 'Interview results not found' });
        }

        return {
            status: 200,
            data: result
        };
    });

    // POST /api/interviews/save - Save interview results
    fastify.post('/save', async (request, reply) => {
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

        interviewResults.set(candidateId, interviewData);

        return {
            status: 200,
            message: 'Interview results saved successfully',
            data: interviewData
        };
    });

    // GET /api/interviews/stats/summary - Get interview statistics
    fastify.get('/stats/summary', async () => {
        const results = Array.from(interviewResults.values());

        const stats = {
            totalInterviews: results.length,
            averageScore: results.length > 0
                ? Math.round(results.reduce((sum, r) => sum + r.evaluation.overallScore, 0) / results.length)
                : 0,
            passed: results.filter(r => r.status === 'Passed').length,
            needsReview: results.filter(r => r.status === 'Needs Review').length,
            recentInterviews: results
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .slice(0, 5)
        };

        return {
            status: 200,
            data: stats
        };
    });

    // POST /api/interviews/decision - Save HR decision for candidate
    fastify.post('/decision', async (request, reply) => {
        const { candidateId, decision, reasoning } = request.body as any;

        const result = interviewResults.get(candidateId);
        if (!result) {
            return reply.status(404).send({ error: 'Interview results not found' });
        }

        // Update the result with decision
        result.hrDecision = {
            decision, // 'approved' | 'rejected' | 'waitlist'
            reasoning,
            decidedAt: new Date().toISOString()
        };

        interviewResults.set(candidateId, result);

        return {
            status: 200,
            message: 'Decision saved successfully',
            data: result
        };
    });
}
