// ============================================
// AGENT 7: BIAS & FAIRNESS AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type {
    AgentResponse,
    CandidateProfile,
    BiasCheck,
    MatchAnalysis,
    TechnicalEvaluation,
} from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class BiasFairnessAgent {
    private llm: LLMClient;
    private logger: Logger;

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('BiasAgent');
    }

    async checkBias(
        candidate: CandidateProfile,
        matchAnalysis: MatchAnalysis,
        technicalEval?: TechnicalEvaluation
    ): Promise<AgentResponse<BiasCheck>> {
        try {
            this.logger.info('Performing bias and fairness check');

            const systemPrompt = `You are a fairness and bias detection AI for a hiring system.
Your task is to ensure hiring decisions are free from unfair bias.

BIAS TYPES TO DETECT:
1. Name-based bias (ethnicity, gender assumptions)
2. Gender bias (favoring one gender)
3. Location bias (preferring certain cities/regions)
4. Institution bias (favoring prestigious colleges)

RULES:
1. Analyze if decisions are based on merit only
2. Check if protected attributes influenced scoring
3. Ensure evaluation is skill-focused
4. Flag any suspicious patterns
5. Calculate fairness score (0-100)
6. Provide warnings if bias detected

FAIRNESS PRINCIPLES:
- Skills and experience should drive decisions
- Personal attributes should be irrelevant
- Evaluation should be evidence-based
- All candidates should be judged equally

OUTPUT: Valid JSON matching the BiasCheck schema.`;

            const userPrompt = `Perform bias check on this evaluation:

CANDIDATE PROFILE:
Name: ${candidate.name || 'Not provided'}
Location: ${candidate.location || 'Not provided'}
Education: ${JSON.stringify(candidate.education)}

MATCH ANALYSIS:
${JSON.stringify(matchAnalysis, null, 2)}

TECHNICAL EVALUATION:
${technicalEval ? JSON.stringify(technicalEval, null, 2) : 'Not available'}

Check for:
1. Name-based bias (did name influence decision?)
2. Gender bias (any gender assumptions?)
3. Location bias (did location matter unfairly?)
4. Institution bias (were prestigious schools favored over skills?)

Determine:
- Status: pass or fail
- Individual bias checks (true = no bias, false = bias detected)
- Warnings (if any bias detected)
- Fairness score (0-100, higher = more fair)

Return ONLY valid JSON.`;

            const biasCheck = await this.llm.generateJSON<BiasCheck>({
                systemPrompt,
                userPrompt,
                temperature: 0.1, // Low temperature for consistency
                maxTokens: 1500,
            });

            // Ensure fields exist with defaults
            biasCheck.warnings = biasCheck.warnings || [];
            biasCheck.checks = biasCheck.checks || {
                nameBasedBias: true,
                genderBias: true,
                locationBias: true,
                institutionBias: true
            };

            this.logger.info('Bias check completed', {
                status: biasCheck.status,
                fairnessScore: biasCheck.fairnessScore,
            });

            return {
                success: true,
                data: biasCheck,
                reasoning: [
                    `Bias check status: ${biasCheck.status}`,
                    `Fairness score: ${biasCheck.fairnessScore}/100`,
                    `Warnings: ${biasCheck.warnings.length}`,
                    biasCheck.status === 'fail'
                        ? 'ALERT: Potential bias detected'
                        : 'Evaluation appears fair',
                ],
            };
        } catch (error: any) {
            this.logger.error('Bias check failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
