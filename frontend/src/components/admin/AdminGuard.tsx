import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { sharedAdminService } from '../../services/sharedAdminService';

interface AdminGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    action?: string;
    fallback?: React.ReactNode;
}

export function AdminGuard({ children, requiredRoles = ['SUPER_ADMIN'], action, fallback }: AdminGuardProps) {
    const { user } = useAuth();

    if (!user) {
        return fallback || (
            <Alert severity="error">
                No has iniciado sesión. Por favor, inicia sesión para continuar.
            </Alert>
        );
    }

    const hasRequiredRole = requiredRoles.some(role => {
        switch (role) {
            case 'SUPER_ADMIN':
                return sharedAdminService.isSuperAdmin(user.email);
            case 'TEAM_ADMIN':
                return sharedAdminService.isTeamAdmin(user.email);
            case 'COACH':
                return user.role === 'COACH';
            case 'PLAYER':
                return user.role === 'PLAYER';
            case 'MEMBER':
                return user.role === 'MEMBER';
            case 'FRIEND':
                return user.role === 'FRIEND';
            default:
                return false;
        }
    });

    if (!hasRequiredRole) {
        return fallback || (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="error" gutterBottom>
                    Acceso Restringido
                </Typography>
                <Typography color="textSecondary">
                    No tienes los permisos necesarios para {action || 'acceder a esta funcionalidad'}.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Se requiere uno de los siguientes roles: {requiredRoles.join(', ')}
                </Typography>
            </Box>
        );
    }

    return <>{children}</>;
}