import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';

const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 300000, // 5 minutes to match backend Ollama timeout
  headers: { 'Content-Type': 'application/json' },
});

// Auth token interceptor
http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // CSRF token
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrf) {
    config.headers['X-CSRF-Token'] = csrf;
  }
  return config;
});

// Response interceptor with retry logic
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };

    // Retry logic (max 2 retries for network errors)
    if (!error.response && (config._retryCount ?? 0) < 2) {
      config._retryCount = (config._retryCount ?? 0) + 1;
      return http(config);
    }

    // Token refresh on 401
    if (error.response?.status === 401 && !config.url?.includes('/auth/')) {
      try {
        const refreshToken = sessionStorage.getItem('refresh_token');
        if (refreshToken) {
          const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken });
          sessionStorage.setItem('auth_token', data.token);
          if (config.headers) {
            config.headers.Authorization = `Bearer ${data.token}`;
          }
          return http(config);
        }
      } catch {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('refresh_token');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default http;
