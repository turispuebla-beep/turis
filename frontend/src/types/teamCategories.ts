export interface CategoryConfig {
    displayName: string;
    features: {
        calendar: boolean;      // Calendario de eventos
        matches: boolean;       // Partidos
        players: boolean;       // Gestión de jugadores
        documents: boolean;     // Documentos
        photos: boolean;        // Galería de fotos
        videos: boolean;        // Videos
        stats: boolean;         // Estadísticas
        notifications: boolean; // Notificaciones
        chat: boolean;         // Chat interno
    };
    maxPlayers: number;        // Máximo de jugadores permitidos
    maxStaff: number;          // Máximo de personal técnico
    ageRange: {               // Rango de edad permitido
        min: number;
        max: number;
    };
    fieldPlayers: number;     // Jugadores en campo
    substitutes: number;      // Suplentes permitidos
    matchDuration: {          // Duración del partido
        periods: number;      // Número de periodos
        minutesPerPeriod: number; // Minutos por periodo
    };
}

export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
    'PREBENJAMIN': {
        displayName: 'Prebenjamín',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 12,
        maxStaff: 2,
        ageRange: {
            min: 6,
            max: 8
        },
        fieldPlayers: 5,    // Fútbol 5
        substitutes: 7,
        matchDuration: {
            periods: 4,
            minutesPerPeriod: 10
        }
    },
    'BENJAMIN': {
        displayName: 'Benjamín',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 15,
        maxStaff: 2,
        ageRange: {
            min: 8,
            max: 10
        },
        fieldPlayers: 7,    // Fútbol 7
        substitutes: 8,
        matchDuration: {
            periods: 4,
            minutesPerPeriod: 12
        }
    },
    'ALEVIN': {
        displayName: 'Alevín',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 15,
        maxStaff: 3,
        ageRange: {
            min: 10,
            max: 12
        },
        fieldPlayers: 7,    // Fútbol 7
        substitutes: 8,
        matchDuration: {
            periods: 2,
            minutesPerPeriod: 25
        }
    },
    'INFANTIL': {
        displayName: 'Infantil',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 18,
        maxStaff: 3,
        ageRange: {
            min: 12,
            max: 14
        },
        fieldPlayers: 11,    // Fútbol 11
        substitutes: 7,
        matchDuration: {
            periods: 2,
            minutesPerPeriod: 35
        }
    },
    'CADETE': {
        displayName: 'Cadete',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 20,
        maxStaff: 4,
        ageRange: {
            min: 14,
            max: 16
        },
        fieldPlayers: 11,    // Fútbol 11
        substitutes: 7,
        matchDuration: {
            periods: 2,
            minutesPerPeriod: 40
        }
    },
    'JUVENIL': {
        displayName: 'Juvenil',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 22,
        maxStaff: 4,
        ageRange: {
            min: 16,
            max: 19
        },
        fieldPlayers: 11,    // Fútbol 11
        substitutes: 7,
        matchDuration: {
            periods: 2,
            minutesPerPeriod: 45
        }
    },
    'SENIOR_MASCULINO': {
        displayName: 'Senior Masculino',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 25,
        maxStaff: 5,
        ageRange: {
            min: 19,
            max: 99
        },
        fieldPlayers: 11,    // Fútbol 11
        substitutes: 7,
        matchDuration: {
            periods: 2,
            minutesPerPeriod: 45
        }
    },
    'SENIOR_FEMENINO': {
        displayName: 'Senior Femenino',
        features: {
            calendar: true,
            matches: true,
            players: true,
            documents: true,
            photos: true,
            videos: true,
            stats: true,
            notifications: true,
            chat: true
        },
        maxPlayers: 25,
        maxStaff: 5,
        ageRange: {
            min: 19,
            max: 99
        },
        fieldPlayers: 11,    // Fútbol 11
        substitutes: 7,
        matchDuration: {
            periods: 2,
            minutesPerPeriod: 45
        }
    }
};