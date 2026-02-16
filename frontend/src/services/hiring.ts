import http from './http';
import { mockGet, mockPost } from './mockHttp';
import { ENV } from '../config/env';
import { endpoints } from '../config/endpoints';

export const getCandidates = async () => {
    if (ENV.USE_MOCK) {
        return mockGet('/hiring/candidates');
    }
    return http.get(endpoints.hiring.candidates).then(r => r.data);
};

export const uploadResume = async (file: File, role: string, department: string) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);
    formData.append('department', department);

    if (ENV.USE_MOCK) {
        console.log('Mock uploading resume...', file.name, { role, department });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Resume analyzed successfully',
                    data: {
                        candidateId: 'mock-' + Date.now(),
                        analysis: {
                            score: 92,
                            summary: 'Strong candidate with relevant experience.'
                        }
                    }
                });
            }, 1500);
        });
    }

    return http.post(endpoints.hiring.upload, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then(r => r.data);
};

export const getRanking = async () => {
    if (ENV.USE_MOCK) {
        return mockGet('/hiring/ranking');
    }
    return http.get(endpoints.hiring.ranking).then(r => r.data);
};

export const approveCandidate = async (id: string) => {
    if (ENV.USE_MOCK) {
        return mockPost(`/hiring/candidates/${id}/approve`, {});
    }
    return http.post(endpoints.hiring.approve(id)).then(r => r.data);
};

export const startInterview = async (id: string) => {
    if (ENV.USE_MOCK) {
        return mockPost(`/hiring/candidates/${id}/interview`, {});
    }
    return http.post(endpoints.hiring.interview(id)).then(r => r.data);
};
