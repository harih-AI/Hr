import http from './http';
import { mockGet, mockPost } from './mockHttp';
import { ENV } from '../config/env';

export const getOnboardingStatus = async () => {
    if (ENV.USE_MOCK) {
        return mockGet('/onboarding');
    }
    return http.get('/onboarding').then(r => r.data);
};

export const completeOnboardingTask = async (taskId: string) => {
    if (ENV.USE_MOCK) {
        return mockPost(`/onboarding/tasks/${taskId}/complete`, {});
    }
    return http.post(`/onboarding/tasks/${taskId}/complete`).then(r => r.data);
};
