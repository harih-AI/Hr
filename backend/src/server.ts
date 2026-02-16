// ============================================
// FASTIFY SERVER - API ENDPOINTS
// ============================================

import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { TalentScoutOrchestrator } from './core/orchestrator.js';
import { Logger } from './utils/logger.js';
import type { CandidateProfile, JobProfile, MatchAnalysis, InterviewAnswer, InterviewPlan } from './core/types.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { agentRoutes } from './routes/agents.js';
import { hiringRoutes } from './routes/hiring.js';
import { profileRoutes } from './routes/profile.js';
import { interviewRoutes } from './routes/interviews.js';
import { defaultInterviewPlan } from './data.js';

const logger = new Logger('Server');
const fastify = Fastify({ logger: false });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register plugins
await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

await fastify.register(multipart, {
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

await fastify.register(staticPlugin, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/', // URL prefix
});

// Initialize orchestrator
const orchestrator = new TalentScoutOrchestrator();

// In-memory session store for demo
interface Session {
    id: string;
    candidateProfile: CandidateProfile;
    jobProfile: JobProfile;
    matchAnalysis: MatchAnalysis;
    plan: InterviewPlan;
    currentQuestion: string | null;
    answers: InterviewAnswer[];
}
const sessions = new Map<string, Session>();

// ============================================
// ROUTES
// ============================================

/**
 * Root route
 */
fastify.get('/', async () => {
    return {
        message: 'Welcome to TalentScout AI Backend',
        status: 'active',
        documentation: '/api'
    };
});

/**
 * Health check
 */
fastify.get('/health', async (request, reply) => {
    try {
        const healthy = await orchestrator.healthCheck();
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            llm: healthy ? 'connected' : 'disconnected',
            provider: 'OpenRouter'
        };
    } catch (error: any) {
        return reply.status(500).send({
            status: 'error',
            message: error.message,
        });
    }
});

/**
 * Base API route
 */
fastify.get('/api', async () => {
    return {
        status: 'ok',
        message: 'TalentScout AI API is active',
        endpoints: [
            '/api/info',
            '/api/evaluate',
            '/api/ai-interview',
            '/api/dashboard',
            '/api/agents',
            '/api/hiring'
        ]
    };
});

// Register specialized routes
await fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });
await fastify.register(agentRoutes, { prefix: '/api/agents' });
await fastify.register(hiringRoutes, { prefix: '/api/hiring' });
await fastify.register(profileRoutes, { prefix: '/api/profile', orchestrator });
await fastify.register(interviewRoutes, { prefix: '/api/interviews' });

/**
 * System info
 */
fastify.get('/api/info', async (request, reply) => {
    return {
        name: 'TalentScout AI',
        version: '1.0.0',
        agents: [
            'Resume Intelligence Agent',
            'Job Description Analysis Agent',
            'Matching & Scoring Agent',
            'Interview Planning Agent',
            'Interview Execution Agent',
            'Technical Evaluation Agent',
            'Bias & Fairness Agent',
            'Hiring Decision Agent',
        ],
    };
});

/**
 * Evaluate candidate (Standard API)
 */
fastify.post('/api/evaluate', async (request, reply) => {
    try {
        const { resume, jobDescription, conductInterview } = request.body as any;
        if (!resume || !jobDescription) {
            return reply.status(400).send({ error: 'Missing required fields' });
        }
        const report = await orchestrator.evaluateCandidate(resume, jobDescription, conductInterview);
        return { success: true, report };
    } catch (error: any) {
        return reply.status(500).send({ success: false, error: error.message });
    }
});

/**
 * Frontend: Start Interview Session
 */
