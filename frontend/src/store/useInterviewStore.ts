import { create } from 'zustand';
import { getInterviews } from '../services/interviews';

interface InterviewState {
    interviews: any[];
    isLoading: boolean;
    error: string | null;
    fetchInterviews: () => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    interviews: [],
    isLoading: false,
    error: null,
    fetchInterviews: async () => {
        set({ isLoading: true, error: null });
        try {
            const interviews = await getInterviews();
            set({ interviews, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    }
}));
