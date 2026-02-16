import http from './http';
import { mockGet, mockPut } from './mockHttp';
import { ENV } from '../config/env';

export const getProfile = async () => {
    if (ENV.USE_MOCK) {
        return mockGet('/profile');
    }
    return http.get('/profile').then(r => r.data);
};

export const updateProfile = async (data: any) => {
    if (ENV.USE_MOCK) {
        return mockPut('/profile', data);
    }
    return http.put('/profile', data).then(r => r.data);
};

export const uploadResume = async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    if (ENV.USE_MOCK) {
        console.log('Mock uploading resume...', file.name);
        return { success: true, url: '/docs/resume.pdf' };
    }
    return http.post('/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
};
