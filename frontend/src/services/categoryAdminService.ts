import api from './api';
import { CATEGORY_CONFIGS, TeamCategory, TeamComponents } from '../types/teamCategories';

export interface CategoryPermissions {
    category: TeamCategory;
    components: Partial<TeamComponents>;
    restrictions: {
        mediaStorage?: {
            photos: number;    // MB permitidos
            videos: number;    // MB permitidos
            documents: number; // MB permitidos
        };
        communication?: {
            maxAnnouncements: number;  // Por día
            maxEmails: number;         // Por día
            maxNotifications: number;  // Por día
        };
        events?: {
            maxConcurrent: number;    // Eventos simultáneos
            maxFuture: number;        // Eventos futuros
            maxDuration: number;      // Horas por evento
        };
    };
}

export const categoryAdminService = {
    /**
     * Obtiene la configuración por defecto de una categoría
     */
    getCategoryConfig(category: TeamCategory): typeof CATEGORY_CONFIGS[TeamCategory] {
        return CATEGORY_CONFIGS[category];
    },

    /**
     * Obtiene los permisos específicos para un administrador en una categoría
     */
    async getCategoryPermissions(
        adminId: string,
        teamId: string
    ): Promise<CategoryPermissions> {
        const response = await api.get(`/admin/${adminId}/teams/${teamId}/category-permissions`);
        return response.data;
    },

    /**
     * Actualiza los permisos de componentes para una categoría
     */
    async updateComponentPermissions(
        adminId: string,
        teamId: string,
        components: Partial<TeamComponents>
    ): Promise<void> {
        await api.put(`/admin/${adminId}/teams/${teamId}/components`, {
            components
        });
    },

    /**
     * Verifica acceso a un componente específico
     */
    async canAccessComponent(
        adminId: string,
        teamId: string,
        component: string,
        action: string
    ): Promise<{
        allowed: boolean;
        reason?: string;
    }> {
        const response = await api.post(`/admin/${adminId}/teams/${teamId}/check-component`, {
            component,
            action
        });
        return response.data;
    },

    /**
     * Obtiene el uso actual de recursos
     */
    async getResourceUsage(
        teamId: string
    ): Promise<{
        storage: {
            photos: number;    // MB usados
            videos: number;    // MB usados
            documents: number; // MB usados
            total: number;     // MB totales
        };
        communication: {
            announcements: number;  // Hoy
            emails: number;         // Hoy
            notifications: number;  // Hoy
        };
        events: {
            concurrent: number;    // Actuales
            future: number;        // Programados
            total: number;         // Total
        };
    }> {
        const response = await api.get(`/teams/${teamId}/resource-usage`);
        return response.data;
    },

    /**
     * Verifica si se puede realizar una acción basada en los límites de recursos
     */
    async canPerformAction(
        teamId: string,
        action: {
            type: 'storage' | 'communication' | 'event';
            resource: string;
            amount: number;
        }
    ): Promise<{
        allowed: boolean;
        remaining?: number;
        resetTime?: string;
    }> {
        const response = await api.post(`/teams/${teamId}/check-limits`, action);
        return response.data;
    },

    /**
     * Obtiene estadísticas de uso por categoría
     */
    async getCategoryStats(
        category: TeamCategory
    ): Promise<{
        teams: number;
        totalPlayers: number;
        activeAdmins: number;
        resourceUsage: {
            storage: number;
            events: number;
            communications: number;
        };
        compliance: {
            documentation: number;
            staffing: number;
            training: number;
        };
    }> {
        const response = await api.get(`/categories/${category}/stats`);
        return response.data;
    },

    /**
     * Obtiene requisitos pendientes para un equipo
     */
    async getPendingRequirements(
        teamId: string
    ): Promise<{
        requirement: string;
        status: 'pending' | 'incomplete' | 'expired';
        dueDate?: string;
        description: string;
    }[]> {
        const response = await api.get(`/teams/${teamId}/requirements`);
        return response.data;
    },

    /**
     * Verifica el cumplimiento de requisitos de la categoría
     */
    async checkCategoryCompliance(
        teamId: string
    ): Promise<{
        compliant: boolean;
        issues: {
            requirement: string;
            current: any;
            expected: any;
            severity: 'low' | 'medium' | 'high';
        }[];
    }> {
        const response = await api.get(`/teams/${teamId}/compliance`);
        return response.data;
    }
};