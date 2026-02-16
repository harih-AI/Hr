import http from './http';
import { endpoints } from '@/config/endpoints';
import type { Report, ApiResponse } from '@/types/api';

export const reportsService = {
  async getReports(): Promise<Report[]> {
    const { data } = await http.get<ApiResponse<Report[]>>(endpoints.reports.list);
    return data.data;
  },

  async generateReport(type: string, params: Record<string, unknown>): Promise<Report> {
    const { data } = await http.post<ApiResponse<Report>>(endpoints.reports.generate, { type, ...params });
    return data.data;
  },

  async getForecasts(): Promise<unknown> {
    const { data } = await http.get(endpoints.reports.forecasts);
    return data.data;
  },

  async getScenarios(): Promise<unknown> {
    const { data } = await http.get(endpoints.reports.scenarios);
    return data.data;
  },

  async exportReport(id: string, format: 'pdf' | 'csv' | 'pptx'): Promise<Blob> {
    const { data } = await http.get(endpoints.reports.export(id, format), {
      responseType: 'blob',
    });
    return data;
  },
};
