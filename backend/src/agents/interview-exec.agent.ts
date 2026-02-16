// ============================================
// AGENT 5: INTERVIEW EXECUTION AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type { AgentResponse, InterviewPlan, InterviewAnswer, CandidateProfile } from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class InterviewExecutionAgent {
    private llm: LLMClient;
    private logger: Logger;
    private conversationHistory: { question: string; answer: string }[] = [];

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('InterviewExecAgent');
    }

    /**
     * Start interview and get first question
     */
    async startInterview(plan: InterviewPlan): Promise<AgentResponse<string>> {
        try {
            this.logger.info('Starting interview execution');
            this.conversationHistory = [];

            const firstSection = plan.sections?.[0];
            const firstQuestion = firstSection?.questions?.[0] || 'Can you tell me about your background?';

            return {
                success: true,
                data: firstQuestion,
                reasoning: [`Starting with: ${firstSection?.topic || 'Introduction'}`],
            };
        } catch (error: any) {
            this.logger.error('Interview start failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Process answer and generate next question adaptively
     */
    async processAnswer(
        plan: InterviewPlan,
        currentQuestion: string,
        answer: string,
        history: InterviewAnswer[] = [],
        candidate?: CandidateProfile
    ): Promise<AgentResponse<string | null>> {
        try {
            // Use provided history or fallback to internal state (for backward compatibility)
            const fullHistory = history.length > 0 ? history : [...this.conversationHistory, { question: currentQuestion, answer, timestamp: new Date() }];

            // Sync internal history if needed
            if (history.length === 0) {
                this.conversationHistory.push({ question: currentQuestion, answer });
            }

            const systemPrompt = `You are an adaptive AI interviewer.
Your task is to conduct intelligent, dynamic interviews.

RULES:
1. Adjust difficulty based on candidate's answers
2. Ask follow-up questions if answers are shallow
3. Move to next topic if candidate demonstrates depth
4. Detect vague or evasive answers
5. Be professional and encouraging
6. Don't repeat questions
7. Know when to end the interview
8. RESUME AWARENESS: Use the candidate's background to ask deeper questions. If they mention a technology, ask how they used it in their specific projects listed in their resume.

ADAPTIVE BEHAVIOR:
- If answer is weak → ask simpler or clarifying question
- If answer is strong → increase difficulty or move on
- If answer is evasive → probe deeper
- If all topics covered → end interview`;

            const userPrompt = `Interview in progress for ${candidate?.name || 'the candidate'}.

CANDIDATE PROFILE:
${candidate ? JSON.stringify(candidate, null, 2) : 'Not provided'}

INTERVIEW PLAN:
${JSON.stringify(plan, null, 2)}

CONVERSATION HISTORY:
${JSON.stringify(fullHistory, null, 2)}

LATEST ANSWER:
"${answer}"

Based on the answer quality and interview progress:
1. Evaluate if the answer was strong, moderate, or weak
2. Decide next action:
   - Ask follow-up question. IMPORTANT: Reference a specific project, company, or technical claim from their resume to validate their depth (e.g., 'In your X project, how did you handle Y?').
   - Move to next planned question (if answer was good)
   - Increase difficulty (if candidate is doing well)
   - End interview (if all topics covered)

STRICT: No generic responses. Every follow-up must be contextual to either the current answer or the CANDIDATE PROFILE provided.
Respond with ONLY:
- The next question (as a string), OR
- "END_INTERVIEW" if interview should conclude

No JSON, no explanations. Just the question or END_INTERVIEW.`;

            const response = await this.llm.generate({
                systemPrompt,
                userPrompt,
                temperature: 0.5,
                maxTokens: 300,
            });

            let nextQuestion = response.content.trim();

            // Clean common AI chatter prefixes
            nextQuestion = nextQuestion.replace(/^(Assistant|Interviewer|Question|AI):\s*/i, '');
            nextQuestion = nextQuestion.replace(/^"|"$/g, ''); // Remove quotes
            nextQuestion = nextQuestion.replace(/\.$/, ''); // Remove trailing dot

            if (nextQuestion.toUpperCase().includes('END_INTERVIEW')) {
                this.logger.info('Interview completed');
                return {
                    success: true,
                    data: null,
                    reasoning: ['Interview concluded - all topics covered'],
                };
            }

            return {
                success: true,
                data: nextQuestion,
                reasoning: ['Next question generated adaptively'],
            };
        } catch (error: any) {
            this.logger.error('Answer processing failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Get all interview answers
     */
    getInterviewAnswers(): InterviewAnswer[] {
        return this.conversationHistory.map((item) => ({
            question: item.question,
            answer: item.answer,
            timestamp: new Date(),
        }));
    }

    /**
     * Reset interview state
     */
    reset() {
        this.conversationHistory = [];
    }
}
