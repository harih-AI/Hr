const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const endpoints = {
  auth: {
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    refresh: `${API_BASE}/auth/refresh`,
    me: `${API_BASE}/auth/me`,
  },
  agents: {
    list: `${API_BASE}/agents`,
    detail: (id: string) => `${API_BASE}/agents/${id}`,
    run: (id: string) => `${API_BASE}/agents/${id}/run`,
    logs: (id: string) => `${API_BASE}/agents/${id}/logs`,
    metrics: (id: string) => `${API_BASE}/agents/${id}/metrics`,
  },
  dashboard: {
    kpis: `${API_BASE}/dashboard/kpis`,
    health: `${API_BASE}/dashboard/health`,
    insights: `${API_BASE}/dashboard/insights`,
    charts: (type: string) => `${API_BASE}/dashboard/charts/${type}`,
  },
  people: {
    employees: `${API_BASE}/people/employees`,
    culture: `${API_BASE}/people/culture`,
    retention: `${API_BASE}/people/retention`,
    performance: `${API_BASE}/people/performance`,
    skills: `${API_BASE}/people/skills`,
  },
  hiring: {
    candidates: `${API_BASE}/hiring/candidates`,
    upload: `${API_BASE}/hiring/upload`,
    ranking: `${API_BASE}/hiring/ranking`,
    approve: (id: string) => `${API_BASE}/hiring/candidates/${id}/approve`,
    interview: (id: string) => `${API_BASE}/hiring/candidates/${id}/interview`,
  },
  reports: {
    list: `${API_BASE}/reports`,
    generate: `${API_BASE}/reports/generate`,
    forecasts: `${API_BASE}/reports/forecasts`,
    scenarios: `${API_BASE}/reports/scenarios`,
    export: (id: string, format: string) => `${API_BASE}/reports/${id}/export/${format}`,
  },
  admin: {
    roles: `${API_BASE}/admin/roles`,
    permissions: `${API_BASE}/admin/permissions`,
    logs: `${API_BASE}/admin/logs`,
    mfa: `${API_BASE}/admin/mfa`,
    approvals: `${API_BASE}/admin/approvals`,
  },
} as const;
