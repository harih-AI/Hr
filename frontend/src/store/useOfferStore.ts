import { create } from 'zustand';
import { getOffers } from '../services/offers';

interface OfferState {
    offers: any[];
    isLoading: boolean;
    error: string | null;
    fetchOffers: () => Promise<void>;
}

export const useOfferStore = create<OfferState>((set) => ({
    offers: [],
    isLoading: false,
    error: null,
    fetchOffers: async () => {
        set({ isLoading: true, error: null });
        try {
            const offers = await getOffers();
            set({ offers, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    }
}));
