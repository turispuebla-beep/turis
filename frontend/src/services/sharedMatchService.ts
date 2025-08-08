import api from './api';
import { Match } from '../types/team';

export interface MatchFilters {
    search?: string;
    teamId?: string;
    status?: 'upcoming' | 'completed' | 'cancelled';
    competition?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy?: 'date' | 'competition' | 'team';
    sortOrder?: 'asc' | 'desc';
}

export interface MatchStats {
    possession: number;
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
    offsides: number;
}

export interface MatchEvent {
    id: string;
    matchId: string;
    type: 'goal' | 'yellowCard' | 'redCard' | 'substitution' | 'injury';
    minute: number;
    playerId: string;
    additionalInfo?: {
        assistedBy?: string;
        replacedBy?: string;
        injuryType?: string;
    };
}

export interface LineupPlayer {
    playerId: string;
    position: string;
    number: number;
    isCaptain: boolean;
    status: 'starting' | 'substitute' | 'notSelected';
}

export const sharedMatchService = {
    /**
     * Obtiene todos los partidos
     */
    async getMatches(filters?: MatchFilters): Promise<Match[]> {
        const response = await api.get('/matches', {
            params: {
                ...filters,
                startDate: filters?.startDate?.toISOString(),
                endDate: filters?.endDate?.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Obtiene un partido por ID
     */
    async getMatchById(matchId: string): Promise<Match> {
        const response = await api.get(`/matches/${matchId}`);
        return response.data;
    },

    /**
     * Crea un nuevo partido
     */
    async createMatch(match: Omit<Match, 'id'>): Promise<Match> {
        const response = await api.post('/matches', match);
        return response.data;
    },

    /**
     * Actualiza un partido existente
     */
    async updateMatch(matchId: string, match: Partial<Match>): Promise<Match> {
        const response = await api.put(`/matches/${matchId}`, match);
        return response.data;
    },

    /**
     * Elimina un partido
     */
    async deleteMatch(matchId: string): Promise<void> {
        await api.delete(`/matches/${matchId}`);
    },

    /**
     * Obtiene las estadísticas de un partido
     */
    async getMatchStats(matchId: string): Promise<{
        home: MatchStats;
        away: MatchStats;
    }> {
        const response = await api.get(`/matches/${matchId}/stats`);
        return response.data;
    },

    /**
     * Actualiza las estadísticas de un partido
     */
    async updateMatchStats(matchId: string, stats: {
        home: Partial<MatchStats>;
        away: Partial<MatchStats>;
    }): Promise<{
        home: MatchStats;
        away: MatchStats;
    }> {
        const response = await api.put(`/matches/${matchId}/stats`, stats);
        return response.data;
    },

    /**
     * Obtiene los eventos de un partido
     */
    async getMatchEvents(matchId: string): Promise<MatchEvent[]> {
        const response = await api.get(`/matches/${matchId}/events`);
        return response.data;
    },

    /**
     * Añade un evento al partido
     */
    async addMatchEvent(matchId: string, event: Omit<MatchEvent, 'id' | 'matchId'>): Promise<MatchEvent> {
        const response = await api.post(`/matches/${matchId}/events`, event);
        return response.data;
    },

    /**
     * Elimina un evento del partido
     */
    async removeMatchEvent(matchId: string, eventId: string): Promise<void> {
        await api.delete(`/matches/${matchId}/events/${eventId}`);
    },

    /**
     * Obtiene la alineación de un partido
     */
    async getLineup(matchId: string): Promise<{
        home: LineupPlayer[];
        away: LineupPlayer[];
    }> {
        const response = await api.get(`/matches/${matchId}/lineup`);
        return response.data;
    },

    /**
     * Actualiza la alineación de un partido
     */
    async updateLineup(matchId: string, lineup: {
        home: LineupPlayer[];
        away: LineupPlayer[];
    }): Promise<{
        home: LineupPlayer[];
        away: LineupPlayer[];
    }> {
        const response = await api.put(`/matches/${matchId}/lineup`, lineup);
        return response.data;
    },

    /**
     * Finaliza un partido
     */
    async finishMatch(matchId: string, finalScore: {
        home: number;
        away: number;
    }): Promise<Match> {
        const response = await api.post(`/matches/${matchId}/finish`, finalScore);
        return response.data;
    },

    /**
     * Cancela un partido
     */
    async cancelMatch(matchId: string, reason?: string): Promise<Match> {
        const response = await api.post(`/matches/${matchId}/cancel`, { reason });
        return response.data;
    },

    /**
     * Reprograma un partido
     */
    async rescheduleMatch(matchId: string, newDate: Date): Promise<Match> {
        const response = await api.post(`/matches/${matchId}/reschedule`, {
            newDate: newDate.toISOString()
        });
        return response.data;
    },

    /**
     * Genera un reporte del partido
     */
    async generateMatchReport(matchId: string): Promise<Blob> {
        const response = await api.get(`/matches/${matchId}/report`, {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Obtiene estadísticas de rendimiento del equipo
     */
    async getTeamPerformance(teamId: string, period: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        matches: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
        cleanSheets: number;
        averagePossession: number;
        form: ('W' | 'D' | 'L')[];
    }> {
        const response = await api.get(`/matches/team-performance/${teamId}`, {
            params: {
                startDate: period.startDate.toISOString(),
                endDate: period.endDate.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Obtiene estadísticas de jugadores en partidos
     */
    async getPlayerStats(teamId: string, period?: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        playerId: string;
        matches: number;
        starts: number;
        minutesPlayed: number;
        goals: number;
        assists: number;
        yellowCards: number;
        redCards: number;
        cleanSheets: number;
    }[]> {
        const response = await api.get(`/matches/player-stats/${teamId}`, {
            params: {
                startDate: period?.startDate?.toISOString(),
                endDate: period?.endDate?.toISOString()
            }
        });
        return response.data;
    }
};