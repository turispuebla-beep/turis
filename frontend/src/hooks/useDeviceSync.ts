import { useState, useEffect, useCallback } from 'react';
import { sharedSyncService } from '../services/sharedSyncService';
import { useAuth } from './useAuth';

interface SyncOptions {
    collections?: string[];
    syncInterval?: number;
    onSyncComplete?: () => void;
    onSyncError?: (error: Error) => void;
}

export function useDeviceSync(options: SyncOptions = {}) {
    const {
        collections = ['teams', 'players', 'matches', 'events', 'news'],
        syncInterval = 300000, // 5 minutos
        onSyncComplete,
        onSyncError
    } = options;

    const { isAuthenticated } = useAuth();
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<number | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Función para realizar la sincronización
    const sync = useCallback(async () => {
        if (!isAuthenticated || isSyncing) return;

        setIsSyncing(true);
        setError(null);

        try {
            // Verificar si hay cambios pendientes
            const status = await sharedSyncService.getConnectionStatus();
            if (!status.online) {
                throw new Error('No hay conexión a internet');
            }

            // Si hay cambios pendientes, enviarlos primero
            if (status.pendingChanges) {
                // Aquí implementaríamos la lógica para enviar cambios locales
                // por cada colección que tenga cambios
            }

            // Obtener actualizaciones del servidor
            const result = await sharedSyncService.sync(
                collections,
                lastSync || 0
            );

            // Procesar las actualizaciones
            for (const update of result.updates) {
                // Aquí implementaríamos la lógica para aplicar las actualizaciones
                // a cada colección en el estado local
            }

            setLastSync(result.timestamp);
            setHasChanges(false);
            onSyncComplete?.();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error de sincronización');
            setError(error);
            onSyncError?.(error);
        } finally {
            setIsSyncing(false);
        }
    }, [isAuthenticated, isSyncing, lastSync, collections, onSyncComplete, onSyncError]);

    // Sincronización inicial y configuración del intervalo
    useEffect(() => {
        if (!isAuthenticated) return;

        // Sincronización inicial
        sync();

        // Configurar intervalo de sincronización
        const intervalId = setInterval(sync, syncInterval);

        // Configurar listener para cambios en la conexión
        const handleOnline = () => {
            if (hasChanges) {
                sync();
            }
        };
        window.addEventListener('online', handleOnline);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('online', handleOnline);
        };
    }, [isAuthenticated, sync, syncInterval, hasChanges]);

    // Función para forzar una sincronización
    const forceSync = useCallback(() => {
        sync();
    }, [sync]);

    // Función para marcar que hay cambios pendientes
    const markHasChanges = useCallback(() => {
        setHasChanges(true);
    }, []);

    return {
        isSyncing,
        lastSync,
        error,
        hasChanges,
        forceSync,
        markHasChanges
    };
}