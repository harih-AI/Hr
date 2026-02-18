import type { FastifyInstance } from 'fastify';
import db from '../db.js';

export async function dashboardRoutes(fastify: FastifyInstance) {
    fastify.get('/kpis', async () => {
        const totalCandidates = (db.prepare('SELECT COUNT(*) as count FROM candidates').get() as any).count;
        const interviewingCount = (db.prepare("SELECT COUNT(*) as count FROM candidates WHERE status = 'Interviewing'").get() as any).count;
        const avgScore = (db.prepare('SELECT AVG(score) as avg FROM candidates').get() as any).avg || 0;

        return {
            status: 200,
            data: [
                { id: '1', title: 'Total Applications', value: totalCandidates, trend: { value: 12, label: 'vs last month' }, status: 'success' },
                { id: '2', title: 'Average Match Score', value: `${Math.round(avgScore)}%`, trend: { value: 5, label: 'improving' }, status: 'success' },
                { id: '3', title: 'Candidates in Interview', value: interviewingCount, subtitle: 'Live Pipeline', status: 'neutral' },
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
        if (type === 'hiring') {
            return {
                status: 200,
                data: [
                    { label: 'Jan', applications: 400, hires: 24 },
                    { label: 'Feb', applications: 300, hires: 13 },
                    { label: 'Mar', applications: 500, hires: 98 },
                    { label: 'Apr', applications: 278, hires: 39 },
                    { label: 'May', applications: 189, hires: 48 },
                    { label: 'Jun', applications: 239, hires: 38 }
                ]
            };
        }
        if (type === 'attrition') {
            return {
                status: 200,
                data: [
                    { label: 'Jan', rate: 1.2 },
                    { label: 'Feb', rate: 1.5 },
                    { label: 'Mar', rate: 1.1 },
                    { label: 'Apr', rate: 2.1 },
                    { label: 'May', rate: 1.8 },
                    { label: 'Jun', rate: 1.4 }
                ]
            };
        }
        return {
            status: 200,
            data: []
        };
    });
}
