import http from './http';
import { mockGet, mockPost } from './mockHttp';
import { ENV } from '../config/env';

export const getApplications = async () => {
    if (ENV.USE_MOCK) {
        return mockGet('/applications');
    }
    return http.get('/applications').then(r => r.data);
};

export const applyForJob = async (jobId: string, data: any) => {
    if (ENV.USE_MOCK) {
        return mockPost('/applications', { jobId, ...data });
    }
    return http.post('/applications', { jobId, ...data }).then(r => r.data);
};
