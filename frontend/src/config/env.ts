export const ENV = {
    USE_MOCK: import.meta.env.VITE_USE_MOCK !== 'false', // Defaults to true unless explicitly 'false'
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
};
