import api from './api';

export interface MatchPrediction {
    matchId: string;
    homeTeam: {
        id: string;
        name: string;
        winProbability: number;
        predictedGoals: number;
    };
    awayTeam: {
        id: string;
        name: string;
        winProbability: number;
        predictedGoals: number;
    };
    drawProbability: number;
    confidence: number;
    factors: {
        name: string;
        weight: number;
        description: string;
    }[];
}

export interface SeasonPrediction {
    teamId: string;
    predictedPosition: number;
    predictedPoints: number;
    remainingMatches: number;
    predictions: {
        metric: string;
        value: number;
        confidence: number;
    }[];
    trends: {
        metric: string;
        current: number;
        predicted: number;
        change: number;
    }[];
}

export interface PlayerPrediction {
    playerId: string;
    predictions: {
        metric: string;
        nextMatch: number;
        season: number;
        confidence: number;
    }[];
    improvement: {
        area: string;
        current: number;
        potential: number;
        recommendations: string[];
    }[];
}

export const sharedPredictionService = {
    /**
     * Predice el resultado de un partido
     */
    async predictMatch(matchId: string): Promise<MatchPrediction> {
        const response = await api.get(`/predictions/matches/${matchId}`);
        return response.data;
    },

    /**
     * Predice los resultados de múltiples partidos
     */
    async predictMatches(matchIds: string[]): Promise<MatchPrediction[]> {
        const response = await api.post('/predictions/matches', { matchIds });
        return response.data;
    },

    /**
     * Predice el rendimiento de un equipo en la temporada
     */
    async predictSeason(teamId: string): Promise<SeasonPrediction> {
        const response = await api.get(`/predictions/season/${teamId}`);
        return response.data;
    },

    /**
     * Predice el rendimiento de un jugador
     */
    async predictPlayer(playerId: string): Promise<PlayerPrediction> {
        const response = await api.get(`/predictions/players/${playerId}`);
        return response.data;
    },

    /**
     * Predice el rendimiento de múltiples jugadores
     */
    async predictPlayers(playerIds: string[]): Promise<PlayerPrediction[]> {
        const response = await api.post('/predictions/players', { playerIds });
        return response.data;
    },

    /**
     * Obtiene recomendaciones de alineación
     */
    async getLineupRecommendations(teamId: string, matchId: string): Promise<{
        formation: string;
        players: {
            playerId: string;
            position: string;
            confidence: number;
            reasoning: string[];
        }[];
        alternatives: {
            playerId: string;
            position: string;
            confidence: number;
        }[];
        tacticalSuggestions: string[];
    }> {
        const response = await api.get(`/predictions/lineup`, {
            params: { teamId, matchId }
        });
        return response.data;
    },

    /**
     * Obtiene predicciones de lesiones
     */
    async getInjuryRisk(playerId: string): Promise<{
        overallRisk: number;
        factors: {
            name: string;
            risk: number;
            description: string;
        }[];
        recommendations: string[];
        historicalData: {
            date: string;
            risk: number;
            event?: string;
        }[];
    }> {
        const response = await api.get(`/predictions/injury-risk/${playerId}`);
        return response.data;
    },

    /**
     * Obtiene predicciones de rendimiento por posición
     */
    async getPositionalPerformance(playerId: string): Promise<{
        currentPosition: string;
        ratings: {
            position: string;
            rating: number;
            confidence: number;
            strengths: string[];
            weaknesses: string[];
        }[];
        recommendations: {
            position: string;
            reasoning: string[];
            developmentAreas: string[];
        }[];
    }> {
        const response = await api.get(`/predictions/positional/${playerId}`);
        return response.data;
    },

    /**
     * Obtiene predicciones de desarrollo de jugador
     */
    async getPlayerDevelopment(playerId: string): Promise<{
        currentLevel: number;
        potentialLevel: number;
        timeToReach: {
            level: number;
            months: number;
            requirements: string[];
        }[];
        developmentPath: {
            phase: string;
            duration: number;
            focus: string[];
            expectedImprovements: {
                skill: string;
                increase: number;
            }[];
        }[];
        recommendations: {
            training: string[];
            lifestyle: string[];
            tactical: string[];
        };
    }> {
        const response = await api.get(`/predictions/development/${playerId}`);
        return response.data;
    },

    /**
     * Obtiene predicciones de compatibilidad entre jugadores
     */
    async getPlayerCompatibility(playerIds: string[]): Promise<{
        overallRating: number;
        combinations: {
            players: string[];
            rating: number;
            synergies: string[];
            challenges: string[];
        }[];
        recommendations: {
            tactical: string[];
            training: string[];
        };
    }> {
        const response = await api.post('/predictions/compatibility', { playerIds });
        return response.data;
    },

    /**
     * Obtiene predicciones de fatiga y recuperación
     */
    async getFatigueAnalysis(playerId: string): Promise<{
        currentFatigue: number;
        recoveryTime: number;
        riskFactors: {
            name: string;
            impact: number;
            mitigation: string[];
        }[];
        schedule: {
            date: string;
            activity: string;
            intensity: number;
            recommendation: string;
        }[];
    }> {
        const response = await api.get(`/predictions/fatigue/${playerId}`);
        return response.data;
    }
};