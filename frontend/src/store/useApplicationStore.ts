import { create } from 'zustand';
import { getApplications } from '../services/applications';

interface ApplicationState {
    applications: any[];
    isLoading: boolean;
    error: string | null;
    fetchApplications: () => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
    applications: [],
    isLoading: false,
    error: null,
    fetchApplications: async () => {
        set({ isLoading: true, error: null });
        try {
            const applications = await getApplications();
            set({ applications, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    }
}));
