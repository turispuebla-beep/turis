import api from './api';
import { Team, TeamUpdate } from '../types/team';

export const teamService = {
    // Obtener todos los equipos
    async getAllTeams(): Promise<Team[]> {
        const response = await api.get('/teams');
        return response.data;
    },

    // Obtener un equipo por ID
    async getTeamById(id: string): Promise<Team> {
        const response = await api.get(`/teams/${id}`);
        return response.data;
    },

    // Crear un nuevo equipo
    async createTeam(teamData: TeamUpdate): Promise<Team> {
        const response = await api.post('/teams', teamData);
        return response.data;
    },

    // Actualizar un equipo
    async updateTeam(id: string, teamData: TeamUpdate): Promise<Team> {
        const response = await api.put(`/teams/${id}`, teamData);
        return response.data;
    },

    // Eliminar un equipo
    async deleteTeam(id: string): Promise<void> {
        await api.delete(`/teams/${id}`);
    },

    // Actualizar el logo del equipo
    async updateTeamLogo(id: string, logo: File): Promise<string> {
        const formData = new FormData();
        formData.append('logo', logo);
        const response = await api.put(`/teams/${id}/logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.logoUrl;
    },

    // Gestionar usuarios del equipo
    async addUserToTeam(teamId: string, userId: string, role: string): Promise<void> {
        await api.post(`/teams/${teamId}/users`, { userId, role });
    },

    async removeUserFromTeam(teamId: string, userId: string): Promise<void> {
        await api.delete(`/teams/${teamId}/users/${userId}`);
    },

    async updateUserRole(teamId: string, userId: string, newRole: string): Promise<void> {
        await api.put(`/teams/${teamId}/users/${userId}`, { role: newRole });
    },

    // Gestionar acceso al equipo
    async generateAccessCode(teamId: string): Promise<string> {
        const response = await api.post(`/teams/${teamId}/access-code`);
        return response.data.accessCode;
    },

    async validateAccessCode(accessCode: string): Promise<boolean> {
        try {
            await api.post('/teams/validate-code', { accessCode });
            return true;
        } catch {
            return false;
        }
    }
};