import api from './api';

export interface GlobalStats {
    teams: {
        total: number;
        active: number;
        inactive: number;
    };
    players: {
        total: number;
        active: number;
        byPosition: {
            [key: string]: number;
        };
    };
    matches: {
        total: number;
        completed: number;
        upcoming: number;
        totalGoals: number;
        averageGoalsPerMatch: number;
    };
    events: {
        total: number;
        completed: number;
        upcoming: number;
        byType: {
            [key: string]: number;
        };
    };
}

export interface TeamRanking {
    teamId: string;
    teamName: string;
    matches: number;
    points: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
}

export interface PlayerRanking {
    playerId: string;
    playerName: string;
    teamId: string;
    teamName: string;
    matches: number;
    goals: number;
    assists: number;
    minutesPlayed: number;
}

export const sharedStatsService = {
    /**
     * Obtiene estadísticas globales
     */
    async getGlobalStats(): Promise<GlobalStats> {
        const response = await api.get('/stats/global');
        return response.data;
    },

    /**
     * Obtiene la clasificación de equipos
     */
    async getTeamRankings(filters?: {
        startDate?: Date;
        endDate?: Date;
        category?: string;
    }): Promise<TeamRanking[]> {
        const response = await api.get('/stats/team-rankings', {
            params: {
                ...filters,
                startDate: filters?.startDate?.toISOString(),
                endDate: filters?.endDate?.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Obtiene el ranking de jugadores
     */
    async getPlayerRankings(filters?: {
        startDate?: Date;
        endDate?: Date;
        category?: string;
        teamId?: string;
        sortBy?: 'goals' | 'assists' | 'minutes';
    }): Promise<PlayerRanking[]> {
        const response = await api.get('/stats/player-rankings', {
            params: {
                ...filters,
                startDate: filters?.startDate?.toISOString(),
                endDate: filters?.endDate?.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Genera un reporte completo
     */
    async generateReport(options: {
        startDate: Date;
        endDate: Date;
        includeTeams?: boolean;
        includePlayers?: boolean;
        includeMatches?: boolean;
        includeEvents?: boolean;
        format: 'pdf' | 'excel';
    }): Promise<Blob> {
        const response = await api.post('/stats/report', {
            ...options,
            startDate: options.startDate.toISOString(),
            endDate: options.endDate.toISOString()
        }, {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Obtiene estadísticas de asistencia global
     */
    async getAttendanceStats(filters?: {
        startDate?: Date;
        endDate?: Date;
        teamId?: string;
    }): Promise<{
        totalEvents: number;
        averageAttendance: number;
        byTeam: {
            teamId: string;
            teamName: string;
            averageAttendance: number;
            totalEvents: number;
        }[];
    }> {
        const response = await api.get('/stats/attendance', {
            params: {
                ...filters,
                startDate: filters?.startDate?.toISOString(),
                endDate: filters?.endDate?.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Obtiene estadísticas de rendimiento por categoría
     */
    async getCategoryStats(filters?: {
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        categoryId: string;
        categoryName: string;
        teams: number;
        players: number;
        matches: number;
        averageGoalsPerMatch: number;
        topTeam: {
            teamId: string;
            teamName: string;
            points: number;
        };
        topScorer: {
            playerId: string;
            playerName: string;
            goals: number;
        };
    }[]> {
        const response = await api.get('/stats/categories', {
            params: {
                ...filters,
                startDate: filters?.startDate?.toISOString(),
                endDate: filters?.endDate?.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Obtiene tendencias y comparativas
     */
    async getTrends(period: {
        startDate: Date;
        endDate: Date;
        interval: 'day' | 'week' | 'month';
    }): Promise<{
        timestamps: string[];
        metrics: {
            name: string;
            data: number[];
        }[];
    }> {
        const response = await api.get('/stats/trends', {
            params: {
                startDate: period.startDate.toISOString(),
                endDate: period.endDate.toISOString(),
                interval: period.interval
            }
        });
        return response.data;
    },

    /**
     * Obtiene predicciones basadas en datos históricos
     */
    async getPredictions(teamId: string): Promise<{
        nextMatch: {
            opponent: string;
            winProbability: number;
            predictedScore: {
                home: number;
                away: number;
            };
        };
        seasonProjection: {
            predictedPosition: number;
            predictedPoints: number;
            winProbability: number;
            drawProbability: number;
            lossProbability: number;
        };
    }> {
        const response = await api.get(`/stats/predictions/${teamId}`);
        return response.data;
    },

    /**
     * Obtiene análisis de rendimiento avanzado
     */
    async getAdvancedAnalysis(teamId: string, period: {
        startDate: Date;
        endDate: Date;
    }): Promise<{
        possession: {
            average: number;
            byZone: {
                [key: string]: number;
            };
            trend: number[];
        };
        passes: {
            total: number;
            completed: number;
            byZone: {
                [key: string]: {
                    attempted: number;
                    completed: number;
                };
            };
        };
        shots: {
            total: number;
            onTarget: number;
            byZone: {
                [key: string]: {
                    attempted: number;
                    goals: number;
                };
            };
        };
        heatmaps: {
            [playerId: string]: {
                positions: [number, number][];
                intensity: number[];
            };
        };
    }> {
        const response = await api.get(`/stats/advanced/${teamId}`, {
            params: {
                startDate: period.startDate.toISOString(),
                endDate: period.endDate.toISOString()
            }
        });
        return response.data;
    }
};