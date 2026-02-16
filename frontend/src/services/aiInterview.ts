import { ENV } from '@/config/env';
import http from './http';
import { mockGet, mockPost } from './mockHttp';

export interface InterviewQuestion {
    id: string;
    question: string;
    category: string;
    difficulty: string;
    expectedDuration: number;
}

export interface InterviewSession {
    sessionId: string;
    candidateId: string;
    jobId: string;
    questions: InterviewQuestion[];
    totalQuestions: number;
    estimatedDuration: number;
    interviewType: string;
}

export interface StartInterviewRequest {
    candidateId: string;
    jobId: string;
    resumeText: string;
    candidateProfile?: any;
    experienceYears: number;
    primarySkills: string[];
}

export interface AnswerSubmission {
    sessionId: string;
    questionId: string;
    answer: string;
    audioTranscript?: string;
    responseTime: number;
}

export interface InterviewEvaluation {
    sessionId: string;
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    strengths: string[];
    improvements: string[];
    recommendation: string;
    detailedFeedback: string;
}

export const startInterviewSession = (data: StartInterviewRequest): Promise<InterviewSession> => {
    if (ENV.USE_MOCK) return mockPost('/ai-interview/start-session', data) as any;
    return http.post('/ai-interview/start-session', data).then(r => r.data);
};

export const submitAnswer = (data: AnswerSubmission): Promise<any> => {
    if (ENV.USE_MOCK) return mockPost('/ai-interview/submit-answer', data);
    return http.post('/ai-interview/submit-answer', data).then(r => r.data);
};

export const getInterviewEvaluation = (sessionId: string): Promise<InterviewEvaluation> => {
    if (ENV.USE_MOCK) return mockGet('/ai-interview/evaluate');
    return http.get(`/ai-interview/evaluate/${sessionId}`).then(r => r.data);
};

export const getInterviewSession = (sessionId: string): Promise<InterviewSession> => {
    if (ENV.USE_MOCK) return mockGet('/ai-interview/session');
    return http.get(`/ai-interview/session/${sessionId}`).then(r => r.data);
};
