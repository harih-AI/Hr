// ============================================
// AGENT 4: INTERVIEW PLANNING AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type {
    AgentResponse,
    CandidateProfile,
    JobProfile,
    MatchAnalysis,
    InterviewPlan,
} from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class InterviewPlanningAgent {
    private llm: LLMClient;
    private logger: Logger;

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('InterviewPlanAgent');
    }

    async createPlan(
        candidate: CandidateProfile,
        job: JobProfile,
        matchAnalysis: MatchAnalysis
    ): Promise<AgentResponse<InterviewPlan>> {
        try {
            this.logger.info('Creating personalized interview plan');

            const systemPrompt = `You are an expert interview designer for a hiring AI system.
Your task is to create personalized, adaptive interview plans.

RULES:
1. Focus on weak areas and critical skills
2. Design questions that test depth, not memorization
3. Include behavioral and technical questions
4. Adjust difficulty based on candidate level
5. Prioritize skills gaps identified in matching
6. Create questions that detect bluffing
7. Ensure fairness and relevance
8. Estimate realistic duration

QUESTION TYPES:
- Conceptual (understanding)
- Practical (application)
- Scenario-based (problem-solving)
- Depth-testing (avoiding surface knowledge)

OUTPUT: Valid JSON matching the InterviewPlan schema.`;

            const userPrompt = `Create a personalized interview plan for ${candidate.name || 'the candidate'}:

CANDIDATE PROFILE:
${JSON.stringify(candidate, null, 2)}

JOB REQUIREMENTS:
${JSON.stringify(job, null, 2)}

MATCH ANALYSIS:
${JSON.stringify(matchAnalysis, null, 2)}

Design an interview plan that is DEEPLY personalized to the candidate's actual background:
1. PROJECT SPECIFIC: If projects are listed, ask at least 2 questions mentioning the Project Name explicitly. If NO projects are listed, ask about a specific technical achievement within one of their roles: ${(candidate.experience?.[0]?.company || 'their recent experience')}.
2. ROLE SPECIFIC: Ask about their responsibilities in their most recent role: ${(candidate.experience?.[0]?.role || 'their previous experience')} at ${(candidate.experience?.[0]?.company || 'their recent company')}.
3. SKILL VERIFICATION: For their top skills (${candidate.skills?.technical?.slice(0, 3).join(', ') || 'technical background'}), design questions that test actual implementation knowledge.
4. GAPS & WEAKNESSES: Focus on identified gaps: ${matchAnalysis.gaps.join(', ')}.
5. AUTHENTICITY: Design questions to validate "weak claims" or "exaggerations" suspected in the resume analysis.
6. NO GENERIC QUESTIONS: Avoid "Tell me about yourself" or "What are your strengths".
7. CONTEXTUAL: Every question MUST mention a specific project, company, or technical implementation detail mentioned in the CANDIDATE PROFILE.

Include:
- Focus areas (Specific to this person)
- Interview sections with at least 2 questions each
- Purpose of each section
- Weight/importance of each section
- Estimated duration (total 15-20 mins)
- Difficulty level (Relative to their ${candidate.totalYearsOfExperience} years of experience)

7. CONTEXTUAL: Every question MUST mention a specific project, company, or technical implementation detail mentioned in the CANDIDATE PROFILE.

RESPONSE FORMAT:
{
  "focus": ["area1", "area2"],
  "sections": [
    {
      "topic": "Name",
      "questions": ["Question referencing project X", "Question referencing skill Y"],
      "purpose": "Verification",
      "weight": 0.5
    }
  ],
  "estimatedDuration": 15,
  "difficultyLevel": "mid"
}

Return ONLY valid JSON matching this structure.
STRICT: If a question is generic (e.g., 'What is React?'), the plan will be rejected. Every question MUST refer to a detail found in the CANDIDATE PROFILE provided.`;

            let response = await this.llm.generateJSON<any>({
                systemPrompt,
                userPrompt,
                temperature: 0.2,
                maxTokens: 2500,
            });

            // Flatten if the AI nested it under "interviewPlan" or similar
            let interviewPlan: InterviewPlan = response.interviewPlan || response;

            // Map "focusAreas" to "focus" if needed
            if ((interviewPlan as any).focusAreas && !interviewPlan.focus) {
                interviewPlan.focus = (interviewPlan as any).focusAreas;
            }

            // Ensure fields exist with defaults
            interviewPlan.focus = interviewPlan.focus || [];
            interviewPlan.sections = interviewPlan.sections || [];
            interviewPlan.sections.forEach(s => {
                s.questions = s.questions || [];
            });

            this.logger.info('Interview plan created', {
                sections: interviewPlan.sections.length,
                duration: interviewPlan.estimatedDuration,
            });

            const reasoning = [
                `Created ${interviewPlan.sections.length} interview sections`,
                `Estimated duration: ${interviewPlan.estimatedDuration} minutes`,
                `Difficulty level: ${interviewPlan.difficultyLevel}`,
                `Focus areas: ${interviewPlan.focus.join(', ')}`,
            ];

            return {
                success: true,
                data: interviewPlan,
                reasoning: reasoning,
            };
        } catch (error: any) {
            this.logger.error('Interview plan creation failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
