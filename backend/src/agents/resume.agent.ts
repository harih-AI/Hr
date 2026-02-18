// ============================================
// AGENT 1: RESUME INTELLIGENCE AGENT
// ============================================

import { LLMClient } from '../llm/client.js';
import type { AgentResponse, CandidateProfile } from '../core/types.js';
import { Logger } from '../utils/logger.js';

export class ResumeIntelligenceAgent {
    private llm: LLMClient;
    private logger: Logger;

    constructor(llm: LLMClient) {
        this.llm = llm;
        this.logger = new Logger('ResumeAgent');
    }

    async analyze(resumeText: string): Promise<AgentResponse<CandidateProfile>> {
        try {
            this.logger.info('Starting resume analysis');

            const systemPrompt = `You are an expert resume analyzer for a hiring AI system.
Your task is to extract structured information from resumes with high accuracy.

RULES:
1. Extract all skills, experience, education, projects, and achievements
2. For PROJECTS: Capture the name, full description, and technologies used. This is CRITICAL for interviewers.
3. For EXPERIENCE: Capture specific responsibilities and impact for each role.
4. Identify weak claims (vague statements without evidence)
5. Detect exaggerations (unrealistic claims, inflated numbers)
6. Calculate total years of experience accurately
7. Categorize skills into technical, soft, and tools
8. Extract professional links (LinkedIn, GitHub, Portfolio website) if available
9. Extract a professional "headline" and "summary"
10. Be objective and evidence-based
11. Do not make assumptions beyond what's written

OUTPUT: Valid JSON matching the CandidateProfile schema.`;

            const userPrompt = `Analyze this resume and extract all relevant information:

RESUME:
${resumeText}

Extract:
- Personal info (MUST include "name" key, plus email, phone, location)
- Links (LinkedIn, GitHub, Portfolio)
- Summary/objective
- Skills (categorized as technical, soft, tools)
- Work experience with details
- Education
- Projects
- Certifications
- Achievements
- Total years of experience (numeric)
- Weak claims (vague statements)
- Exaggerations (inflated or unrealistic claims)

Return ONLY valid JSON. Ensure the name is stored in the "name" field.`;

            const profile = await this.llm.generateJSON<any>({
                systemPrompt,
                userPrompt,
                temperature: 0.2,
                maxTokens: 3000,
            }) as any;

            // Handle potential nesting from LLM
            const personalInfo = profile.personalInfo || profile.personalContact || {};
            const links = profile.links || profile.socialLinks || profile.professionalLinks || {};

            const candidateProfile: CandidateProfile = {
                name: profile.name || personalInfo.name || personalInfo.fullName || 'Unknown Candidate',
                email: profile.email || personalInfo.email || '',
                phone: profile.phone || personalInfo.phone || '',
                location: profile.location || personalInfo.location || '',
                summary: profile.summary || '',
                headline: profile.headline || '',
                skills: profile.skills || { technical: [], soft: [], tools: [] },
                experience: profile.experience || [],
                education: profile.education || [],
                projects: profile.projects || [],
                certifications: profile.certifications || [],
                achievements: profile.achievements || [],
                totalYearsOfExperience: profile.totalYearsOfExperience || 0,
                links: {
                    linkedin: links.linkedin || '',
                    github: links.github || '',
                    portfolio: links.portfolio || links.website || ''
                },
                weakClaims: profile.weakClaims || [],
                exaggerations: profile.exaggerations || []
            };

            // Ensure sub-fields exist with defaults
            candidateProfile.skills.technical = candidateProfile.skills.technical || [];
            candidateProfile.skills.soft = candidateProfile.skills.soft || [];
            candidateProfile.skills.tools = candidateProfile.skills.tools || [];

            this.logger.info('Resume analysis completed', {
                candidate: candidateProfile.name,
                skillsCount: candidateProfile.skills.technical.length,
            });

            return {
                success: true,
                data: candidateProfile,
                reasoning: [
                    `Extracted profile for ${candidateProfile.name}`,
                    `Found ${candidateProfile.experience.length} work experiences`,
                ],
            };
        } catch (error: any) {
            this.logger.error('Resume analysis failed', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
