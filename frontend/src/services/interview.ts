import http from './http';

export interface InterviewResult {
    candidateId: string;
    sessionId: string;
    candidateName: string;
    candidateEmail: string;
    evaluation: {
        overallScore: number;
        technicalScore: number;
        communicationScore: number;
        confidenceScore: number;
        strengths: string[];
        improvements: string[];
        recommendation: string;
        detailedFeedback: string;
    };
    answers: any[];
    totalQuestions: number;
    completedAt: string;
    status: 'Passed' | 'Needs Review';
}

export interface InterviewStats {
    totalInterviews: number;
    averageScore: number;
    passed: number;
    needsReview: number;
    recentInterviews: InterviewResult[];
}

export const interviewService = {
    // Get all interview results
    getAll: (): Promise<InterviewResult[]> => {
        return http.get('/interviews').then(r => r.data.data);
    },

    // Get interview results for a specific candidate
    getByCandidate: (candidateId: string): Promise<InterviewResult> => {
        return http.get(`/interviews/${candidateId}`).then(r => r.data.data);
    },

    // Get interview statistics
    getStats: (): Promise<InterviewStats> => {
        return http.get('/interviews/stats/summary').then(r => r.data.data);
    },

    // Save interview results
    save: (data: {
        candidateId: string;
        sessionId: string;
        evaluation: any;
        answers: any[];
        profile: any;
    }): Promise<InterviewResult> => {
        return http.post('/interviews/save', data).then(r => r.data.data);
    }
};
