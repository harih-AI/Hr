// ============================================
// AGENT 8: HIRING DECISION AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type {
    AgentResponse,
    CandidateProfile,
    JobProfile,
    MatchAnalysis,
    TechnicalEvaluation,
    BiasCheck,
    FinalDecision,
} from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class HiringDecisionAgent {
    private llm: LLMClient;
    private logger: Logger;

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('DecisionAgent');
    }

    async makeDecision(
        candidate: CandidateProfile,
        job: JobProfile,
        matchAnalysis: MatchAnalysis,
        biasCheck: BiasCheck,
        technicalEval?: TechnicalEvaluation
    ): Promise<AgentResponse<FinalDecision>> {
        try {
            this.logger.info('Making final hiring decision');

            const systemPrompt = `You are the final decision-making AI for a hiring system.
Your task is to synthesize all evaluations and make a fair, explainable hiring recommendation.

DECISION OPTIONS:
1. HIRE - Strong fit, high confidence
2. CONSIDER - Potential fit, needs further review
3. REJECT - Not a fit, clear gaps

RULES:
1. Combine all scores and analyses
2. Weigh critical factors appropriately
3. Ensure bias check passed (fail = automatic flag)
4. Calculate confidence level (0-100)
5. Assess risk level (low/medium/high)
6. Provide clear, evidence-based reasoning
7. List positive and negative factors
8. Suggest next steps if applicable

WEIGHTING:
- Match score: 40%
- Technical evaluation: 30%
- Experience relevance: 20%
- Bias check: 10% (must pass)

CONFIDENCE:
- 80-100: Very confident
- 60-79: Moderately confident
- 40-59: Low confidence
- <40: Very uncertain

OUTPUT: Valid JSON matching the FinalDecision schema.`;

            const userPrompt = `Make final hiring decision based on all evaluations:

CANDIDATE:
${JSON.stringify(candidate, null, 2)}

JOB:
${JSON.stringify(job, null, 2)}

MATCH ANALYSIS:
${JSON.stringify(matchAnalysis, null, 2)}

BIAS CHECK:
${JSON.stringify(biasCheck, null, 2)}

TECHNICAL EVALUATION:
${technicalEval ? JSON.stringify(technicalEval, null, 2) : 'Not available (no interview conducted)'}

Synthesize all data and decide:
1. Recommendation: hire, consider, or reject
2. Confidence: 0-100
3. Risk level: low, medium, or high
4. Reasoning: clear explanation with evidence
5. Key factors (positive and negative)
6. Next steps (if applicable)

CRITICAL: If bias check failed, flag this in reasoning and adjust recommendation.

Return ONLY valid JSON.`;

            const decision = await this.llm.generateJSON<FinalDecision>({
                systemPrompt,
                userPrompt,
                temperature: 0.2,
                maxTokens: 2000,
            });

            // Override decision if bias check failed
            if (biasCheck.status === 'fail') {
                decision.riskLevel = 'high';
                decision.reasoning.unshift(
                    'WARNING: Bias check failed - evaluation may be unfair'
                );
                this.logger.warn('Bias check failed - decision flagged');
            }

            // Ensure fields exist with defaults
            decision.reasoning = decision.reasoning || [];
            decision.keyFactors = decision.keyFactors || { positive: [], negative: [] };
            decision.keyFactors.positive = decision.keyFactors.positive || [];
            decision.keyFactors.negative = decision.keyFactors.negative || [];

            this.logger.info('Final decision made', {
                recommendation: decision.recommendation,
                confidence: decision.confidence,
                riskLevel: decision.riskLevel,
            });

            return {
                success: true,
                data: decision,
                reasoning: [
                    `Recommendation: ${String(decision.recommendation || 'N/A').toUpperCase()}`,
                    `Confidence: ${decision.confidence || 0}%`,
                    `Risk level: ${decision.riskLevel || 'high'}`,
                    `Based on ${(decision.reasoning || []).length} factors`,
                ],
            };
        } catch (error: any) {
            this.logger.error('Decision making failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
