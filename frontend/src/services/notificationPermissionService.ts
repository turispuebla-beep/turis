import api from './api';
import type { 
    NotificationPermission, 
    NotificationPreferences,
    NotificationTemplate,
    ScheduledNotification
} from '../types/notification';

export const notificationPermissionService = {
    /**
     * Obtiene los permisos de notificación de un usuario para un equipo
     */
    async getUserPermissions(teamId: string, userId: string): Promise<NotificationPreferences> {
        const response = await api.get(`/teams/${teamId}/notifications/permissions/${userId}`);
        return response.data;
    },

    /**
     * Actualiza los permisos de notificación de un usuario
     */
    async updateUserPermissions(
        teamId: string,
        userId: string,
        permissions: NotificationPermission[]
    ): Promise<NotificationPreferences> {
        const response = await api.put(`/teams/${teamId}/notifications/permissions/${userId}`, {
            permissions
        });
        return response.data;
    },

    /**
     * Obtiene las plantillas de notificación disponibles para un equipo
     */
    async getTeamTemplates(teamId: string): Promise<NotificationTemplate[]> {
        const response = await api.get(`/teams/${teamId}/notifications/templates`);
        return response.data;
    },

    /**
     * Crea una nueva plantilla de notificación
     */
    async createTemplate(
        teamId: string,
        template: Omit<NotificationTemplate, 'id'>
    ): Promise<NotificationTemplate> {
        const response = await api.post(`/teams/${teamId}/notifications/templates`, template);
        return response.data;
    },

    /**
     * Programa una notificación
     */
    async scheduleNotification(
        teamId: string,
        notification: Omit<ScheduledNotification, 'id' | 'status'>
    ): Promise<ScheduledNotification> {
        const response = await api.post(`/teams/${teamId}/notifications/schedule`, notification);
        return response.data;
    },

    /**
     * Aprueba una notificación programada
     */
    async approveNotification(
        teamId: string,
        notificationId: string
    ): Promise<ScheduledNotification> {
        const response = await api.post(
            `/teams/${teamId}/notifications/${notificationId}/approve`
        );
        return response.data;
    },

    /**
     * Rechaza una notificación programada
     */
    async rejectNotification(
        teamId: string,
        notificationId: string,
        reason: string
    ): Promise<void> {
        await api.post(`/teams/${teamId}/notifications/${notificationId}/reject`, {
            reason
        });
    },

    /**
     * Obtiene las notificaciones pendientes de aprobación
     */
    async getPendingApprovals(teamId: string): Promise<ScheduledNotification[]> {
        const response = await api.get(`/teams/${teamId}/notifications/pending-approvals`);
        return response.data;
    },

    /**
     * Obtiene el historial de notificaciones enviadas
     */
    async getNotificationHistory(
        teamId: string,
        filters?: {
            startDate?: string;
            endDate?: string;
            type?: string;
            sender?: string;
        }
    ): Promise<ScheduledNotification[]> {
        const response = await api.get(`/teams/${teamId}/notifications/history`, {
            params: filters
        });
        return response.data;
    },

    /**
     * Obtiene las estadísticas de notificaciones
     */
    async getNotificationStats(teamId: string): Promise<{
        totalSent: number;
        byType: Record<string, number>;
        bySender: Record<string, number>;
        deliveryRate: number;
        engagementRate: number;
    }> {
        const response = await api.get(`/teams/${teamId}/notifications/stats`);
        return response.data;
    },

    /**
     * Actualiza las restricciones de notificaciones
     */
    async updateNotificationRestrictions(
        teamId: string,
        userId: string,
        restrictions: NotificationPreferences['restrictions']
    ): Promise<NotificationPreferences> {
        const response = await api.put(
            `/teams/${teamId}/notifications/restrictions/${userId}`,
            restrictions
        );
        return response.data;
    },

    /**
     * Verifica si un usuario puede enviar una notificación específica
     */
    async canSendNotification(
        teamId: string,
        userId: string,
        type: string,
        scope: string
    ): Promise<{
        allowed: boolean;
        reason?: string;
        requiresApproval?: boolean;
    }> {
        const response = await api.post(`/teams/${teamId}/notifications/check-permission`, {
            userId,
            type,
            scope
        });
        return response.data;
    }
};