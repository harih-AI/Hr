import { create } from 'zustand';
import { getProfile, updateProfile, uploadResume } from '../services/profile';

interface ProfileState {
    profile: any | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    uploadResume: (file: File) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,
    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profile = await getProfile();
            set({ profile, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },
    updateProfile: async (data) => {
        set({ isLoading: true });
        try {
            await updateProfile(data);
            set((state) => ({
                profile: { ...state.profile, ...data },
                isLoading: false
            }));
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },
    uploadResume: async (file) => {
        set({ isLoading: true });
        try {
            const result = await uploadResume(file);
            set((state) => ({
                profile: result.profile || { ...state.profile, resumeUrl: result.url },
                isLoading: false
            }));
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    }
}));
