import { create } from 'zustand';
import { getJobs } from '../services/jobs';

interface JobState {
    jobs: any[];
    isLoading: boolean;
    error: string | null;
    fetchJobs: (filters?: any) => Promise<void>;
}

export const useJobStore = create<JobState>((set) => ({
    jobs: [],
    isLoading: false,
    error: null,
    fetchJobs: async (filters) => {
        set({ isLoading: true, error: null });
        try {
            const jobs = await getJobs(filters);
            set({ jobs, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    }
}));
