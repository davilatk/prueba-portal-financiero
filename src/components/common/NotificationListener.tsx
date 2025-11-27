'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';

export function NotificationListener() {
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        console.log('Conectando al stream de notificaciones...');
        const eventSource = new EventSource('/api/notifications/stream');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Notificación recibida:', data);

                addNotification(data.message, data.type || 'info');
            } catch (error) {
                console.error('Error notificación SSE:', error);
            }
        };

        eventSource.onerror = (err) => {
            console.warn('SSE conexión perdida (reintento...)', err);
        };

        return () => {
            console.log('🔌 Desconectando stream...');
            eventSource.close();
        };
    }, [addNotification]);

    return null;
}