import { useAuth } from './useAuth';
import type { Permission, UserRole } from '../types/auth';

export function usePermissions() {
    const { user } = useAuth();

    const isSuperAdmin = (): boolean => {
        return user?.role === 'super_admin';
    };

    const hasPermission = (permission: Permission): boolean => {
        if (!user) return false;
        
        // El super_admin siempre tiene todos los permisos
        if (user.role === 'super_admin') return true;

        return user.permissions?.includes(permission) || false;
    };

    const hasAnyPermission = (permissions: Permission[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };

    const hasAllPermissions = (permissions: Permission[]): boolean => {
        return permissions.every(permission => hasPermission(permission));
    };

    const canManageRole = (role: UserRole): boolean => {
        if (!user) return false;

        // Solo el super_admin puede gestionar otros administradores
        if (role === 'super_admin' || role === 'admin') {
            return user.role === 'super_admin';
        }

        // Los administradores pueden gestionar roles inferiores si tienen el permiso
        return hasPermission('manage_roles');
    };

    const canManagePermissions = (targetUserId: string): boolean => {
        if (!user) return false;

        // El super_admin puede gestionar permisos de cualquiera excepto otros super_admin
        if (user.role === 'super_admin') {
            const targetUser = { /* obtener usuario por ID */ };
            return targetUser?.role !== 'super_admin';
        }

        // Los administradores solo pueden gestionar permisos si tienen el permiso específico
        return hasPermission('manage_permissions');
    };

    const canAccessFeature = (feature: string): boolean => {
        if (!user) return false;

        // El super_admin tiene acceso a todas las características
        if (user.role === 'super_admin') return true;

        // Verificar si el usuario tiene restricciones de características
        return !user.restrictions?.features || user.restrictions.features.includes(feature);
    };

    const canManageTeam = (teamId: string): boolean => {
        if (!user) return false;

        // El super_admin puede gestionar cualquier equipo
        if (user.role === 'super_admin') return true;

        // Verificar si el usuario tiene restricciones de equipos
        if (user.restrictions?.teams) {
            return user.restrictions.teams.includes(teamId);
        }

        return hasPermission('edit_team');
    };

    const canManagePlayer = (playerId: string): boolean => {
        if (!user) return false;

        // El super_admin puede gestionar cualquier jugador
        if (user.role === 'super_admin') return true;

        // Verificar si el usuario tiene restricciones de jugadores
        if (user.restrictions?.players) {
            return user.restrictions.players.includes(playerId);
        }

        return hasPermission('manage_players');
    };

    const getManageableTeams = (): string[] => {
        if (!user) return [];

        // El super_admin puede gestionar todos los equipos
        if (user.role === 'super_admin') return ['*'];

        // Retornar los equipos específicos que el usuario puede gestionar
        return user.restrictions?.teams || [];
    };

    const getManageablePlayers = (): string[] => {
        if (!user) return [];

        // El super_admin puede gestionar todos los jugadores
        if (user.role === 'super_admin') return ['*'];

        // Retornar los jugadores específicos que el usuario puede gestionar
        return user.restrictions?.players || [];
    };

    const canCreateMoreTeams = (): boolean => {
        if (!user) return false;

        // El super_admin no tiene límite
        if (user.role === 'super_admin') return true;

        // Verificar el límite de equipos si existe
        if (user.restrictions?.maxTeams !== undefined) {
            const currentTeamsCount = 0; // Obtener el número actual de equipos
            return currentTeamsCount < user.restrictions.maxTeams;
        }

        return hasPermission('create_team');
    };

    const canCreateMorePlayers = (teamId: string): boolean => {
        if (!user) return false;

        // El super_admin no tiene límite
        if (user.role === 'super_admin') return true;

        // Verificar el límite de jugadores si existe
        if (user.restrictions?.maxPlayers !== undefined) {
            const currentPlayersCount = 0; // Obtener el número actual de jugadores
            return currentPlayersCount < user.restrictions.maxPlayers;
        }

        return hasPermission('manage_players');
    };

    return {
        isSuperAdmin,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canManageRole,
        canManagePermissions,
        canAccessFeature,
        canManageTeam,
        canManagePlayer,
        getManageableTeams,
        getManageablePlayers,
        canCreateMoreTeams,
        canCreateMorePlayers
    };
}