import type { FastifyInstance } from 'fastify';

export async function agentRoutes(fastify: FastifyInstance) {
    const agents = [
        {
            id: 'talent-scout',
            name: 'Resume Intelligence',
            description: 'Analyzes resumes, extracts skills, and scores candidates.',
            status: 'active',
            confidence: 98,
            accuracy: 94,
            actionsToday: 156,
            totalProcessed: 12450,
            lastAction: 'Candidate evaluation completed',
            lastActionTimestamp: new Date().toISOString(),
            capabilities: ['NLP', 'Skill Extraction', 'Experience Mapping']
        },
        {
            id: 'chro-copilot',
            name: 'Strategy Copilot',
            description: 'Executive hiring decisions and bias monitoring.',
            status: 'idle',
            confidence: 95,
            accuracy: 91,
            actionsToday: 12,
            totalProcessed: 890,
            lastAction: 'Bias report generated',
            lastActionTimestamp: new Date().toISOString(),
            capabilities: ['Ethics Check', 'Executive Search', 'Conflict of Interest']
        }
    ];

    fastify.get('/', async () => {
        return { status: 200, data: agents };
    });

    fastify.get('/:id', async (request: any) => {
        const agent = agents.find(a => a.id === request.params.id);
        return { status: 200, data: agent };
    });

    fastify.get('/:id/logs', async (request: any) => {
        return {
            status: 200,
            data: [
                {
                    id: '1',
                    agentId: request.params.id,
                    action: 'Screening',
                    result: 'Pass',
                    confidence: 0.92,
                    timestamp: new Date().toISOString(),
                    source: 'Backend API',
                    explanation: 'Candidate meets 9/10 mandatory requirements.',
                    approvalStatus: 'auto-approved'
                }
            ]
        };
    });
}
