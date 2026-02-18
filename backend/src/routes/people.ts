import type { FastifyInstance } from 'fastify';
import db from '../db.js';

export async function peopleRoutes(fastify: FastifyInstance) {
    fastify.get('/employees', async () => {
        const employees = db.prepare('SELECT * FROM employees').all();
        return {
            status: 200,
            data: employees
        };
    });

    fastify.get('/culture', async () => {
        return {
            status: 200,
            data: [
                { id: '1', metric: 'Engagement', score: 85, trend: 5, benchmark: 78 },
                { id: '2', metric: 'Diversity', score: 72, trend: 2, benchmark: 75 },
                { id: '3', metric: 'Collaboration', score: 91, trend: 8, benchmark: 82 }
            ]
        };
    });

    // ... others can remain mock or be migrated if needed
    fastify.get('/retention', async () => {
        return {
            status: 200,
            data: [
                { employeeId: 'e1', riskLevel: 'low', score: 92, factors: ['Competitive pay', 'High growth'], recommendation: 'Keep doing what you are doing.' },
                { employeeId: 'e2', riskLevel: 'medium', score: 65, factors: ['Long commute', 'Stagnant role'], recommendation: 'Offer remote work or role transition.' }
            ]
        };
    });

    // ...
    fastify.get('/performance', async () => {
        return {
            status: 200,
            data: [
                { employeeId: 'e1', rating: 4.8, goals: 95, feedback: 'Outstanding contribution to the core platform.' },
                { employeeId: 'e2', rating: 4.2, goals: 88, feedback: 'Strong performance, exceeded expectations in Q3.' }
            ]
        };
    });

    fastify.get('/skills', async () => {
        return {
            status: 200,
            data: [
                { category: 'Frontend', topSkills: ['React', 'TypeScript', 'Tailwind'], gap: 15 },
                { category: 'Backend', topSkills: ['Node.js', 'PostgreSQL', 'Redis'], gap: 10 },
                { category: 'AI/ML', topSkills: ['Python', 'PyTorch', 'NLP'], gap: 40 }
            ]
        };
    });
}
