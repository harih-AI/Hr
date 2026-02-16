// ============================================
// ORCHESTRATOR - MULTI-AGENT COORDINATOR
// ============================================

import { LLMClient } from '../llm/client.js';
import { ResumeIntelligenceAgent } from '../agents/resume.agent.js';
import { JobDescriptionAgent } from '../agents/jd.agent.js';
import { MatchingScoringAgent } from '../agents/match.agent.js';
import { InterviewPlanningAgent } from '../agents/interview-plan.agent.js';
import { InterviewExecutionAgent } from '../agents/interview-exec.agent.js';
import { TechnicalEvaluationAgent } from '../agents/technical-eval.agent.js';
import { BiasFairnessAgent } from '../agents/bias.agent.js';
import { HiringDecisionAgent } from '../agents/decision.agent.js';
import { ResumeLoader } from '../loaders/resumeLoader.js';
import type {
    EvaluationReport,
    InterviewAnswer,
    CandidateProfile,
    JobProfile,
    MatchAnalysis,
    InterviewPlan,
    TechnicalEvaluation,
    BiasCheck,
    FinalDecision,
} from './types.js';
import { Logger } from '../utils/logger.js';

export class TalentScoutOrchestrator {
    private llm: LLMClient;
    private resumeLoader: ResumeLoader;
    private logger: Logger;

    // Agents
    private resumeAgent: ResumeIntelligenceAgent;
    private jdAgent: JobDescriptionAgent;
    private matchAgent: MatchingScoringAgent;
    private interviewPlanAgent: InterviewPlanningAgent;
    private interviewExecAgent: InterviewExecutionAgent;
    private techEvalAgent: TechnicalEvaluationAgent;
    private biasAgent: BiasFairnessAgent;
    private decisionAgent: HiringDecisionAgent;

    constructor(
        baseUrl: string = 'https://openrouter.ai/api/v1',
        model: string = 'google/gemini-2.0-flash-001'
    ) {
        this.llm = new LLMClient(baseUrl, model);
        this.resumeLoader = new ResumeLoader();
        this.logger = new Logger('Orchestrator');

        // Initialize all agents
        this.resumeAgent = new ResumeIntelligenceAgent(this.llm);
        this.jdAgent = new JobDescriptionAgent(this.llm);
        this.matchAgent = new MatchingScoringAgent(this.llm);
        this.interviewPlanAgent = new InterviewPlanningAgent(this.llm);
        this.interviewExecAgent = new InterviewExecutionAgent(this.llm);
        this.techEvalAgent = new TechnicalEvaluationAgent(this.llm);
        this.biasAgent = new BiasFairnessAgent(this.llm);
        this.decisionAgent = new HiringDecisionAgent(this.llm);
    }

    /**
     * MAIN WORKFLOW: Complete candidate evaluation
     */
    public getResumeLoader(): ResumeLoader {
        return this.resumeLoader;
    }

