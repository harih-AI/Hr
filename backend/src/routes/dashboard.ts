import type { FastifyInstance } from 'fastify';

export async function dashboardRoutes(fastify: FastifyInstance) {
    fastify.get('/kpis', async () => {
        return {
            status: 200,
            data: [
                { id: '1', title: 'Total Applications', value: 1254, trend: { value: 12, label: 'vs last month' }, status: 'success' },
                { id: '2', title: 'Average Match Score', value: '78%', trend: { value: 5, label: 'improving' }, status: 'success' },
                { id: '3', title: 'Candidates in Interview', value: 42, subtitle: 'Across 12 open roles', status: 'neutral' },
                { id: '4', title: 'Time to Hire', value: '18 days', trend: { value: -2, label: 'days faster' }, status: 'success' }
            ]
        };
    });

    fastify.get('/health', async () => {
        return {
            status: 200,
            data: [
                { id: '1', department: 'Engineering', health: 92, headcount: 120, growth: 15 },
                { id: '2', department: 'Product', health: 88, headcount: 45, growth: 10 },
                { id: '3', department: 'Design', health: 85, headcount: 28, growth: 5 },
                { id: '4', department: 'Sales', health: 78, headcount: 85, growth: 22 }
            ]
        };
    });

    fastify.get('/insights', async () => {
        return {
            status: 200,
            data: [
                {
                    id: '1',
                    type: 'recommendation',
                    title: 'Skill Gap Detected',
                    description: 'Increasing demand for Rust in Engineering team, but only 5% of candidates have high proficiency.',
                    timestamp: new Date().toISOString(),
                    priority: 'medium',
                    source: 'Matching Agent',
                    agentId: 'talent-scout'
                },
                {
                    id: '2',
                    type: 'alert',
                    title: 'Bias Warning',
                    description: 'Minor gender bias detected in early screening for Senior Roles. Re-evaluating criteria.',
                    timestamp: new Date().toISOString(),
                    priority: 'high',
                    source: 'Bias Agent',
                    agentId: 'chro-copilot'
                }
            ]
        };
    });

    fastify.get('/charts/:type', async (request: any) => {
        const { type } = request.params;
        return {
            status: 200,
            data: [
                { label: 'Jan', value: 400, growth: 240 },
                { label: 'Feb', value: 300, growth: 139 },
                { label: 'Mar', value: 200, growth: 980 },
                { label: 'Apr', value: 278, growth: 390 },
                { label: 'May', value: 189, growth: 480 },
                { label: 'Jun', value: 239, growth: 380 }
            ]
        };
    });
}
