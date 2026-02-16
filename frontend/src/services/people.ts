import http from './http';
import { endpoints } from '@/config/endpoints';
import type { Employee, CultureMetric, RetentionScore, ApiResponse, PaginatedResponse } from '@/types/api';

export const peopleService = {
  async getEmployees(page = 1, pageSize = 20): Promise<PaginatedResponse<Employee>> {
    const { data } = await http.get<PaginatedResponse<Employee>>(endpoints.people.employees, {
      params: { page, pageSize },
    });
    return data;
  },

  async getCultureMetrics(): Promise<CultureMetric[]> {
    const { data } = await http.get<ApiResponse<CultureMetric[]>>(endpoints.people.culture);
    return data.data;
  },

  async getRetentionScores(): Promise<RetentionScore[]> {
    const { data } = await http.get<ApiResponse<RetentionScore[]>>(endpoints.people.retention);
    return data.data;
  },

  async getPerformanceData(): Promise<unknown> {
    const { data } = await http.get(endpoints.people.performance);
    return data.data;
  },

  async getSkillAnalysis(): Promise<unknown> {
    const { data } = await http.get(endpoints.people.skills);
    return data.data;
  },
};
