import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsStore {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsStore>()(
    persist(
        (set) => ({
            notifications: [
                {
                    id: '1',
                    title: 'Bienvenido a Trip-In',
                    message: 'Gracias por registrarte en nuestra plataforma. ¡Esperamos que encuentres tu viaje ideal!',
                    date: new Date().toISOString(),
                    read: false,
                    type: 'success'
                }
            ],
            addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
            })),
            clearNotifications: () => set({ notifications: [] }),
        }),
        {
            name: 'notifications-storage',
        }
    )
);
