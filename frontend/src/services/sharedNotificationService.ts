import api from './api';

export interface NotificationToken {
    token: string;
    platform: 'web' | 'android';
    deviceId: string;
}

export interface NotificationPreferences {
    matchReminders: boolean;
    eventReminders: boolean;
    newsUpdates: boolean;
    teamUpdates: boolean;
}

export const sharedNotificationService = {
    /**
     * Registra un token de notificación para el dispositivo actual
     */
    async registerToken(token: string, platform: 'web' | 'android', deviceId: string): Promise<void> {
        await api.post('/notifications/register-token', {
            token,
            platform,
            deviceId
        });
    },

    /**
     * Actualiza las preferencias de notificación del usuario
     */
    async updatePreferences(preferences: NotificationPreferences): Promise<void> {
        await api.put('/notifications/preferences', preferences);
    },

    /**
     * Obtiene las preferencias de notificación del usuario
     */
    async getPreferences(): Promise<NotificationPreferences> {
        const response = await api.get('/notifications/preferences');
        return response.data;
    },

    /**
     * Elimina el token de notificación del dispositivo actual
     */
    async unregisterToken(deviceId: string): Promise<void> {
        await api.delete(`/notifications/tokens/${deviceId}`);
    },

    /**
     * Sincroniza las notificaciones entre dispositivos
     */
    async syncNotifications(lastSyncTimestamp: number): Promise<{
        notifications: any[];
        timestamp: number;
    }> {
        const response = await api.get('/notifications/sync', {
            params: { lastSync: lastSyncTimestamp }
        });
        return response.data;
    },

    /**
     * Marca una notificación como leída
     */
    async markAsRead(notificationId: string): Promise<void> {
        await api.put(`/notifications/${notificationId}/read`);
    },

    /**
     * Marca todas las notificaciones como leídas
     */
    async markAllAsRead(): Promise<void> {
        await api.put('/notifications/read-all');
    },

    /**
     * Obtiene el estado de las notificaciones
     */
    async getNotificationStatus(): Promise<{
        unreadCount: number;
        lastNotification: any;
    }> {
        const response = await api.get('/notifications/status');
        return response.data;
    },

    /**
     * Programa una notificación para un evento futuro
     */
    async scheduleEventNotification(eventId: string, reminderMinutes: number): Promise<void> {
        await api.post('/notifications/schedule', {
            eventId,
            reminderMinutes
        });
    },

    /**
     * Cancela una notificación programada
     */
    async cancelScheduledNotification(eventId: string): Promise<void> {
        await api.delete(`/notifications/schedule/${eventId}`);
    },

    /**
     * Obtiene todas las notificaciones programadas
     */
    async getScheduledNotifications(): Promise<any[]> {
        const response = await api.get('/notifications/scheduled');
        return response.data;
    }
};