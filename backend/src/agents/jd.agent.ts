// ============================================
// AGENT 2: JOB DESCRIPTION ANALYSIS AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type { AgentResponse, JobProfile } from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class JobDescriptionAgent {
    private llm: LLMClient;
    private logger: Logger;

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('JDAgent');
    }

    async analyze(jobDescription: string): Promise<AgentResponse<JobProfile>> {
        try {
            this.logger.info('Starting job description analysis');

            const systemPrompt = `You are an expert job description analyzer for a hiring AI system.
Your task is to extract and structure job requirements accurately.

RULES:
1. Identify mandatory vs optional skills clearly
2. Extract experience requirements (min/max years)
3. List all responsibilities
4. Identify critical competencies
5. Distinguish between must-have and nice-to-have qualifications
6. Be precise and objective
7. Do not add requirements not mentioned in the JD

OUTPUT: Valid JSON matching the JobProfile schema.`;

            const userPrompt = `Analyze this job description and extract all requirements:

JOB DESCRIPTION:
${jobDescription}

Extract:
- Job title
- Company (if mentioned)
- Full description
- Mandatory skills (must-have)
- Optional skills (nice-to-have)
- Experience required (min and max years)
- Key responsibilities
- Qualifications
- Critical competencies (most important skills/traits)

Return ONLY valid JSON.`;

            const jobProfile = await this.llm.generateJSON<JobProfile>({
                systemPrompt,
                userPrompt,
                temperature: 0.2,
                maxTokens: 2000,
            });

            // Ensure arrays exist
            jobProfile.mandatorySkills = jobProfile.mandatorySkills || [];
            jobProfile.optionalSkills = jobProfile.optionalSkills || [];
            jobProfile.responsibilities = jobProfile.responsibilities || [];
            jobProfile.qualifications = jobProfile.qualifications || [];
            jobProfile.criticalCompetencies = jobProfile.criticalCompetencies || [];
            // Ensure experienceRequired object exists with default values
            jobProfile.experienceRequired = jobProfile.experienceRequired || { min: 0, max: 0 };

            this.logger.info('Job description analysis completed', {
                mandatorySkills: jobProfile.mandatorySkills.length,
                optionalSkills: jobProfile.optionalSkills.length,
            });

            return {
                success: true,
                data: jobProfile,
                reasoning: [
                    `Identified ${jobProfile.mandatorySkills.length} mandatory skills`,
                    `Found ${jobProfile.optionalSkills.length} optional skills`,
                    `Experience required: ${jobProfile.experienceRequired.min}-${jobProfile.experienceRequired.max} years`,
                    `${jobProfile.criticalCompetencies.length} critical competencies identified`,
                ],
            };
        } catch (error: any) {
            this.logger.error('Job description analysis failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
