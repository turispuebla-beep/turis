export type UserRole = 
    | 'super_admin'      // Administrador único
    | 'team_admin'       // Administrador de equipo específico
    | 'coach'            // Entrenador
    | 'player'           // Jugador
    | 'staff'           // Personal del equipo
    | 'member'          // Socio/Amigo del equipo
    | 'viewer';         // Usuario básico

export interface TeamAccess {
    teamId: string;
    accessCode: string;  // Código proporcionado por el super_admin
    role: UserRole;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    teamAccess?: TeamAccess[];
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

export interface RegistrationData {
    email: string;
    password: string;
    name: string;
    teamAccessCode?: string;  // Opcional, solo para registro en equipo específico
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export type Permission =
    // Permisos de administración global
    | 'manage_teams'             // Crear/modificar/eliminar equipos
    | 'manage_access_codes'      // Generar/revocar códigos de acceso
    | 'manage_admins'            // Gestionar administradores secundarios
    | 'view_audit_logs'          // Ver logs de auditoría
    | 'system_settings'          // Configuración del sistema
    
    // Permisos de equipo específico
    | 'manage_team_settings'     // Configuración del equipo
    | 'manage_team_members'      // Gestionar miembros del equipo
    | 'manage_team_roles'        // Asignar roles dentro del equipo
    | 'manage_players'           // Gestionar jugadores
    | 'manage_matches'           // Gestionar partidos
    | 'manage_events'            // Gestionar eventos
    | 'view_team_stats'         // Ver estadísticas del equipo
    | 'export_team_data'        // Exportar datos del equipo
    
    // Permisos de comunicación
    | 'send_notifications'       // Enviar notificaciones
    | 'manage_announcements'     // Gestionar anuncios
    | 'chat_access';            // Acceso al chat

export const SUPER_ADMIN_EMAIL = process.env.REACT_APP_SUPER_ADMIN_EMAIL || 'admin@turisteam.com';
export const SUPER_ADMIN_PASSWORD = process.env.REACT_APP_SUPER_ADMIN_PASSWORD || 'admin123';

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    super_admin: [
        'manage_teams',
        'manage_access_codes',
        'manage_admins',
        'view_audit_logs',
        'system_settings',
        'manage_team_settings',
        'manage_team_members',
        'manage_team_roles',
        'manage_players',
        'manage_matches',
        'manage_events',
        'view_team_stats',
        'export_team_data',
        'send_notifications',
        'manage_announcements',
        'chat_access'
    ],
    team_admin: [
        'manage_team_settings',
        'manage_team_members',
        'manage_team_roles',
        'manage_players',
        'manage_matches',
        'manage_events',
        'view_team_stats',
        'export_team_data',
        'send_notifications',
        'manage_announcements',
        'chat_access'
    ],
    coach: [
        'manage_players',
        'manage_matches',
        'manage_events',
        'view_team_stats',
        'send_notifications',
        'chat_access'
    ],
    player: [
        'view_team_stats',
        'chat_access'
    ],
    staff: [
        'manage_events',
        'view_team_stats',
        'send_notifications',
        'chat_access'
    ],
    member: [
        'view_team_stats',
        'chat_access'
    ],
    viewer: [
        'view_team_stats'
    ]
};