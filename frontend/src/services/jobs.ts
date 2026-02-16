import http from './http';
import { mockGet } from './mockHttp';
import { ENV } from '../config/env';

export const getJobs = async (filters?: any) => {
    if (ENV.USE_MOCK) {
        return mockGet('/jobs');
    }
    return http.get('/jobs', { params: filters }).then(r => r.data);
};

export const getJobById = async (id: string) => {
    if (ENV.USE_MOCK) {
        const jobs = await mockGet('/jobs');
        return jobs.find((j: any) => j.id === id);
    }
    return http.get(`/jobs/${id}`).then(r => r.data);
};
