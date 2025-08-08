import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { secondaryAdminService } from '../services/secondaryAdminService';
import type { SecondaryAdminPermission, SecondaryAdminConfig } from '../types/adminPermissions';

interface UseSecondaryAdminOptions {
    teamId: string;
    onPermissionDenied?: () => void;
    onApprovalRequired?: (action: string) => void;
}

export function useSecondaryAdmin(options: UseSecondaryAdminOptions) {
    const { teamId, onPermissionDenied, onApprovalRequired } = options;
    const { user } = useAuth();
    const [config, setConfig] = useState<SecondaryAdminConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar configuración inicial
    useEffect(() => {
        const loadConfig = async () => {
            if (!user || !teamId) return;

            try {
                setLoading(true);
                setError(null);
                const adminConfig = await secondaryAdminService.getAdminConfig(
                    user.id,
                    teamId
                );
                setConfig(adminConfig);
            } catch (err) {
                setError('Error cargando configuración de administrador');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, [user, teamId]);

    // Verificar si tiene un permiso específico
    const hasPermission = useCallback(async (
        permission: SecondaryAdminPermission
    ): Promise<boolean> => {
        if (!user || !teamId) return false;

        try {
            const result = await secondaryAdminService.hasPermission(
                user.id,
                teamId,
                permission
            );

            if (!result) {
                onPermissionDenied?.();
            }

            return result;
        } catch (err) {
            console.error('Error verificando permiso:', err);
            return false;
        }
    }, [user, teamId, onPermissionDenied]);

    // Verificar si una acción requiere aprobación
    const checkApprovalRequired = useCallback(async (
        action: string
    ): Promise<boolean> => {
        if (!user || !teamId) return false;

        try {
            const { requiresApproval, reason } = await secondaryAdminService.requiresApproval(
                user.id,
                teamId,
                action
            );

            if (requiresApproval) {
                onApprovalRequired?.(action);
            }

            return requiresApproval;
        } catch (err) {
            console.error('Error verificando aprobación:', err);
            return false;
        }
    }, [user, teamId, onApprovalRequired]);

    // Verificar restricciones de tiempo
    const isWithinAllowedTime = useCallback((): boolean => {
        if (!config?.restrictions.timeRestrictions) return true;

        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();

        const { start, end, days } = config.restrictions.timeRestrictions;

        // Verificar día permitido
        if (days && !days.includes(currentDay)) {
            return false;
        }

        // Verificar hora permitida
        if (start && end) {
            const [startHour] = start.split(':').map(Number);
            const [endHour] = end.split(':').map(Number);
            return currentHour >= startHour && currentHour < endHour;
        }

        return true;
    }, [config]);

    // Verificar límites
    const checkLimits = useCallback(async (
        type: 'players' | 'notifications'
    ): Promise<boolean> => {
        if (!config) return false;

        switch (type) {
            case 'players':
                if (config.restrictions.maxPlayers) {
                    // Implementar lógica para contar jugadores actuales
                    return true; // Placeholder
                }
                return true;

            case 'notifications':
                if (config.restrictions.maxNotifications) {
                    // Implementar lógica para contar notificaciones del día
                    return true; // Placeholder
                }
                return true;

            default:
                return true;
        }
    }, [config]);

    // Registrar acción en el log
    const logAction = useCallback(async (
        action: string,
        details: any
    ): Promise<void> => {
        if (!user || !teamId || !config?.auditConfig.logActions) return;

        try {
            // Implementar registro de acción
            console.log('Acción registrada:', action, details);
        } catch (err) {
            console.error('Error registrando acción:', err);
        }
    }, [user, teamId, config]);

    return {
        config,
        loading,
        error,
        hasPermission,
        checkApprovalRequired,
        isWithinAllowedTime,
        checkLimits,
        logAction
    };
}