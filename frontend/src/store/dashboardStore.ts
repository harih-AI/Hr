import { create } from 'zustand';
import type { KPIMetric, HealthMetric, AIInsight } from '@/types/api';

interface DashboardStore {
  kpis: KPIMetric[];
  health: HealthMetric[];
  insights: AIInsight[];
  isLoading: boolean;
  error: string | null;
  setKPIs: (kpis: KPIMetric[]) => void;
  setHealth: (health: HealthMetric[]) => void;
  setInsights: (insights: AIInsight[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  kpis: [],
  health: [],
  insights: [],
  isLoading: false,
  error: null,
  setKPIs: (kpis) => set({ kpis }),
  setHealth: (health) => set({ health }),
  setInsights: (insights) => set({ insights }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
