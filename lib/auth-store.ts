import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id?: string;
    email: string;
    names?: string;
    country?: string;
    phone?: string;
    idNumber?: string;
    role?: 'ADMIN' | 'EMPLOYEE';
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    clientId: string | null;
    login: (email: string, userData?: Partial<User>) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
    setClientId: (clientId: string) => void;
    hasCompleteProfile: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,
            clientId: null,
            login: (email, userData) => set({ 
                isAuthenticated: true, 
                user: { email, ...userData } 
            }),
            logout: () => {
                // Clear localStorage tokens
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('clientId');
                }
                set({ isAuthenticated: false, user: null, clientId: null });
            },
            updateUser: (data) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null,
                })),
            setClientId: (clientId) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('clientId', clientId);
                }
                set({ clientId });
            },
            hasCompleteProfile: () => {
                const user = get().user;
                return !!(user?.names && user?.country && user?.phone && user?.idNumber);
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
