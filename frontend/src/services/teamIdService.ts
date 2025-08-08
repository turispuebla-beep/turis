import api from './api';
import { SUPER_ADMIN_EMAIL } from '../types/auth';

interface TeamIdentifier {
    id: string;           // ID único del equipo
    urlSegment: string;   // Segmento de URL personalizado
    createdBy: string;    // Email del super admin
    createdAt: string;    // Fecha de creación
    status: 'active' | 'inactive';
    accessCode: string;   // Código para el administrador secundario
}

export const teamIdService = {
    /**
     * Genera un nuevo ID de equipo (solo super admin)
     */
    async generateTeamId(data: {
        teamName: string;
        category: string;
        adminEmail: string;  // Email del futuro admin secundario
    }): Promise<TeamIdentifier> {
        // Verificar que es el super admin
        const currentUser = localStorage.getItem('userEmail');
        if (currentUser !== SUPER_ADMIN_EMAIL) {
            throw new Error('Solo el administrador principal puede generar IDs de equipo');
        }

        const response = await api.post('/teams/generate-id', {
            ...data,
            createdBy: SUPER_ADMIN_EMAIL
        });

        return response.data;
    },

    /**
     * Verifica si un ID de equipo es válido
     */
    async verifyTeamId(teamId: string): Promise<{
        valid: boolean;
        teamInfo?: {
            name: string;
            category: string;
            url: string;
        };
    }> {
        const response = await api.get(`/teams/verify-id/${teamId}`);
        return response.data;
    },

    /**
     * Obtiene todos los IDs generados (solo super admin)
     */
    async getAllTeamIds(): Promise<TeamIdentifier[]> {
        const currentUser = localStorage.getItem('userEmail');
        if (currentUser !== SUPER_ADMIN_EMAIL) {
            throw new Error('Acceso no autorizado');
        }

        const response = await api.get('/teams/all-ids');
        return response.data;
    },

    /**
     * Revoca un ID de equipo (solo super admin)
     */
    async revokeTeamId(teamId: string, reason: string): Promise<void> {
        const currentUser = localStorage.getItem('userEmail');
        if (currentUser !== SUPER_ADMIN_EMAIL) {
            throw new Error('Solo el administrador principal puede revocar IDs');
        }

        await api.post(`/teams/revoke-id/${teamId}`, { reason });
    },

    /**
     * Genera una URL personalizada para un equipo
     */
    async generateCustomUrl(teamId: string, urlSegment: string): Promise<string> {
        const response = await api.post(`/teams/${teamId}/custom-url`, {
            urlSegment
        });
        return response.data.url;
    },

    /**
     * Obtiene el historial de cambios de un ID
     */
    async getIdHistory(teamId: string): Promise<{
        timestamp: string;
        action: 'created' | 'modified' | 'revoked';
        performedBy: string;
        details: any;
    }[]> {
        const response = await api.get(`/teams/${teamId}/id-history`);
        return response.data;
    },

    /**
     * Genera un nuevo código de acceso para un administrador secundario
     */
    async generateNewAccessCode(teamId: string): Promise<{
        accessCode: string;
        expiresAt: string;
    }> {
        const currentUser = localStorage.getItem('userEmail');
        if (currentUser !== SUPER_ADMIN_EMAIL) {
            throw new Error('Solo el administrador principal puede generar códigos de acceso');
        }

        const response = await api.post(`/teams/${teamId}/generate-access-code`);
        return response.data;
    },

    /**
     * Obtiene estadísticas de uso de IDs
     */
    async getIdStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byCategory: {
            category: string;
            count: number;
        }[];
        recentActivity: {
            timestamp: string;
            action: string;
            teamId: string;
        }[];
    }> {
        const response = await api.get('/teams/id-stats');
        return response.data;
    }
};