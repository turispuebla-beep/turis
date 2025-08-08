import { mockTeams } from './teams';
import { Team, Player, Match, TeamEvent } from '../types/team';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Datos mock adicionales
const mockPlayers: Record<string, Player[]> = {
    '1': [
        {
            id: '1',
            name: 'Juan Pérez',
            number: 10,
            position: 'Delantero',
            birthDate: '1995-05-15',
            nationality: 'España',
            status: 'active',
            joinDate: '2020-01-01'
        },
        {
            id: '2',
            name: 'Carlos García',
            number: 1,
            position: 'Portero',
            birthDate: '1990-03-20',
            nationality: 'España',
            status: 'active',
            joinDate: '2020-01-01'
        }
    ]
};

const mockMatches: Record<string, Match[]> = {
    '1': [
        {
            id: '1',
            date: '2024-02-15',
            competition: 'Liga Local',
            homeTeam: 'Real Turismo CF',
            awayTeam: 'Atlético Viajero',
            venue: 'Estadio Municipal',
            status: 'scheduled'
        },
        {
            id: '2',
            date: '2024-01-30',
            competition: 'Copa Regional',
            homeTeam: 'Real Turismo CF',
            awayTeam: 'Deportivo Mochilero',
            homeScore: 2,
            awayScore: 1,
            venue: 'Estadio Municipal',
            status: 'completed'
        }
    ]
};

const mockEvents: Record<string, TeamEvent[]> = {
    '1': [
        {
            id: '1',
            title: 'Entrenamiento Semanal',
            description: 'Entrenamiento táctico y físico',
            type: 'training',
            date: '2024-02-10',
            location: 'Campo de Entrenamiento',
            duration: 120,
            status: 'scheduled',
            mandatory: true
        },
        {
            id: '2',
            title: 'Reunión de Equipo',
            description: 'Análisis del último partido',
            type: 'meeting',
            date: '2024-02-12',
            location: 'Sala de Reuniones',
            duration: 60,
            status: 'scheduled',
            mandatory: true
        }
    ]
};

