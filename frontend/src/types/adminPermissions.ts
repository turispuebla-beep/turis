export type SecondaryAdminPermission = 
    // Permisos de equipo
    | 'view_team'           // Ver información del equipo
    | 'edit_team_info'      // Editar información básica
    | 'edit_team_settings'  // Editar configuración
    | 'delete_team'         // Eliminar equipo (si fue otorgado)

    // Permisos de jugadores
    | 'view_players'        // Ver jugadores
    | 'add_players'         // Añadir jugadores
    | 'edit_players'        // Editar jugadores
    | 'remove_players'      // Eliminar jugadores
    | 'manage_player_stats' // Gestionar estadísticas

    // Permisos de partidos
    | 'view_matches'        // Ver partidos
    | 'create_matches'      // Crear partidos
    | 'edit_matches'        // Editar partidos
    | 'delete_matches'      // Eliminar partidos
    | 'record_match_stats'  // Registrar estadísticas

    // Permisos de eventos
    | 'view_events'         // Ver eventos
    | 'create_events'       // Crear eventos
    | 'edit_events'         // Editar eventos
    | 'delete_events'       // Eliminar eventos
    | 'manage_attendance'   // Gestionar asistencia

    // Permisos de notificaciones
    | 'view_notifications'  // Ver notificaciones
    | 'send_notifications'  // Enviar notificaciones
    | 'manage_templates'    // Gestionar plantillas

    // Permisos de reportes
    | 'view_reports'        // Ver reportes
    | 'export_reports'      // Exportar reportes
    | 'create_reports'      // Crear reportes personalizados

    // Permisos de miembros
    | 'view_members'        // Ver miembros
    | 'invite_members'      // Invitar miembros
    | 'remove_members'      // Eliminar miembros
    | 'manage_roles';       // Gestionar roles (limitado)

export interface SecondaryAdminConfig {
    adminId: string;
    teamId: string;
    permissions: SecondaryAdminPermission[];
    restrictions: {
        maxPlayers?: number;          // Límite de jugadores que puede gestionar
        maxNotifications?: number;     // Límite de notificaciones por día
        requireApproval?: {           // Acciones que requieren aprobación
            playerRemoval?: boolean;   // Eliminar jugadores
            matchDeletion?: boolean;   // Eliminar partidos
            eventCancellation?: boolean; // Cancelar eventos
            massNotifications?: boolean; // Notificaciones masivas
        };
        timeRestrictions?: {          // Restricciones de horario
            start?: string;           // Hora inicio (HH:mm)
            end?: string;             // Hora fin (HH:mm)
            days?: number[];          // Días permitidos (0-6)
        };
        featureAccess?: {             // Acceso a características
            statistics?: boolean;      // Estadísticas avanzadas
            reports?: boolean;         // Reportes personalizados
            templates?: boolean;       // Plantillas personalizadas
            bulkOperations?: boolean;  // Operaciones masivas
        };
    };
    auditConfig: {
        logActions: boolean;          // Registrar todas las acciones
        notifySuperAdmin: {           // Notificar al super admin
            playerChanges?: boolean;   // Cambios en jugadores
            matchChanges?: boolean;    // Cambios en partidos
            eventChanges?: boolean;    // Cambios en eventos
            roleChanges?: boolean;     // Cambios en roles
        };
        retentionDays: number;        // Días de retención de logs
    };
}