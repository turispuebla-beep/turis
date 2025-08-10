export interface TeamPermissions {
    canEdit: boolean;
    canDelete: boolean;
    canManagePlayers: boolean;
    canManageCoach: boolean;
    canManageMembers: boolean;
    canManageFriends: boolean;
    canManageEvents: boolean;
    canManagePhotos: boolean;
    canManageVideos: boolean;
    canManageDocuments: boolean;
    canAssignAdmin: boolean;
    canManageContactInfo: boolean;
}

export const getTeamPermissions = (
    isMainAdmin: boolean, 
    userTeamId: string | undefined, 
    targetTeamId: string
): TeamPermissions => {
    // Administrador principal tiene todos los permisos
    if (isMainAdmin) {
        return {
            canEdit: true,
            canDelete: true,
            canManagePlayers: true,
            canManageCoach: true,
            canManageMembers: true,
            canManageFriends: true,
            canManageEvents: true,
            canManagePhotos: true,
            canManageVideos: true,
            canManageDocuments: true,
            canAssignAdmin: true,
            canManageContactInfo: true
        };
    }

    // Administrador de equipo solo tiene permisos en su equipo
    if (userTeamId === targetTeamId) {
        return {
            canEdit: true,
            canDelete: false,
            canManagePlayers: true,
            canManageCoach: true,
            canManageMembers: true,
            canManageFriends: true,
            canManageEvents: true,
            canManagePhotos: true,
            canManageVideos: true,
            canManageDocuments: true,
            canAssignAdmin: false,
            canManageContactInfo: true
        };
    }

    // Sin permisos para otros equipos
    return {
        canEdit: false,
        canDelete: false,
        canManagePlayers: false,
        canManageCoach: false,
        canManageMembers: false,
        canManageFriends: false,
        canManageEvents: false,
        canManagePhotos: false,
        canManageVideos: false,
        canManageDocuments: false,
        canAssignAdmin: false,
        canManageContactInfo: false
    };
};