export const mockTeamService = {
    /**
     * Obtiene todos los equipos
     */
    async getTeams(filters?: {
        search?: string;
        category?: string;
        status?: 'active' | 'inactive';
        sortBy?: 'name' | 'created' | 'matches';
        sortOrder?: 'asc' | 'desc';
    }): Promise<Team[]> {
        await delay(500);

        let teams = [...mockTeams];

        // Aplicar filtros
        if (filters?.search) {
            teams = teams.filter(team => 
                team.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
                team.city.toLowerCase().includes(filters.search!.toLowerCase())
            );
        }

        if (filters?.category) {
            teams = teams.filter(team => team.category === filters.category);
        }

        if (filters?.status) {
            teams = teams.filter(team => team.status === filters.status);
        }

        // Aplicar ordenamiento
        if (filters?.sortBy) {
            teams.sort((a, b) => {
                let comparison = 0;
                switch (filters.sortBy) {
                    case 'name':
                        comparison = a.name.localeCompare(b.name);
                        break;
                    case 'created':
                        comparison = a.foundedYear - b.foundedYear;
                        break;
                    // Otros casos de ordenamiento
                }
                return filters.sortOrder === 'desc' ? -comparison : comparison;
            });
        }

        return teams;
    },

    /**
     * Obtiene un equipo por ID
     */
    async getTeamById(teamId: string): Promise<Team> {
        await delay(300);

        const team = mockTeams.find(t => t.id === teamId);
        if (!team) {
            throw new Error('Equipo no encontrado');
        }

        return team;
    },

    /**
     * Obtiene los jugadores de un equipo
     */
    async getTeamPlayers(teamId: string): Promise<Player[]> {
        await delay(300);
        return mockPlayers[teamId] || [];
    },

    /**
     * Obtiene los partidos de un equipo
     */
    async getTeamMatches(teamId: string, filters?: {
        status?: 'upcoming' | 'completed';
        limit?: number;
    }): Promise<Match[]> {
        await delay(300);
        let matches = mockMatches[teamId] || [];

        if (filters?.status) {
            matches = matches.filter(m => {
                if (filters.status === 'upcoming') {
                    return m.status === 'scheduled';
                }
                return m.status === 'completed';
            });
        }

        if (filters?.limit) {
            matches = matches.slice(0, filters.limit);
        }

        return matches;
    },

    /**
     * Obtiene los eventos de un equipo
     */
    async getTeamEvents(teamId: string, filters?: {
        type?: string;
        status?: 'upcoming' | 'completed';
        limit?: number;
    }): Promise<TeamEvent[]> {
        await delay(300);
        let events = mockEvents[teamId] || [];

        if (filters?.type) {
            events = events.filter(e => e.type === filters.type);
        }

        if (filters?.status) {
            events = events.filter(e => {
                if (filters.status === 'upcoming') {
                    return e.status === 'scheduled';
                }
                return e.status === 'completed';
            });
        }

        if (filters?.limit) {
            events = events.slice(0, filters.limit);
        }

        return events;
    },

    /**
     * Crea un nuevo equipo
     */
    async createTeam(team: Omit<Team, 'id'>): Promise<Team> {
        await delay(800);

        // Validar nombre único
        if (mockTeams.some(t => t.name.toLowerCase() === team.name.toLowerCase())) {
            throw new Error('Ya existe un equipo con ese nombre');
        }

        const newTeam = {
            ...team,
            id: String(mockTeams.length + 1)
        };

        mockTeams.push(newTeam);

        return newTeam;
    },

    /**
     * Actualiza un equipo existente
     */
    async updateTeam(teamId: string, team: Partial<Team>): Promise<Team> {
        await delay(500);

        const index = mockTeams.findIndex(t => t.id === teamId);
        if (index === -1) {
            throw new Error('Equipo no encontrado');
        }

        // Validar nombre único si se está actualizando
        if (team.name && mockTeams.some(t => 
            t.id !== teamId && 
            t.name.toLowerCase() === team.name.toLowerCase()
        )) {
            throw new Error('Ya existe un equipo con ese nombre');
        }

        const updatedTeam = {
            ...mockTeams[index],
            ...team
        };

        mockTeams[index] = updatedTeam;

        return updatedTeam;
    },

    /**
     * Elimina un equipo
     */
    async deleteTeam(teamId: string): Promise<void> {
        await delay(500);

        const index = mockTeams.findIndex(t => t.id === teamId);
        if (index === -1) {
            throw new Error('Equipo no encontrado');
        }

        mockTeams.splice(index, 1);
    },

    /**
     * Obtiene las estadísticas de un equipo
     */
    async getTeamStats(teamId: string): Promise<{
        totalMatches: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
        cleanSheets: number;
        topScorer: {
            name: string;
            goals: number;
        };
        form: ('W' | 'D' | 'L')[];
    }> {
        await delay(500);

        // Generar estadísticas aleatorias para pruebas
        return {
            totalMatches: Math.floor(Math.random() * 30) + 10,
            wins: Math.floor(Math.random() * 15),
            draws: Math.floor(Math.random() * 8),
            losses: Math.floor(Math.random() * 7),
            goalsFor: Math.floor(Math.random() * 40) + 10,
            goalsAgainst: Math.floor(Math.random() * 30),
            cleanSheets: Math.floor(Math.random() * 10),
            topScorer: {
                name: 'Jugador Estrella',
                goals: Math.floor(Math.random() * 15) + 5
            },
            form: Array(5).fill(null).map(() => 
                ['W', 'D', 'L'][Math.floor(Math.random() * 3)] as 'W' | 'D' | 'L'
            )
        };
    },

    /**
     * Exporta los datos del equipo
     */
    async exportTeamData(teamId: string, format: 'pdf' | 'excel'): Promise<Blob> {
        await delay(1000);

        // Simular la generación de un archivo
        const team = await this.getTeamById(teamId);
        const content = JSON.stringify(team, null, 2);
        
        return new Blob([content], { 
            type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel'
        });
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
        await delay(1500);

        // Simular procesamiento del archivo
        return {
            success: true,
            imported: {
                players: Math.floor(Math.random() * 10) + 5,
                matches: Math.floor(Math.random() * 8) + 3,
                events: Math.floor(Math.random() * 6) + 2
            }
        };
    }
};