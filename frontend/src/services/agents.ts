import http from './http';
import { endpoints } from '@/config/endpoints';
import type { Agent, AgentLog, AgentMetrics, ApiResponse, AgentId } from '@/types/api';

export const agentsService = {
  async getAgents(): Promise<Agent[]> {
    const { data } = await http.get<ApiResponse<Agent[]>>(endpoints.agents.list);
    return data.data;
  },

  async getAgent(id: AgentId): Promise<Agent> {
    const { data } = await http.get<ApiResponse<Agent>>(endpoints.agents.detail(id));
    return data.data;
  },

  async runAgent(id: AgentId, params?: Record<string, unknown>): Promise<void> {
    await http.post(endpoints.agents.run(id), params);
  },

  async getAgentLogs(id: AgentId, page = 1, pageSize = 20): Promise<AgentLog[]> {
    const { data } = await http.get<ApiResponse<AgentLog[]>>(endpoints.agents.logs(id), {
      params: { page, pageSize },
    });
    return data.data;
  },

  async getAgentMetrics(id: AgentId, period = '30d'): Promise<AgentMetrics> {
    const { data } = await http.get<ApiResponse<AgentMetrics>>(endpoints.agents.metrics(id), {
      params: { period },
    });
    return data.data;
  },
};