fastify.post('/api/ai-interview/start-session', async (request, reply) => {
    try {
        const body = request.body as any;
        logger.info(`Incoming interview request for Candidate: ${body.candidateId}, Job: ${body.jobId}`);
        const { candidateId, jobId, resumeText, candidateProfile: clientProfile, experienceYears, primarySkills } = body;
        const sessionId = Math.random().toString(36).substring(7);

        const hasDetailedProfile = clientProfile && clientProfile.skills?.technical?.length > 0;
        logger.info(`Session Request: ID=${candidateId}, HasProfile=${!!clientProfile}, Detailed=${hasDetailedProfile}`);
        if (hasDetailedProfile) {
            logger.info(`Profile Name: ${clientProfile.name}, Skills: ${clientProfile.skills.technical.slice(0, 3).join(', ')}`);
        }

        let plan = defaultInterviewPlan;
        let candidateProfile: any = null;
        let jobProfile: any = null;

        try {
            // High-performance path: Use profile if already analyzed by Resume Agent
            const aiPromise = (async () => {
                const jobDescription = `Full Stack Developer position requiring React, Node.js, and technical problem solving. Candidate ID: ${candidateId}.`;

                if (clientProfile && Object.keys(clientProfile).length > 2) {
                    logger.info(`Bypassing expensive analysis - using provided profile for ${candidateId}`);
                    return await orchestrator.getInterviewPlanDirectly(clientProfile, jobDescription);
                } else {
                    logger.info(`Starting personalized interview planning for candidate ${candidateId}...`);
                    return await orchestrator.initializeInterviewPlan(resumeText, jobDescription);
                }
            })();

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('AI matching timed out after 90s')), 90000)
            );

            const result = await Promise.race([aiPromise, timeoutPromise]) as any;

            if (result?.interviewPlan) {
                const aiPlan = result.interviewPlan;
                const questionCount = aiPlan.sections?.reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0) || 0;

                if (questionCount > 0) {
                    plan = aiPlan;
                    logger.info(`Personalized interview plan accepted (${questionCount} questions).`);
                }
            }
            candidateProfile = result?.candidateProfile;
            jobProfile = result?.jobProfile;
        } catch (aiError: any) {
            const isTimeout = aiError.message.includes('timed out');
            if (resumeText && resumeText.length > 50) {
                logger.error(`AI Evaluation failed for personalized interview (Length: ${resumeText.length}): ${aiError.message}`);
                // Only throw if it's NOT a timeout
                if (!isTimeout) {
                    throw new Error(`AI Agent failed: ${aiError.message}`);
                }
            }
            logger.warn(`AI Evaluation skipped/failed (${aiError.message}) - using mission-critical fallback.`);
        }

        const firstQuestion = plan?.sections?.[0]?.questions?.[0] || 'Tell me about yourself.';

        sessions.set(sessionId, {
            id: sessionId,
            candidateProfile: candidateProfile || {
                name: 'Demo Candidate',
                email: 'demo@example.com',
                skills: { technical: [], soft: [], tools: [] },
                experience: [],
                education: [],
                projects: [],
                certifications: [],
                achievements: [],
                totalYearsOfExperience: 0,
                weakClaims: [],
                exaggerations: []
            } as CandidateProfile,
            jobProfile: jobProfile || {
                title: 'Demo Job',
                description: '',
                mandatorySkills: [],
                optionalSkills: [],
                experienceRequired: { min: 0, max: 10 },
                responsibilities: [],
                qualifications: [],
                criticalCompetencies: []
            } as JobProfile,
            matchAnalysis: {
                overallScore: 85,
                skillMatch: { score: 85, matched: [], missing: [], extra: [] },
                experienceMatch: { score: 80, yearsRequired: 3, yearsCandidate: 3, relevant: true },
                strengths: [],
                gaps: [],
                redFlags: [],
                recommendation: 'Consider'
            } as MatchAnalysis,
            plan: plan as InterviewPlan,
            currentQuestion: firstQuestion || null,
            answers: []
        });

        // Map to frontend's expected InterviewSession structure
        const sections = plan?.sections || [];
        const sessionResponse = {
            sessionId,
            candidateId,
            jobId,
            questions: sections.flatMap(s => (s.questions || []).map(q => ({
                id: Math.random().toString(36).substring(7),
                question: q,
                category: s.topic || 'General',
                difficulty: 'medium',
                expectedDuration: 5
            }))),
            totalQuestions: sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0),
            estimatedDuration: plan?.estimatedDuration || 15,
            interviewType: 'technical'
        };

        logger.info(`Session initialized with ${sessionResponse.totalQuestions} questions.`);
        if (sessionResponse.questions.length > 0) {
            logger.info(`First Question: "${sessionResponse.questions[0].question}"`);
        }
        return sessionResponse;
    } catch (error: any) {
        logger.error('Failed to start interview', error);
        return reply.status(500).send({ error: error.message });
    }
});

