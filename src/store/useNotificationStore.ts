import { NotificationState } from '@/types/common';
import { create } from 'zustand';

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (message, type) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            notifications: [...state.notifications, { id, message, type }],
        }));
    },
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
}));