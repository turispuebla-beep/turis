export type NotificationType = 
    | 'team_announcement'    // Anuncios generales del equipo
    | 'match_update'         // Actualizaciones de partidos
    | 'training_schedule'    // Horarios de entrenamiento
    | 'event_reminder'       // Recordatorios de eventos
    | 'player_status'        // Estado de jugadores (lesiones, etc.)
    | 'team_performance'     // Rendimiento del equipo
    | 'administrative'       // Notificaciones administrativas
    | 'emergency';           // Notificaciones urgentes

export type NotificationScope = 
    | 'all_team'            // Todo el equipo
    | 'players_only'        // Solo jugadores
    | 'staff_only'          // Solo staff
    | 'specific_players';   // Jugadores específicos

export type NotificationPermission = {
    type: NotificationType;
    scope: NotificationScope[];
    requireApproval: boolean;
    maxPerDay?: number;
};

export interface NotificationPreferences {
    teamId: string;
    userId: string;
    role: string;
    permissions: NotificationPermission[];
    restrictions?: {
        quietHours?: {
            start: string;  // HH:mm format
            end: string;    // HH:mm format
        };
        blackoutDays?: string[];  // días de la semana (0-6)
        maxNotifications?: {
            daily: number;
            weekly: number;
        };
    };
}

export interface NotificationTemplate {
    id: string;
    type: NotificationType;
    title: string;
    content: string;
    variables: string[];
    teamId: string;
    createdBy: string;
    isDefault: boolean;
}

export interface ScheduledNotification {
    id: string;
    templateId: string;
    type: NotificationType;
    scope: NotificationScope;
    recipients: string[];
    scheduledFor: string;
    variables: Record<string, string>;
    status: 'pending' | 'sent' | 'failed' | 'cancelled';
    createdBy: string;
    teamId: string;
    requiresApproval: boolean;
    approvedBy?: string;
    approvedAt?: string;
}