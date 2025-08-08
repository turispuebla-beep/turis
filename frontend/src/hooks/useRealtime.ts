import { useState, useEffect, useCallback } from 'react';
import { sharedRealtimeService, RealtimeChange, ChangeType } from '../services/sharedRealtimeService';
import { useAuth } from './useAuth';

interface UseRealtimeOptions {
    onConnectionLost?: () => void;
    onReconnect?: () => void;
    onChange?: (change: RealtimeChange) => void;
    filterTypes?: ChangeType[];
}

export function useRealtime(options: UseRealtimeOptions = {}) {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [lastChange, setLastChange] = useState<RealtimeChange | null>(null);
    const [pendingChanges, setPendingChanges] = useState<number>(0);

    // Manejar cambios en tiempo real
    const handleChange = useCallback((event: CustomEvent<RealtimeChange>) => {
        const change = event.detail;

        // Filtrar por tipo si es necesario
        if (options.filterTypes && !options.filterTypes.includes(change.type)) {
            return;
        }

        setLastChange(change);
        options.onChange?.(change);

        // Actualizar UI según el tipo de cambio
        switch (change.type) {
            case 'team_update':
                window.dispatchEvent(new CustomEvent('team-updated', { detail: change }));
                break;
            case 'player_update':
                window.dispatchEvent(new CustomEvent('player-updated', { detail: change }));
                break;
            case 'match_update':
                window.dispatchEvent(new CustomEvent('match-updated', { detail: change }));
                break;
            case 'event_update':
                window.dispatchEvent(new CustomEvent('event-updated', { detail: change }));
                break;
            case 'permission_update':
                window.dispatchEvent(new CustomEvent('permissions-updated', { detail: change }));
                break;
            case 'notification_update':
                window.dispatchEvent(new CustomEvent('notification-updated', { detail: change }));
                break;
            case 'settings_update':
                window.dispatchEvent(new CustomEvent('settings-updated', { detail: change }));
                break;
            case 'admin_action':
                window.dispatchEvent(new CustomEvent('admin-action', { detail: change }));
                break;
        }
    }, [options.filterTypes, options.onChange]);

    // Manejar pérdida de conexión
    const handleConnectionLost = useCallback(() => {
        setIsConnected(false);
        options.onConnectionLost?.();
    }, [options.onConnectionLost]);

    // Iniciar conexión
    useEffect(() => {
        if (!user) return;

        const connect = async () => {
            try {
                await sharedRealtimeService.connect(user.id, user.token);
                setIsConnected(true);
                options.onReconnect?.();
            } catch (err) {
                console.error('Error conectando al servicio realtime:', err);
                handleConnectionLost();
            }
        };

        connect();

        // Escuchar eventos
        window.addEventListener('realtime-change', handleChange as EventListener);
        window.addEventListener('realtime-connection-lost', handleConnectionLost);

        // Limpiar al desmontar
        return () => {
            sharedRealtimeService.disconnect();
            window.removeEventListener('realtime-change', handleChange as EventListener);
            window.removeEventListener('realtime-connection-lost', handleConnectionLost);
        };
    }, [user, handleChange, handleConnectionLost, options.onReconnect]);

    // Monitorear cambios pendientes
    useEffect(() => {
        if (!isConnected) return;

        const checkStatus = async () => {
            try {
                const status = await sharedRealtimeService.getSyncStatus();
                setPendingChanges(status.pendingChanges);
            } catch (err) {
                console.error('Error obteniendo estado de sincronización:', err);
            }
        };

        const intervalId = setInterval(checkStatus, 30000); // Cada 30 segundos

        return () => clearInterval(intervalId);
    }, [isConnected]);

    // Función para enviar un cambio
    const broadcastChange = useCallback(async (change: Omit<RealtimeChange, 'id' | 'timestamp'>) => {
        if (!isConnected || !user) return;

        const fullChange: RealtimeChange = {
            ...change,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            author: {
                id: user.id,
                name: user.name,
                role: user.role
            },
            deviceInfo: {
                id: localStorage.getItem('deviceId') || 'unknown',
                platform: 'web'
            }
        };

        await sharedRealtimeService.broadcastChange(fullChange);
    }, [isConnected, user]);

    // Función para forzar sincronización
    const forceSyncNow = useCallback(async () => {
        if (!isConnected) return;
        await sharedRealtimeService.forceSyncNow();
    }, [isConnected]);

    return {
        isConnected,
        lastChange,
        pendingChanges,
        broadcastChange,
        forceSyncNow
    };
}