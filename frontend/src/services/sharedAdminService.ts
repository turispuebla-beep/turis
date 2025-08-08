import api from './api';
import { SUPER_ADMIN_EMAIL } from '../types/auth';
import type { UserRole, TeamAccess } from '../types/auth';

export interface AdminAction {
    type: 'create_team' | 'assign_admin' | 'revoke_admin' | 'modify_permissions';
    timestamp: string;
    details: any;
    performedBy: string;
}

export const sharedAdminService = {
    /**
     * Verifica si el usuario es el super administrador
     */
    isSuperAdmin(email: string): boolean {
        return email === SUPER_ADMIN_EMAIL;
    },

    /**
     * Verifica si un usuario tiene permiso para realizar una acción administrativa
     */
    async canPerformAdminAction(email: string, action: string): Promise<boolean> {
        // Solo el super admin puede realizar acciones administrativas
        return this.isSuperAdmin(email);
    },

    /**
     * Registra una acción administrativa
     */
    async logAdminAction(action: AdminAction): Promise<void> {
        await api.post('/admin/logs', action);
    },

    /**
     * Obtiene el historial de acciones administrativas
     */
    async getAdminActionHistory(): Promise<AdminAction[]> {
        const response = await api.get('/admin/logs');
        return response.data;
    },

    /**
     * Asigna un administrador secundario a un equipo
     */
    async assignTeamAdmin(teamId: string, userId: string, permissions: string[]): Promise<void> {
        await api.post(`/admin/teams/${teamId}/admins`, {
            userId,
            permissions
        });
    },

    /**
     * Revoca el acceso de administrador secundario
     */
    async revokeTeamAdmin(teamId: string, userId: string): Promise<void> {
        await api.delete(`/admin/teams/${teamId}/admins/${userId}`);
    },

    /**
     * Modifica los permisos de un administrador secundario
     */
    async modifyAdminPermissions(teamId: string, userId: string, permissions: string[]): Promise<void> {
        await api.put(`/admin/teams/${teamId}/admins/${userId}/permissions`, {
            permissions
        });
    },

    /**
     * Obtiene la lista de administradores secundarios de un equipo
     */
    async getTeamAdmins(teamId: string): Promise<{
        userId: string;
        email: string;
        name: string;
        permissions: string[];
        assignedAt: string;
    }[]> {
        const response = await api.get(`/admin/teams/${teamId}/admins`);
        return response.data;
    },

    /**
     * Obtiene los equipos administrados por un usuario
     */
    async getManagedTeams(userId: string): Promise<TeamAccess[]> {
        const response = await api.get(`/admin/users/${userId}/teams`);
        return response.data;
    },

    /**
     * Verifica si un usuario es administrador de un equipo específico
     */
    async isTeamAdmin(userId: string, teamId: string): Promise<boolean> {
        const response = await api.get(`/admin/teams/${teamId}/admins/${userId}`);
        return response.data.isAdmin;
    },

    /**
     * Obtiene las estadísticas de administración
     */
    async getAdminStats(): Promise<{
        totalTeams: number;
        totalAdmins: number;
        activeTeams: number;
        inactiveTeams: number;
        recentActions: AdminAction[];
    }> {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    /**
     * Obtiene el registro de auditoría
     */
    async getAuditLog(filters?: {
        startDate?: string;
        endDate?: string;
        actionType?: string;
        userId?: string;
        teamId?: string;
    }): Promise<{
        timestamp: string;
        action: string;
        userId: string;
        userName: string;
        details: any;
        ipAddress: string;
        userAgent: string;
    }[]> {
        const response = await api.get('/admin/audit-log', { params: filters });
        return response.data;
    },

    /**
     * Bloquea/desbloquea un equipo
     */
    async toggleTeamStatus(teamId: string, active: boolean): Promise<void> {
        await api.put(`/admin/teams/${teamId}/status`, { active });
    },

    /**
     * Bloquea/desbloquea un administrador secundario
     */
    async toggleAdminStatus(userId: string, active: boolean): Promise<void> {
        await api.put(`/admin/users/${userId}/status`, { active });
    },

    /**
     * Obtiene las notificaciones administrativas
     */
    async getAdminNotifications(): Promise<{
        id: string;
        type: string;
        message: string;
        timestamp: string;
        read: boolean;
        priority: 'high' | 'medium' | 'low';
    }[]> {
        const response = await api.get('/admin/notifications');
        return response.data;
    },

    /**
     * Envía una notificación a los administradores
     */
    async sendAdminNotification(notification: {
        teamId?: string;
        message: string;
        priority: 'high' | 'medium' | 'low';
        recipients: 'all_admins' | 'team_admins' | string[];
    }): Promise<void> {
        await api.post('/admin/notifications', notification);
    }
};