    async analyzeResume(text: string): Promise<CandidateProfile> {
        const result = await this.resumeAgent.analyze(text);
        if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to analyze resume');
        }
        return result.data;
    }

    async getInterviewPlanDirectly(
        candidateProfile: CandidateProfile,
        jobDescription: string
    ): Promise<{ candidateProfile: CandidateProfile, jobProfile: JobProfile, matchAnalysis: MatchAnalysis, interviewPlan: InterviewPlan }> {
        this.logger.info(`=== Express Interview Plan for ${candidateProfile.name} ===`);

        // Analyze JD (Still needed if not cached)
        const jdResult = await this.jdAgent.analyze(jobDescription);
        if (!jdResult.success || !jdResult.data) throw new Error(`Job analysis failed: ${jdResult.error}`);
        const jobProfile = jdResult.data;

        // Match
        const matchResult = await this.matchAgent.analyze(candidateProfile, jobProfile);
        if (!matchResult.success || !matchResult.data) throw new Error(`Matching failed: ${matchResult.error}`);
        const matchAnalysis = matchResult.data;

        // Plan
        const planResult = await this.interviewPlanAgent.createPlan(candidateProfile, jobProfile, matchAnalysis);
        if (!planResult.success || !planResult.data) throw new Error(`Planning failed: ${planResult.error}`);

        return {
            candidateProfile,
            jobProfile,
            matchAnalysis,
            interviewPlan: planResult.data
        };
    }

    async initializeInterviewPlan(
        resumeText: string,
        jobDescription: string
    ): Promise<{ candidateProfile: CandidateProfile, jobProfile: JobProfile, matchAnalysis: MatchAnalysis, interviewPlan: InterviewPlan }> {
        this.logger.info('=== Initializing Fast Interview Plan ===');

        // Analyze Resume & JD
        const [resumeResult, jdResult] = await Promise.all([
            this.resumeAgent.analyze(resumeText),
            this.jdAgent.analyze(jobDescription)
        ]);

        if (!resumeResult.success || !resumeResult.data) throw new Error(`Resume analysis failed: ${resumeResult.error}`);
        if (!jdResult.success || !jdResult.data) throw new Error(`Job analysis failed: ${jdResult.error}`);

        const candidateProfile = resumeResult.data;
        const jobProfile = jdResult.data;

        // Match
        const matchResult = await this.matchAgent.analyze(candidateProfile, jobProfile);
        if (!matchResult.success || !matchResult.data) throw new Error(`Matching failed: ${matchResult.error}`);
        const matchAnalysis = matchResult.data;

        // Plan
        const planResult = await this.interviewPlanAgent.createPlan(candidateProfile, jobProfile, matchAnalysis);
        if (!planResult.success || !planResult.data) throw new Error(`Planning failed: ${planResult.error}`);

        return {
            candidateProfile,
            jobProfile,
            matchAnalysis,
            interviewPlan: planResult.data
        };
    }

    async evaluateCandidate(
        resumeInput: string, // File path or raw text
        jobDescription: string,
        conductInterview: boolean = false
    ): Promise<EvaluationReport> {
        try {
            this.logger.info('=== Starting TalentScout AI Evaluation ===');

            // Step 1: Load Resume
            this.logger.info('Step 1: Loading resume...');
            let resumeText: string;
            if (resumeInput.includes('\n') || resumeInput.length > 500) {
                // Raw text
                const result = await this.resumeLoader.loadFromText(resumeInput);
                resumeText = result.content;
            } else {
                // File path
                const result = await this.resumeLoader.loadResume(resumeInput);
                resumeText = result.content;
            }

            // Parallel Step 1: Analyze Resume and JD
            this.logger.info('Step 2 & 3: Analyzing resume and job description...');
            const [resumeResult, jdResult] = await Promise.all([
                this.resumeAgent.analyze(resumeText),
                this.jdAgent.analyze(jobDescription)
            ]);

            if (!resumeResult.success || !resumeResult.data) {
                throw new Error(`Resume analysis failed: ${resumeResult.error}`);
            }
            if (!jdResult.success || !jdResult.data) {
                throw new Error(`Job analysis failed: ${jdResult.error}`);
            }
            const candidateProfile: CandidateProfile = resumeResult.data;
            const jobProfile: JobProfile = jdResult.data;
            this.logger.info(`Step 2.1: Resume analyzed for ${candidateProfile.name}`);
            this.logger.info(`Step 2.2: Job description analyzed`);

            // Step 4: Match Candidate to Job
            this.logger.info('Step 4: Matching candidate to job...');
            const matchResult = await this.matchAgent.analyze(
                candidateProfile,
                jobProfile
            );
            if (!matchResult.success || !matchResult.data) {
                throw new Error(`Matching failed: ${matchResult.error}`);
            }
            const matchAnalysis: MatchAnalysis = matchResult.data;
            this.logger.info(`Step 4: Matching complete. Score: ${matchAnalysis.overallScore}`);

            // Parallel Step 2: Interview Plan and Bias Check
            this.logger.info('Step 5 & 8: Planning interview and checking bias...');
            let interviewPlan: InterviewPlan | undefined = undefined;
            let technicalEvaluation: TechnicalEvaluation | undefined = undefined;

            const results = await Promise.all([
                conductInterview ? this.interviewPlanAgent.createPlan(candidateProfile, jobProfile, matchAnalysis) : Promise.resolve(null),
                this.biasAgent.checkBias(candidateProfile, matchAnalysis)
            ]);

            const planResult = results[0];
            const biasResult = results[1];

            if (conductInterview && planResult) {
                if (!planResult.success || !planResult.data) {
                    throw new Error(`Interview planning failed: ${planResult.error}`);
                }
                interviewPlan = planResult.data;
                this.logger.info(`Step 5: Interview plan created with ${interviewPlan.sections?.length || 0} sections`);
            }

            if (!biasResult.success || !biasResult.data) {
                throw new Error(`Bias check failed: ${biasResult.error}`);
            }
            const biasCheck: BiasCheck = biasResult.data;

            // Step 9: Final Decision
            this.logger.info('Step 9: Making final hiring decision...');
            const decisionResult = await this.decisionAgent.makeDecision(
                candidateProfile,
                jobProfile,
                matchAnalysis,
                biasCheck,
                technicalEvaluation
            );
            if (!decisionResult.success || !decisionResult.data) {
                throw new Error(`Decision making failed: ${decisionResult.error}`);
            }
            const finalDecision: FinalDecision = decisionResult.data;

            // Build Evaluation Report
            const report: EvaluationReport = {
                candidateProfile,
                jobProfile,
                matchScore: matchAnalysis.overallScore,
                interviewScore: 0,
                biasCheck,
                riskLevel: finalDecision.riskLevel,
                finalRecommendation: finalDecision.recommendation,
                confidence: finalDecision.confidence,
                explanation: finalDecision.reasoning,
                timestamp: new Date(),
                detailedAnalysis: {
                    matchAnalysis,
                    finalDecision,
                    interviewPlan: interviewPlan || undefined,
                    technicalEvaluation: undefined
                } as any
            };

            this.logger.info('=== Evaluation Complete ===');
            this.logger.info(`Recommendation: ${report.finalRecommendation}`);
            this.logger.info(`Confidence: ${report.confidence}%`);

            return report;
        } catch (error: any) {
            this.logger.error('Evaluation failed', error);
            throw error;
        }
    }

    /**
     * INTERACTIVE INTERVIEW MODE
     */
    async startInteractiveInterview(
        candidateProfile: CandidateProfile,
        jobProfile: JobProfile,
        matchAnalysis: MatchAnalysis
    ): Promise<InterviewPlan> {
        this.logger.info('Starting interactive interview mode');

        const planResult = await this.interviewPlanAgent.createPlan(
            candidateProfile,
            jobProfile,
            matchAnalysis
        );

        if (!planResult.success || !planResult.data) {
            throw new Error(`Interview planning failed: ${planResult.error}`);
        }

        return planResult.data;
    }

    async getNextQuestion(
        plan: InterviewPlan,
        currentQuestion?: string,
        answer?: string,
        history: InterviewAnswer[] = [],
        candidate?: CandidateProfile
    ): Promise<string | null> {
        if (!currentQuestion) {
            // Start interview
            const result = await this.interviewExecAgent.startInterview(plan);
            return result.data || null;
        } else {
            // Process answer and get next question
            const result = await this.interviewExecAgent.processAnswer(
                plan,
                currentQuestion,
                answer || '',
                history,
                candidate
            );
            return result.data || null;
        }
    }

    async evaluateInterview(
        jobProfile: JobProfile,
        history: InterviewAnswer[] = []
    ): Promise<TechnicalEvaluation> {
        // Use provided history if available, otherwise fallback to agent's internal state
        const answers = history.length > 0 ? history : this.interviewExecAgent.getInterviewAnswers();
        const result = await this.techEvalAgent.evaluate(answers, jobProfile);

        if (!result.success || !result.data) {
            throw new Error(`Interview evaluation failed: ${result.error}`);
        }

        return result.data;
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<boolean> {
        return await this.llm.healthCheck();
    }
}
