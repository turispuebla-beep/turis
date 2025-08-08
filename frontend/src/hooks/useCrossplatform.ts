import { useState, useEffect, useCallback } from 'react';
import { sharedCrossplatformService } from '../services/sharedCrossplatformService';
import { useAuth } from './useAuth';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutos
const DEVICE_ID_KEY = 'device_id';
const LAST_SYNC_KEY = 'last_sync_timestamp';

interface UseCrossplatformOptions {
    autoSync?: boolean;
    syncInterval?: number;
    onSyncComplete?: () => void;
    onSyncError?: (error: Error) => void;
    onVersionMismatch?: () => void;
}

export function useCrossplatform(options: UseCrossplatformOptions = {}) {
    const {
        autoSync = true,
        syncInterval = SYNC_INTERVAL,
        onSyncComplete,
        onSyncError,
        onVersionMismatch
    } = options;

    const { user } = useAuth();
    const [deviceId, setDeviceId] = useState<string | null>(
        localStorage.getItem(DEVICE_ID_KEY)
    );
    const [lastSync, setLastSync] = useState<number>(
        parseInt(localStorage.getItem(LAST_SYNC_KEY) || '0')
    );
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [syncStatus, setSyncStatus] = useState<{
        pendingChanges: boolean;
        nextSync: number;
    }>({
        pendingChanges: false,
        nextSync: Date.now() + syncInterval
    });

    // Registrar dispositivo si no existe
    useEffect(() => {
        const registerDevice = async () => {
            if (!deviceId && user) {
                try {
                    const platform = 'web';
                    const { deviceId: newDeviceId } = await sharedCrossplatformService.registerDevice({
                        deviceId: crypto.randomUUID(),
                        platform,
                        model: navigator.userAgent
                    });

                    localStorage.setItem(DEVICE_ID_KEY, newDeviceId);
                    setDeviceId(newDeviceId);
                } catch (err) {
                    console.error('Error registrando dispositivo:', err);
                    onSyncError?.(err instanceof Error ? err : new Error('Error registrando dispositivo'));
                }
            }
        };

        registerDevice();
    }, [user, deviceId]);

    // Verificar compatibilidad de versiones
    useEffect(() => {
        const checkCompatibility = async () => {
            if (!deviceId) return;

            try {
                const { compatible, minimumRequired } = await sharedCrossplatformService.checkVersionCompatibility({
                    platform: 'web',
                    version: process.env.VITE_APP_VERSION || '1.0.0',
                    buildNumber: parseInt(process.env.VITE_APP_BUILD_NUMBER || '1')
                });

                if (!compatible) {
                    console.warn(`Versión incompatible. Mínimo requerido: ${minimumRequired}`);
                    onVersionMismatch?.();
                }
            } catch (err) {
                console.error('Error verificando compatibilidad:', err);
            }
        };

        checkCompatibility();
    }, [deviceId]);

    // Sincronizar datos
    const sync = useCallback(async () => {
        if (!deviceId || !user || isSyncing) return;

        try {
            setIsSyncing(true);
            setError(null);

            // Obtener estado de sincronización
            const status = await sharedCrossplatformService.getSyncStatus(deviceId);
            
            if (status.pendingChanges) {
                // Sincronizar datos
                const syncResult = await sharedCrossplatformService.syncNotifications(
                    deviceId,
                    lastSync
                );

                // Actualizar estado local
                setLastSync(syncResult.timestamp);
                localStorage.setItem(LAST_SYNC_KEY, syncResult.timestamp.toString());

                // Actualizar preferencias
                const preferences = await sharedCrossplatformService.syncPreferences(deviceId);
                
                // Aplicar preferencias
                if (preferences.display.theme) {
                    document.documentElement.setAttribute('data-theme', preferences.display.theme);
                }
            }

            setSyncStatus({
                pendingChanges: false,
                nextSync: Date.now() + syncInterval
            });

            onSyncComplete?.();
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error de sincronización');
            setError(error);
            onSyncError?.(error);
        } finally {
            setIsSyncing(false);
        }
    }, [deviceId, user, lastSync, isSyncing, syncInterval]);

    // Sincronización automática
    useEffect(() => {
        if (!autoSync || !deviceId || !user) return;

        // Sincronización inicial
        sync();

        // Configurar intervalo
        const intervalId = setInterval(sync, syncInterval);

        // Sincronizar al recuperar conexión
        const handleOnline = () => {
            if (syncStatus.pendingChanges) {
                sync();
            }
        };
        window.addEventListener('online', handleOnline);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('online', handleOnline);
        };
    }, [autoSync, deviceId, user, sync, syncInterval, syncStatus.pendingChanges]);

    // Registrar eventos de analítica
    const logEvent = useCallback(async (eventType: string, eventData: any) => {
        if (!deviceId) return;

        try {
            await sharedCrossplatformService.logAnalytics([{
                type: eventType,
                timestamp: Date.now(),
                platform: 'web',
                deviceId,
                data: eventData
            }]);
        } catch (err) {
            console.error('Error registrando evento:', err);
        }
    }, [deviceId]);

    return {
        deviceId,
        lastSync,
        isSyncing,
        error,
        syncStatus,
        sync,
        logEvent
    };
}