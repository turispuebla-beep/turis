export interface TeamNews {
    id: string;
    teamId: string;
    title: string;
    content: string;
    images?: string[];
    createdAt: string;
    createdBy: string;
    category: 'partido' | 'entrenamiento' | 'evento' | 'comunicado' | 'general';
    visibility: 'equipo' | 'publico';
}

export interface TeamMember {
    id: string;
    teamId: string;
    name: string;
    surname: string;
    role: 'jugador' | 'entrenador' | 'asistente' | 'delegado' | 'medico';
    number?: number;  // Para jugadores
    position?: string; // Para jugadores
    photo?: string;
    documents: {
        id: string;
        name: string;
        type: string;
        url: string;
    }[];
}

export interface TeamMatch {
    id: string;
    teamId: string;
    date: string;
    location: string;
    opponent: string;
    isHome: boolean;
    score?: {
        home: number;
        away: number;
    };
    players: {
        playerId: string;
        played: boolean;
        goals?: number;
        assists?: number;
        yellowCards?: number;
        redCard?: boolean;
    }[];
    photos?: string[];
    videos?: string[];
    report?: string;
}

export interface TeamEvent {
    id: string;
    teamId: string;
    title: string;
    description: string;
    date: string;
    location: string;
    type: 'entrenamiento' | 'reunion' | 'social' | 'otro';
    attendance?: {
        memberId: string;
        status: 'confirmado' | 'pendiente' | 'rechazado';
    }[];
    photos?: string[];
    videos?: string[];
}

export interface TeamDocument {
    id: string;
    teamId: string;
    name: string;
    type: 'ficha' | 'medico' | 'permiso' | 'otro';
    url: string;
    uploadedBy: string;
    uploadedAt: string;
    visibility: 'equipo' | 'staff' | 'publico';
}

export interface TeamGallery {
    id: string;
    teamId: string;
    type: 'fotos' | 'videos';
    title: string;
    description?: string;
    date: string;
    items: {
        url: string;
        caption?: string;
    }[];
    visibility: 'equipo' | 'publico';
}

export interface TeamStats {
    id: string;
    teamId: string;
    season: string;
    matches: {
        played: number;
        won: number;
        drawn: number;
        lost: number;
        goalsFor: number;
        goalsAgainst: number;
    };
    players: {
        playerId: string;
        goals: number;
        assists: number;
        yellowCards: number;
        redCards: number;
        minutesPlayed: number;
    }[];
}

export interface Team {
    id: string;
    name: string;
    category: string;
    season: string;
    logo?: string;
    customUrl?: string;
    colors: {
        primary: string;
        secondary: string;
    };
    staff: {
        adminId: string;      // Administrador secundario
        coaches: string[];    // IDs de entrenadores
        delegates: string[];  // IDs de delegados
    };
    // Componentes integrados del equipo
    news: TeamNews[];
    members: TeamMember[];
    matches: TeamMatch[];
    events: TeamEvent[];
    documents: TeamDocument[];
    gallery: TeamGallery[];
    stats: TeamStats;
    // Configuración específica de la categoría
    config: {
        maxPlayers: number;
        maxStaff: number;
        ageRange: {
            min: number;
            max: number;
        };
        fieldPlayers: number;
        substitutes: number;
        matchDuration: {
            periods: number;
            minutesPerPeriod: number;
        };
    };
    // Permisos y accesos
    permissions: {
        news: {
            create: string[];    // IDs de usuarios con permiso
            edit: string[];
            delete: string[];
        };
        members: {
            create: string[];
            edit: string[];
            delete: string[];
        };
        events: {
            create: string[];
            edit: string[];
            delete: string[];
        };
        documents: {
            upload: string[];
            delete: string[];
        };
        gallery: {
            upload: string[];
            delete: string[];
        };
    };
}