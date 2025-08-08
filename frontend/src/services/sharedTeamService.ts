import api from './api';
import { mockTeamService } from '../mocks/teamService';
import type { Team, Player, Match, TeamEvent } from '../types/team';

// Durante el desarrollo, usamos el servicio mock
const isDevelopment = process.env.NODE_ENV === 'development';

export interface TeamStats {
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    cleanSheets: number;
    topScorer: {
        player: Player;
        goals: number;
    };
    form: ('W' | 'D' | 'L')[];
}

export interface TeamFilters {
    search?: string;
    category?: string;
    status?: 'active' | 'inactive';
    sortBy?: 'name' | 'created' | 'matches';
    sortOrder?: 'asc' | 'desc';
}

const apiTeamService = {
    /**
     * Obtiene todos los equipos
     */
    async getTeams(filters?: TeamFilters): Promise<Team[]> {
        const response = await api.get('/teams', { params: filters });
        return response.data;
    },

    /**
     * Obtiene un equipo por ID
     */
    async getTeamById(teamId: string): Promise<Team> {
        const response = await api.get(`/teams/${teamId}`);
        return response.data;
    },

    /**
     * Crea un nuevo equipo
     */
    async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
        const response = await api.post('/teams', team);
        return response.data;
    },

    /**
     * Actualiza un equipo existente
     */
    async updateTeam(teamId: string, team: Partial<Team>): Promise<Team> {
        const response = await api.put(`/teams/${teamId}`, team);
        return response.data;
    },

    /**
     * Elimina un equipo
     */
    async deleteTeam(teamId: string): Promise<void> {
        await api.delete(`/teams/${teamId}`);
    },

    /**
     * Obtiene las estadísticas de un equipo
     */
    async getTeamStats(teamId: string): Promise<TeamStats> {
        const response = await api.get(`/teams/${teamId}/stats`);
        return response.data;
    },

    /**
     * Obtiene los jugadores de un equipo
     */
    async getTeamPlayers(teamId: string): Promise<Player[]> {
        const response = await api.get(`/teams/${teamId}/players`);
        return response.data;
    },

    /**
     * Añade un jugador al equipo
     */
    async addPlayer(teamId: string, player: Omit<Player, 'id'>): Promise<Player> {
        const response = await api.post(`/teams/${teamId}/players`, player);
        return response.data;
    },

    /**
     * Actualiza un jugador del equipo
     */
    async updatePlayer(teamId: string, playerId: string, player: Partial<Player>): Promise<Player> {
        const response = await api.put(`/teams/${teamId}/players/${playerId}`, player);
        return response.data;
    },

    /**
     * Elimina un jugador del equipo
     */
    async removePlayer(teamId: string, playerId: string): Promise<void> {
        await api.delete(`/teams/${teamId}/players/${playerId}`);
    },

    /**
     * Obtiene los partidos de un equipo
     */
    async getTeamMatches(teamId: string, filters?: {
        status?: 'upcoming' | 'completed';
        limit?: number;
    }): Promise<Match[]> {
        const response = await api.get(`/teams/${teamId}/matches`, { params: filters });
        return response.data;
    },

    /**
     * Añade un partido al equipo
     */
    async addMatch(teamId: string, match: Omit<Match, 'id'>): Promise<Match> {
        const response = await api.post(`/teams/${teamId}/matches`, match);
        return response.data;
    },

    /**
     * Actualiza un partido del equipo
     */
    async updateMatch(teamId: string, matchId: string, match: Partial<Match>): Promise<Match> {
        const response = await api.put(`/teams/${teamId}/matches/${matchId}`, match);
        return response.data;
    },

    /**
     * Elimina un partido del equipo
     */
    async removeMatch(teamId: string, matchId: string): Promise<void> {
        await api.delete(`/teams/${teamId}/matches/${matchId}`);
    },

    /**
     * Obtiene los eventos de un equipo
     */
    async getTeamEvents(teamId: string, filters?: {
        type?: string;
        status?: 'upcoming' | 'completed';
        limit?: number;
    }): Promise<TeamEvent[]> {
        const response = await api.get(`/teams/${teamId}/events`, { params: filters });
        return response.data;
    },

    /**
     * Añade un evento al equipo
     */
    async addEvent(teamId: string, event: Omit<TeamEvent, 'id'>): Promise<TeamEvent> {
        const response = await api.post(`/teams/${teamId}/events`, event);
        return response.data;
    },

    /**
     * Actualiza un evento del equipo
     */
    async updateEvent(teamId: string, eventId: string, event: Partial<TeamEvent>): Promise<TeamEvent> {
        const response = await api.put(`/teams/${teamId}/events/${eventId}`, event);
        return response.data;
    },

    /**
     * Elimina un evento del equipo
     */
    async removeEvent(teamId: string, eventId: string): Promise<void> {
        await api.delete(`/teams/${teamId}/events/${eventId}`);
    },

    /**
     * Obtiene las estadísticas de los jugadores de un equipo
     */
    async getPlayerStats(teamId: string): Promise<{
        playerId: string;
        matches: number;
        goals: number;
        assists: number;
        yellowCards: number;
        redCards: number;
    }[]> {
        const response = await api.get(`/teams/${teamId}/player-stats`);
        return response.data;
    },

    /**
     * Obtiene el rendimiento del equipo en un período
     */
    async getTeamPerformance(teamId: string, period: {
        start: Date;
        end: Date;
    }): Promise<{
        matches: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
    }> {
        const response = await api.get(`/teams/${teamId}/performance`, {
            params: {
                start: period.start.toISOString(),
                end: period.end.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Exporta los datos del equipo
     */
    async exportTeamData(teamId: string, format: 'pdf' | 'excel'): Promise<Blob> {
        const response = await api.get(`/teams/${teamId}/export`, {
            params: { format },
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Importa datos al equipo
     */
    async importTeamData(teamId: string, file: File): Promise<{
        success: boolean;
        errors?: string[];
        imported: {
            players: number;
            matches: number;
            events: number;
        };
    }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/teams/${teamId}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export const sharedTeamService = isDevelopment ? mockTeamService : apiTeamService;