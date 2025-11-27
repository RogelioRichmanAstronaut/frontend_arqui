import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    email: string;
    names?: string;
    country?: string;
    phone?: string;
    idNumber?: string;
    documentType?: 'CC' | 'TI' | 'PASS';
}

interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    clientId: string | null;
    login: (email: string) => void;
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
            login: (email) => set({ isAuthenticated: true, user: { email } }),
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
                if (!user) {
                    return false;
                }

                const hasCoreInfo =
                    Boolean(user.names?.trim()) &&
                    Boolean(user.phone?.trim()) &&
                    Boolean(user.idNumber?.trim());

                // Country is optional because the backend profile may not expose it yet.
                return hasCoreInfo;
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
