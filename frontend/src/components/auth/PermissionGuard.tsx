import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../types/auth';

interface PermissionGuardProps {
    children: React.ReactNode;
    permissions?: Permission[];
    requireAll?: boolean;
    feature?: string;
    teamId?: string;
    playerId?: string;
    fallback?: React.ReactNode;
}

export function PermissionGuard({
    children,
    permissions = [],
    requireAll = true,
    feature,
    teamId,
    playerId,
    fallback = <Navigate to="/" replace />
}: PermissionGuardProps) {
    const {
        isSuperAdmin,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        canAccessFeature,
        canManageTeam,
        canManagePlayer
    } = usePermissions();

    // El super_admin siempre tiene acceso
    if (isSuperAdmin()) {
        return <>{children}</>;
    }

    // Verificar permisos específicos
    if (permissions.length > 0) {
        const hasRequiredPermissions = requireAll
            ? hasAllPermissions(permissions)
            : hasAnyPermission(permissions);

        if (!hasRequiredPermissions) {
            return <>{fallback}</>;
        }
    }

    // Verificar acceso a características
    if (feature && !canAccessFeature(feature)) {
        return <>{fallback}</>;
    }

    // Verificar permisos de equipo
    if (teamId && !canManageTeam(teamId)) {
        return <>{fallback}</>;
    }

    // Verificar permisos de jugador
    if (playerId && !canManagePlayer(playerId)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}