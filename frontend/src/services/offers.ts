import http from './http';
import { mockGet, mockPost } from './mockHttp';
import { ENV } from '../config/env';

export const getOffers = async () => {
    if (ENV.USE_MOCK) {
        return mockGet('/offers');
    }
    return http.get('/offers').then(r => r.data);
};

export const respondToOffer = async (offerId: string, action: 'accept' | 'reject', comment?: string) => {
    if (ENV.USE_MOCK) {
        return mockPost(`/offers/${offerId}/respond`, { action, comment });
    }
    return http.post(`/offers/${offerId}/respond`, { action, comment }).then(r => r.data);
};
