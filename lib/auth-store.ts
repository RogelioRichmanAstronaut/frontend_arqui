import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    email: string;
    names?: string;
    country?: string;
    phone?: string;
    idNumber?: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (email) => set({ isAuthenticated: true, user: { email } }),
            logout: () => set({ isAuthenticated: false, user: null }),
            updateUser: (data) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null,
                })),
        }),
        {
            name: 'auth-storage',
        }
    )
);
