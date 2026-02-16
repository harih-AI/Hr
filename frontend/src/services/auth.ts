import http from './http';
import { mockPost } from './mockHttp';
import { ENV } from '../config/env';

export const login = async (credentials: any) => {
    if (ENV.USE_MOCK) {
        return mockPost('/auth/login', credentials);
    }
    return http.post('/auth/login', credentials).then(r => r.data);
};

export const register = async (userData: any) => {
    if (ENV.USE_MOCK) {
        return mockPost('/auth/register', userData);
    }
    return http.post('/auth/register', userData).then(r => r.data);
};

export const logout = async () => {
    if (ENV.USE_MOCK) {
        return Promise.resolve();
    }
    return http.post('/auth/logout');
};
