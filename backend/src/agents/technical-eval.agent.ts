// ============================================
// AGENT 6: TECHNICAL EVALUATION AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type {
    AgentResponse,
    InterviewAnswer,
    TechnicalEvaluation,
    JobProfile,
} from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class TechnicalEvaluationAgent {
    private llm: LLMClient;
    private logger: Logger;

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('TechEvalAgent');
    }

    async evaluate(
        answers: InterviewAnswer[],
        job: JobProfile
    ): Promise<AgentResponse<TechnicalEvaluation>> {
        try {
            this.logger.info('Starting technical evaluation');

            const systemPrompt = `You are an expert technical evaluator for a hiring AI system.
Your task is to evaluate interview answers for depth, correctness, and authenticity.

RULES:
1. Evaluate each answer individually
2. Detect shallow knowledge (buzzwords without understanding)
3. Identify bluffing or evasive answers
4. Assess depth: superficial, moderate, or deep
5. Rate correctness: incorrect, partial, correct, excellent
6. Provide evidence-based reasoning
7. Calculate overall technical score
8. Be fair but rigorous

SCORING:
- Per answer: 0-10
- Overall: 0-100 (weighted average)

DEPTH ANALYSIS:
- Superficial: Buzzwords, no details
- Moderate: Some understanding, lacks depth
- Deep: Clear understanding with examples

OUTPUT: Valid JSON matching the TechnicalEvaluation schema.`;

            const userPrompt = `Evaluate these interview answers:

JOB REQUIREMENTS:
${JSON.stringify(job, null, 2)}

INTERVIEW ANSWERS:
${JSON.stringify(answers, null, 2)}

For each answer, evaluate:
1. Score (0-10)
2. Reasoning (why this score)
3. Depth (superficial/moderate/deep)
4. Correctness (incorrect/partial/correct/excellent)

Overall evaluation:
1. Overall score (0-100)
2. Depth analysis (% superficial, moderate, deep)
3. Bluff detection (detected: true/false, instances)
4. Strengths
5. Weaknesses

Return ONLY valid JSON.`;

            const evaluation = await this.llm.generateJSON<TechnicalEvaluation>({
                systemPrompt,
                userPrompt,
                temperature: 0.2,
                maxTokens: 3000,
            });

            // Ensure fields exist with defaults
            evaluation.answerEvaluations = evaluation.answerEvaluations || [];
            evaluation.depthAnalysis = evaluation.depthAnalysis || { superficial: 0, moderate: 0, deep: 0 };
            evaluation.bluffDetection = evaluation.bluffDetection || { detected: false, instances: [] };
            evaluation.strengths = evaluation.strengths || [];
            evaluation.weaknesses = evaluation.weaknesses || [];

            this.logger.info('Technical evaluation completed', {
                overallScore: evaluation.overallScore,
                bluffDetected: evaluation.bluffDetection.detected,
            });

            return {
                success: true,
                data: evaluation,
                reasoning: [
                    `Overall technical score: ${evaluation.overallScore}/100`,
                    `Depth: ${evaluation.depthAnalysis.deep}% deep, ${evaluation.depthAnalysis.superficial}% superficial`,
                    `Bluff detected: ${evaluation.bluffDetection.detected}`,
                    `${evaluation.strengths.length} strengths, ${evaluation.weaknesses.length} weaknesses`,
                ],
            };
        } catch (error: any) {
            this.logger.error('Technical evaluation failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
