// ============================================
// AGENT 3: MATCHING & SCORING AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type { AgentResponse, CandidateProfile, JobProfile, MatchAnalysis } from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class MatchingScoringAgent {
    private llm: LLMClient;
    private logger: Logger;

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('MatchAgent');
    }

    async analyze(
        candidate: CandidateProfile,
        job: JobProfile
    ): Promise<AgentResponse<MatchAnalysis>> {
        try {
            this.logger.info('Starting candidate-job matching analysis');

            const systemPrompt = `You are an expert talent matching AI for a hiring system.
Your task is to compare candidates against job requirements with transparency.

RULES:
1. Calculate match scores based on evidence, not keywords
2. Identify matched, missing, and extra skills
3. Evaluate experience relevance and duration
4. Highlight strengths and gaps clearly
5. Flag red flags (exaggerations, weak claims, mismatches)
6. Provide actionable recommendations
7. Be fair and objective
8. Prioritize skill depth over breadth

SCORING:
- Overall Score: 0-100 (weighted combination)
- Skill Match: 0-100 (mandatory skills heavily weighted)
- Experience Match: 0-100 (years + relevance)

OUTPUT: Valid JSON matching the MatchAnalysis schema.`;

            const userPrompt = `Compare this candidate against the job requirements:

CANDIDATE:
${JSON.stringify(candidate, null, 2)}

JOB REQUIREMENTS:
${JSON.stringify(job, null, 2)}

Analyze:
1. Overall match score (0-100)
2. Skill match score with matched/missing/extra skills
3. Experience match score (years + relevance)
4. Key strengths
5. Critical gaps
6. Red flags (if any)
7. Recommendation (strong fit / potential fit / weak fit / not a fit)

Return ONLY valid JSON.`;

            const matchAnalysis = await this.llm.generateJSON<MatchAnalysis>({
                systemPrompt,
                userPrompt,
                temperature: 0.3,
                maxTokens: 2500,
            });

            // Ensure fields exist with defaults
            matchAnalysis.skillMatch = matchAnalysis.skillMatch || { score: 0, matched: [], missing: [], extra: [] };
            matchAnalysis.experienceMatch = matchAnalysis.experienceMatch || { score: 0, yearsRequired: 0, yearsCandidate: 0, relevant: false };
            matchAnalysis.strengths = matchAnalysis.strengths || [];
            matchAnalysis.gaps = matchAnalysis.gaps || [];
            matchAnalysis.redFlags = matchAnalysis.redFlags || [];

            this.logger.info('Matching analysis completed', {
                overallScore: matchAnalysis.overallScore,
                recommendation: matchAnalysis.recommendation,
            });

            return {
                success: true,
                data: matchAnalysis,
                reasoning: [
                    `Overall match score: ${matchAnalysis.overallScore}/100`,
                    `Skill match: ${matchAnalysis.skillMatch.score}/100`,
                    `Experience match: ${matchAnalysis.experienceMatch.score}/100`,
                    `${matchAnalysis.strengths.length} strengths identified`,
                    `${matchAnalysis.gaps.length} gaps found`,
                ],
            };
        } catch (error: any) {
            this.logger.error('Matching analysis failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
