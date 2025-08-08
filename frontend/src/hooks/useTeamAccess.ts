import { useAuth } from './useAuth';
import { SUPER_ADMIN_EMAIL } from '../config/constants';

export const useTeamAccess = () => {
    const { user } = useAuth();

    const isSuperAdmin = () => {
        return user?.email === SUPER_ADMIN_EMAIL;
    };

    const canAccessTeam = (teamId: string) => {
        if (isSuperAdmin()) {
            return true; // El admin único puede acceder a todos los equipos
        }

        // Verificar si el usuario es admin secundario de este equipo específico
        return user?.managedTeams?.includes(teamId) || false;
    };

    const canManageTeam = (teamId: string) => {
        if (isSuperAdmin()) {
            return true; // El admin único puede gestionar todos los equipos
        }

        // Verificar si el usuario es admin secundario de este equipo específico
        return user?.managedTeams?.includes(teamId) || false;
    };

    const getManageableTeams = () => {
        if (isSuperAdmin()) {
            return null; // null indica acceso a todos los equipos
        }

        // Devolver solo los IDs de los equipos que gestiona
        return user?.managedTeams || [];
    };

    const filterTeamContent = (content: any[], teamId: string) => {
        if (isSuperAdmin()) {
            return content; // El admin único ve todo
        }

        // Los admins secundarios solo ven contenido de su equipo
        return content.filter(item => item.teamId === teamId);
    };

    return {
        isSuperAdmin,
        canAccessTeam,
        canManageTeam,
        getManageableTeams,
        filterTeamContent
    };
};