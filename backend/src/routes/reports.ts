import type { FastifyInstance } from 'fastify';

export async function reportsRoutes(fastify: FastifyInstance) {
    const reports = [
        { id: '1', title: 'Q1 Workforce Resilience Report', type: 'forecast', generatedAt: '2024-01-15', status: 'ready' },
        { id: '2', title: 'Engineering Growth Scenario 2024', type: 'scenario', generatedAt: '2024-02-01', status: 'ready' },
        { id: '3', title: 'Diversity & Inclusion Benchmark', type: 'benchmark', generatedAt: '2023-12-10', status: 'ready' }
    ];

    fastify.get('/', async () => {
        return {
            status: 200,
            data: reports
        };
    });

    fastify.post('/generate', async (request: any) => {
        const body = request.body || {};
        const title = body.title || 'New Report';
        const type = body.type || 'custom';
        const newReport = {
            id: String(reports.length + 1),
            title,
            type,
            generatedAt: new Date().toISOString().split('T')[0] || '',
            status: 'ready'
        };
        reports.push(newReport);
        return {
            status: 200,
            data: newReport
        };
    });

    fastify.get('/forecasts', async () => {
        return {
            status: 200,
            data: [
                { id: 'f1', title: 'Attrition Forecast Q2', accuracy: 94, prediction: '3.2% attrition expected' },
                { id: 'f2', title: 'Hiring Speed Forecast', accuracy: 89, prediction: '14 days average time-to-fill' }
            ]
        };
    });

    fastify.get('/scenarios', async () => {
        return {
            status: 200,
            data: [
                { id: 's1', name: 'Rapid Expansion (2x Headcount)', outcome: 'Budget impact: High, Infrastructure load: Medium' },
                { id: 's2', name: 'Product Pivot (Skill Shift)', outcome: 'Retraining required for 30% of staff' }
            ]
        };
    });
}
