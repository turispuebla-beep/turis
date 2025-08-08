import api from './api';
import type { SecondaryAdminPermission, SecondaryAdminConfig } from '../types/adminPermissions';

export const secondaryAdminService = {
    /**
     * Verifica si un administrador tiene un permiso específico
     */
    async hasPermission(
        adminId: string,
        teamId: string,
        permission: SecondaryAdminPermission
    ): Promise<boolean> {
        const response = await api.post('/admin/check-permission', {
            adminId,
            teamId,
            permission
        });
        return response.data.hasPermission;
    },

    /**
     * Verifica si una acción requiere aprobación
     */
    async requiresApproval(
        adminId: string,
        teamId: string,
        action: string
    ): Promise<{
        requiresApproval: boolean;
        reason?: string;
    }> {
        const response = await api.post('/admin/check-approval', {
            adminId,
            teamId,
            action
        });
        return response.data;
    },

    /**
     * Obtiene la configuración de un administrador secundario
     */
    async getAdminConfig(adminId: string, teamId: string): Promise<SecondaryAdminConfig> {
        const response = await api.get(`/admin/${adminId}/teams/${teamId}/config`);
        return response.data;
    },

    /**
     * Actualiza los permisos de un administrador secundario
     */
    async updatePermissions(
        adminId: string,
        teamId: string,
        permissions: SecondaryAdminPermission[]
    ): Promise<void> {
        await api.put(`/admin/${adminId}/teams/${teamId}/permissions`, {
            permissions
        });
    },

    /**
     * Actualiza las restricciones de un administrador secundario
     */
    async updateRestrictions(
        adminId: string,
        teamId: string,
        restrictions: SecondaryAdminConfig['restrictions']
    ): Promise<void> {
        await api.put(`/admin/${adminId}/teams/${teamId}/restrictions`, {
            restrictions
        });
    },

    /**
     * Obtiene el registro de acciones de un administrador
     */
    async getActionLog(
        adminId: string,
        teamId: string,
        filters?: {
            startDate?: string;
            endDate?: string;
            actions?: string[];
            status?: 'pending' | 'approved' | 'rejected';
        }
    ): Promise<{
        timestamp: string;
        action: string;
        details: any;
        status: 'pending' | 'approved' | 'rejected';
        reviewedBy?: string;
        reviewedAt?: string;
        comments?: string;
    }[]> {
        const response = await api.get(`/admin/${adminId}/teams/${teamId}/logs`, {
            params: filters
        });
        return response.data;
    },

    /**
     * Revisa una acción pendiente
     */
    async reviewAction(
        actionId: string,
        decision: {
            approved: boolean;
            comments?: string;
        }
    ): Promise<void> {
        await api.post(`/admin/actions/${actionId}/review`, decision);
    },

    /**
     * Obtiene las acciones pendientes de revisión
     */
    async getPendingActions(teamId?: string): Promise<{
        id: string;
        adminId: string;
        teamId: string;
        action: string;
        details: any;
        timestamp: string;
        expiresAt: string;
    }[]> {
        const response = await api.get('/admin/actions/pending', {
            params: { teamId }
        });
        return response.data;
    },

    /**
     * Revoca temporalmente los permisos de un administrador
     */
    async suspendAdmin(
        adminId: string,
        teamId: string,
        reason: string,
        duration?: number
    ): Promise<void> {
        await api.post(`/admin/${adminId}/teams/${teamId}/suspend`, {
            reason,
            duration
        });
    },

    /**
     * Restaura los permisos de un administrador
     */
    async restoreAdmin(
        adminId: string,
        teamId: string
    ): Promise<void> {
        await api.post(`/admin/${adminId}/teams/${teamId}/restore`);
    },

    /**
     * Obtiene las métricas de uso de un administrador
     */
    async getAdminMetrics(
        adminId: string,
        teamId: string,
        period: {
            start: string;
            end: string;
        }
    ): Promise<{
        actionsPerformed: number;
        approvalRate: number;
        topActions: {
            action: string;
            count: number;
        }[];
        activeHours: {
            hour: number;
            count: number;
        }[];
        featureUsage: {
            feature: string;
            usage: number;
        }[];
    }> {
        const response = await api.get(`/admin/${adminId}/teams/${teamId}/metrics`, {
            params: period
        });
        return response.data;
    },

    /**
     * Configura notificaciones para acciones específicas
     */
    async configureActionNotifications(
        adminId: string,
        teamId: string,
        config: {
            action: string;
            notifyOn: ('create' | 'update' | 'delete')[];
            notifyVia: ('email' | 'push' | 'in_app')[];
        }[]
    ): Promise<void> {
        await api.put(`/admin/${adminId}/teams/${teamId}/notifications`, {
            config
        });
    },

    /**
     * Obtiene el resumen de actividad de todos los administradores
     */
    async getActivitySummary(teamId?: string): Promise<{
        adminId: string;
        name: string;
        teamId: string;
        lastActive: string;
        pendingActions: number;
        recentChanges: number;
        status: 'active' | 'suspended' | 'inactive';
    }[]> {
        const response = await api.get('/admin/activity', {
            params: { teamId }
        });
        return response.data;
    }
};