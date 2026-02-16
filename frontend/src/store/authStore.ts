import { create } from 'zustand';
import type { User } from '@/types/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: sessionStorage.getItem('auth_token'),
  isAuthenticated: !!sessionStorage.getItem('auth_token'),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token) {
      sessionStorage.setItem('auth_token', token);
    } else {
      sessionStorage.removeItem('auth_token');
    }
    set({ token, isAuthenticated: !!token });
  },
  logout: () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
