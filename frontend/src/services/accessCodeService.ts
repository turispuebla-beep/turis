import api from './api';
import { TeamAccess, UserRole } from '../types/auth';

export interface AccessCode {
    code: string;
    teamId: string;
    role: UserRole;
    createdBy: string;
    createdAt: string;
    expiresAt: string;
    maxUses: number;
    usedCount: number;
    isActive: boolean;
}

export interface GenerateCodeOptions {
    teamId: string;
    role: UserRole;
    expiresIn?: number; // En días
    maxUses?: number;
}

export const accessCodeService = {
    /**
     * Genera un nuevo código de acceso para un equipo
     */
    async generateCode(options: GenerateCodeOptions): Promise<AccessCode> {
        const response = await api.post('/access-codes/generate', options);
        return response.data;
    },

    /**
     * Verifica si un código de acceso es válido
     */
    async verifyCode(code: string): Promise<{
        isValid: boolean;
        teamAccess?: TeamAccess;
        error?: string;
    }> {
        const response = await api.post('/access-codes/verify', { code });
        return response.data;
    },

    /**
     * Obtiene todos los códigos de acceso activos para un equipo
     */
    async getTeamCodes(teamId: string): Promise<AccessCode[]> {
        const response = await api.get(`/access-codes/team/${teamId}`);
        return response.data;
    },

    /**
     * Revoca un código de acceso
     */
    async revokeCode(code: string): Promise<void> {
        await api.post(`/access-codes/revoke`, { code });
    },

    /**
     * Obtiene el historial de uso de un código
     */
    async getCodeUsageHistory(code: string): Promise<{
        userId: string;
        userName: string;
        usedAt: string;
    }[]> {
        const response = await api.get(`/access-codes/${code}/history`);
        return response.data;
    },

    /**
     * Genera un código de acceso temporal para un usuario específico
     */
    async generateTemporaryCode(options: GenerateCodeOptions & {
        userId: string;
        duration: number; // En horas
    }): Promise<AccessCode> {
        const response = await api.post('/access-codes/temporary', options);
        return response.data;
    },

    /**
     * Obtiene los códigos generados por un administrador
     */
    async getGeneratedCodes(): Promise<AccessCode[]> {
        const response = await api.get('/access-codes/generated');
        return response.data;
    }
};