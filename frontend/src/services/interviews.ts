import http from './http';
import { mockGet } from './mockHttp';
import { ENV } from '../config/env';

export const getInterviews = async () => {
    if (ENV.USE_MOCK) {
        return mockGet('/interviews');
    }
    return http.get('/interviews').then(r => r.data);
};
