// ============================================
// CORE TYPE DEFINITIONS FOR TALENTSCOUT AI
// ============================================

export interface ResumeData {
    rawText: string;
    fileName?: string;
    uploadedAt?: Date;
}

export interface CandidateProfile {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    headline?: string;
    summary?: string;
    skills: {
        technical: string[];
        soft: string[];
        tools: string[];
    };
    experience: Experience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    achievements: string[];
    totalYearsOfExperience: number;
    weakClaims: string[];
    exaggerations: string[];
}

export interface Experience {
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
    technologies?: string[];
    impact?: string;
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    year: string;
    grade?: string;
}

export interface Project {
    name: string;
    description: string;
    technologies: string[];
    role?: string;
    outcome?: string;
}

export interface Certification {
    name: string;
    issuer: string;
    year?: string;
}

export interface JobProfile {
    title: string;
    company?: string;
    description: string;
    mandatorySkills: string[];
    optionalSkills: string[];
    experienceRequired: {
        min: number;
        max: number;
    };
    responsibilities: string[];
    qualifications: string[];
    criticalCompetencies: string[];
}

export interface MatchAnalysis {
    overallScore: number; // 0-100
    skillMatch: {
        score: number;
        matched: string[];
        missing: string[];
        extra: string[];
    };
    experienceMatch: {
        score: number;
        yearsRequired: number;
        yearsCandidate: number;
        relevant: boolean;
    };
    strengths: string[];
    gaps: string[];
    redFlags: string[];
    recommendation: string;
}

export interface InterviewPlan {
    focus: string[];
    sections: InterviewSection[];
    estimatedDuration: number; // minutes
    difficultyLevel: 'junior' | 'mid' | 'senior' | 'expert';
}

export interface InterviewSection {
    topic: string;
    questions: string[];
    purpose: string;
    weight: number; // importance 0-1
}

export interface InterviewAnswer {
    question: string;
    answer: string;
    timestamp?: Date;
}

export interface TechnicalEvaluation {
    overallScore: number; // 0-100
    answerEvaluations: AnswerEvaluation[];
    depthAnalysis: {
        superficial: number;
        moderate: number;
        deep: number;
    };
    bluffDetection: {
        detected: boolean;
        instances: string[];
    };
    strengths: string[];
    weaknesses: string[];
}

export interface AnswerEvaluation {
    question: string;
    answer: string;
    score: number; // 0-10
    reasoning: string;
    depth: 'superficial' | 'moderate' | 'deep';
    correctness: 'incorrect' | 'partial' | 'correct' | 'excellent';
}

export interface BiasCheck {
    status: 'pass' | 'fail';
    checks: {
        nameBasedBias: boolean;
        genderBias: boolean;
        locationBias: boolean;
        institutionBias: boolean;
    };
    warnings: string[];
    fairnessScore: number; // 0-100
}

export interface FinalDecision {
    recommendation: 'hire' | 'consider' | 'reject';
    confidence: number; // 0-100
    riskLevel: 'low' | 'medium' | 'high';
    reasoning: string[];
    keyFactors: {
        positive: string[];
        negative: string[];
    };
    nextSteps?: string[];
}

export interface EvaluationReport {
    candidateProfile: CandidateProfile;
    jobProfile: JobProfile;
    matchScore: number;
    interviewScore: number;
    biasCheck: BiasCheck;
    riskLevel: 'low' | 'medium' | 'high';
    finalRecommendation: 'hire' | 'consider' | 'reject';
    confidence: number;
    explanation: string[];
    timestamp: Date;
    detailedAnalysis: {
        matchAnalysis: MatchAnalysis;
        technicalEvaluation?: TechnicalEvaluation;
        interviewPlan?: InterviewPlan;
        finalDecision: FinalDecision;
    };
}

export interface AgentResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    reasoning?: string[];
}

export interface LLMRequest {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
}

export interface LLMResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
