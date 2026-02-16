import { create } from 'zustand';
import type { Agent, AgentLog } from '@/types/api';

interface AgentStore {
  agents: Agent[];
  selectedAgentId: string | null;
  logs: AgentLog[];
  isLoading: boolean;
  error: string | null;
  setAgents: (agents: Agent[]) => void;
  setSelectedAgent: (id: string | null) => void;
  setLogs: (logs: AgentLog[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  selectedAgentId: null,
  logs: [],
  isLoading: false,
  error: null,
  setAgents: (agents) => set({ agents }),
  setSelectedAgent: (id) => set({ selectedAgentId: id }),
  setLogs: (logs) => set({ logs }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