/**
 * Frontend: Submit Answer
 */
fastify.post('/api/ai-interview/submit-answer', async (request, reply) => {
    try {
        const { sessionId, questionId, answer } = request.body as any;
        const session = sessions.get(sessionId);
        if (!session) return reply.status(404).send({ error: 'Session not found' });

        // Save the answer to session history
        if (session.currentQuestion && answer) {
            session.answers.push({
                question: session.currentQuestion,
                answer: answer,
                timestamp: new Date()
            });
        }

        const nextQuestion = await orchestrator.getNextQuestion(session.plan, session.currentQuestion || undefined, answer, session.answers, session.candidateProfile);
        session.currentQuestion = nextQuestion || null;

        return {
            success: true,
            nextQuestion: nextQuestion,
            isComplete: nextQuestion === null
        };
    } catch (error: any) {
        return reply.status(500).send({ error: error.message });
    }
});

/**
 * Frontend: Get Evaluation
 */
fastify.get('/api/ai-interview/evaluate/:sessionId', async (request, reply) => {
    try {
        const { sessionId } = request.params as any;
        const session = sessions.get(sessionId);
        if (!session) return reply.status(404).send({ error: 'Session not found' });

        const evaluation = await orchestrator.evaluateInterview(session.jobProfile, session.answers);

        const evaluationResponse = {
            sessionId,
            overallScore: evaluation.overallScore,
            technicalScore: evaluation.overallScore,
            communicationScore: 85,
            confidenceScore: 90,
            strengths: evaluation.strengths,
            improvements: evaluation.weaknesses,
            recommendation: evaluation.overallScore > 70 ? 'Recommended' : 'Needs Review',
            detailedFeedback: evaluation.answerEvaluations.map(e => e.reasoning).join('\n')
        };

        // Save to interview results for HR dashboard
        const { interviewResults } = await import('./routes/interviews.js');
        interviewResults.set(session.candidateProfile?.id || session.candidateProfile?.email || sessionId, {
            candidateId: session.candidateProfile?.id || session.candidateProfile?.email || sessionId,
            sessionId,
            candidateName: session.candidateProfile?.name || 'Unknown Candidate',
            candidateEmail: session.candidateProfile?.email || 'N/A',
            evaluation: evaluationResponse,
            answers: session.answers,
            totalQuestions: session.answers.length,
            completedAt: new Date().toISOString(),
            status: evaluation.overallScore >= 70 ? 'Passed' : 'Needs Review'
        });

        logger.info(`Interview results saved for ${session.candidateProfile?.name || 'candidate'}`);

        return evaluationResponse;
    } catch (error: any) {
        return reply.status(500).send({ error: error.message });
    }
});

// ============================================
// START SERVER
// ============================================

const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3000');
        const host = process.env.HOST || 'localhost';

        await fastify.listen({ port, host });

        logger.info(`🚀 TalentScout AI Server running on http://${host}:${port}`);
        logger.info(`🌐 Proxying API for Frontend at http://localhost:8080`);

        const llmHealthy = await orchestrator.healthCheck();
        if (llmHealthy) {
            logger.info('✅ Generative AI (OpenRouter) connected successfully');
        } else {
            logger.warn('⚠️  Generative AI not connected - check API key/OpenRouter status');
        }
    } catch (error) {
        logger.error('Failed to start server', error);
        process.exit(1);
    }
};

start();
