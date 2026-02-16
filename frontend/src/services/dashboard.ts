import http from './http';
import { endpoints } from '@/config/endpoints';
import type { KPIMetric, HealthMetric, AIInsight, ChartDataPoint, ApiResponse } from '@/types/api';

export const dashboardService = {
  async getKPIs(): Promise<KPIMetric[]> {
    const { data } = await http.get<ApiResponse<KPIMetric[]>>(endpoints.dashboard.kpis);
    return data.data;
  },

  async getHealth(): Promise<HealthMetric[]> {
    const { data } = await http.get<ApiResponse<HealthMetric[]>>(endpoints.dashboard.health);
    return data.data;
  },

  async getInsights(): Promise<AIInsight[]> {
    const { data } = await http.get<ApiResponse<AIInsight[]>>(endpoints.dashboard.insights);
    return data.data;
  },

  async getChartData(type: string): Promise<ChartDataPoint[]> {
    const { data } = await http.get<ApiResponse<ChartDataPoint[]>>(endpoints.dashboard.charts(type));
    return data.data;
  },
};
