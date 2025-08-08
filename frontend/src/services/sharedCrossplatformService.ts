import api from './api';
import type { 
    NotificationPermission, 
    NotificationPreferences,
    NotificationTemplate,
    ScheduledNotification 
} from '../types/notification';

/**
 * Servicio compartido para sincronización entre web y app Android
 */
export const sharedCrossplatformService = {
    /**
     * Sincroniza las notificaciones entre dispositivos
     */
    async syncNotifications(deviceId: string, lastSyncTimestamp: number): Promise<{
        notifications: ScheduledNotification[];
        templates: NotificationTemplate[];
        permissions: NotificationPreferences[];
        timestamp: number;
    }> {
        const response = await api.post('/sync/notifications', {
            deviceId,
            lastSyncTimestamp
        });
        return response.data;
    },

    /**
     * Registra un nuevo dispositivo
     */
    async registerDevice(data: {
        deviceId: string;
        platform: 'web' | 'android';
        pushToken?: string;
        model?: string;
    }): Promise<{
        deviceId: string;
        syncToken: string;
    }> {
        const response = await api.post('/devices/register', data);
        return response.data;
    },

    /**
     * Actualiza el token de notificaciones push
     */
    async updatePushToken(deviceId: string, token: string): Promise<void> {
        await api.put(`/devices/${deviceId}/push-token`, { token });
    },

    /**
     * Obtiene el estado de las notificaciones en todos los dispositivos
     */
    async getDeviceNotificationStatus(userId: string): Promise<{
        deviceId: string;
        platform: 'web' | 'android';
        lastSync: number;
        pushEnabled: boolean;
        unreadCount: number;
    }[]> {
        const response = await api.get(`/users/${userId}/devices/notifications`);
        return response.data;
    },

    /**
     * Sincroniza las preferencias entre dispositivos
     */
    async syncPreferences(deviceId: string): Promise<{
        notifications: {
            enabled: boolean;
            types: Record<string, boolean>;
            quietHours: {
                enabled: boolean;
                start: string;
                end: string;
            };
        };
        display: {
            theme: 'light' | 'dark' | 'system';
            language: string;
            fontSize: number;
        };
        sync: {
            autoSync: boolean;
            syncInterval: number;
            syncOnWifiOnly: boolean;
            lastSync: number;
        };
    }> {
        const response = await api.get(`/devices/${deviceId}/preferences`);
        return response.data;
    },

    /**
     * Actualiza las preferencias en todos los dispositivos
     */
    async updatePreferences(userId: string, preferences: {
        notifications?: {
            enabled?: boolean;
            types?: Record<string, boolean>;
            quietHours?: {
                enabled: boolean;
                start: string;
                end: string;
            };
        };
        display?: {
            theme?: 'light' | 'dark' | 'system';
            language?: string;
            fontSize?: number;
        };
        sync?: {
            autoSync?: boolean;
            syncInterval?: number;
            syncOnWifiOnly?: boolean;
        };
    }): Promise<void> {
        await api.put(`/users/${userId}/preferences`, preferences);
    },

    /**
     * Obtiene el estado de sincronización
     */
    async getSyncStatus(deviceId: string): Promise<{
        lastSuccessfulSync: number;
        pendingChanges: boolean;
        syncErrors: {
            timestamp: number;
            error: string;
        }[];
        nextScheduledSync: number;
    }> {
        const response = await api.get(`/devices/${deviceId}/sync/status`);
        return response.data;
    },

    /**
     * Resuelve conflictos de sincronización
     */
    async resolveSyncConflicts(deviceId: string, resolutions: {
        entityType: 'notification' | 'template' | 'preference';
        entityId: string;
        resolution: 'local' | 'remote' | 'merge';
        mergedData?: any;
    }[]): Promise<void> {
        await api.post(`/devices/${deviceId}/sync/resolve`, { resolutions });
    },

    /**
     * Verifica la compatibilidad de versiones
     */
    async checkVersionCompatibility(data: {
        platform: 'web' | 'android';
        version: string;
        buildNumber: number;
    }): Promise<{
        compatible: boolean;
        minimumRequired: string;
        recommended: string;
        features: {
            name: string;
            supported: boolean;
            fallback?: string;
        }[];
    }> {
        const response = await api.post('/compatibility/check', data);
        return response.data;
    },

    /**
     * Registra eventos de analítica
     */
    async logAnalytics(events: {
        type: string;
        timestamp: number;
        platform: 'web' | 'android';
        deviceId: string;
        data: any;
    }[]): Promise<void> {
        await api.post('/analytics/log', { events });
    },

    /**
     * Obtiene métricas de uso
     */
    async getUsageMetrics(filters: {
        startDate: string;
        endDate: string;
        platform?: 'web' | 'android';
        userId?: string;
    }): Promise<{
        activeUsers: number;
        notificationsSent: number;
        notificationsRead: number;
        averageResponseTime: number;
        platformUsage: {
            web: number;
            android: number;
        };
        topFeatures: {
            name: string;
            usageCount: number;
        }[];
    }> {
        const response = await api.get('/analytics/metrics', { params: filters });
        return response.data;
    }
};