import { useState, useEffect, useCallback } from 'react';
import { sharedNotificationService } from '../services/sharedNotificationService';
import { useAuth } from './useAuth';

interface NotificationOptions {
    onNewNotification?: (notification: any) => void;
    onError?: (error: Error) => void;
}

export function useDeviceNotifications(options: NotificationOptions = {}) {
    const { onNewNotification, onError } = options;
    const { isAuthenticated } = useAuth();
    const [isInitialized, setIsInitialized] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [deviceToken, setDeviceToken] = useState<string | null>(null);
    const [preferences, setPreferences] = useState({
        matchReminders: true,
        eventReminders: true,
        newsUpdates: true,
        teamUpdates: true
    });

    // Inicializar notificaciones
    const initializeNotifications = useCallback(async () => {
        if (!isAuthenticated || isInitialized) return;

        try {
            // Solicitar permiso para notificaciones
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    throw new Error('Permiso de notificaciones denegado');
                }
            }

            // Registrar service worker
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/sw.js');
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
                });

                // Obtener token y registrarlo
                const token = JSON.stringify(subscription);
                await sharedNotificationService.registerToken(
                    token,
                    'web',
                    navigator.userAgent
                );
                setDeviceToken(token);
            }

            // Obtener preferencias
            const userPreferences = await sharedNotificationService.getPreferences();
            setPreferences(userPreferences);

            // Obtener estado de notificaciones
            const status = await sharedNotificationService.getNotificationStatus();
            setUnreadCount(status.unreadCount);

            setIsInitialized(true);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al inicializar notificaciones');
            onError?.(error);
        }
    }, [isAuthenticated, isInitialized, onError]);

    // Inicializar al montar el componente
    useEffect(() => {
        initializeNotifications();
    }, [initializeNotifications]);

    // Escuchar nuevas notificaciones
    useEffect(() => {
        if (!isInitialized) return;

        const handlePushMessage = (event: MessageEvent) => {
            const notification = event.data?.json();
            if (notification) {
                setUnreadCount(prev => prev + 1);
                onNewNotification?.(notification);
            }
        };

        navigator.serviceWorker.addEventListener('message', handlePushMessage);

        return () => {
            navigator.serviceWorker.removeEventListener('message', handlePushMessage);
        };
    }, [isInitialized, onNewNotification]);

    // Actualizar preferencias
    const updatePreferences = useCallback(async (newPreferences: typeof preferences) => {
        try {
            await sharedNotificationService.updatePreferences(newPreferences);
            setPreferences(newPreferences);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al actualizar preferencias');
            onError?.(error);
        }
    }, [onError]);

    // Marcar notificación como leída
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await sharedNotificationService.markAsRead(notificationId);
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al marcar notificación como leída');
            onError?.(error);
        }
    }, [onError]);

    // Marcar todas como leídas
    const markAllAsRead = useCallback(async () => {
        try {
            await sharedNotificationService.markAllAsRead();
            setUnreadCount(0);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al marcar notificaciones como leídas');
            onError?.(error);
        }
    }, [onError]);

    // Programar notificación
    const scheduleNotification = useCallback(async (eventId: string, reminderMinutes: number) => {
        try {
            await sharedNotificationService.scheduleEventNotification(eventId, reminderMinutes);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al programar notificación');
            onError?.(error);
        }
    }, [onError]);

    // Cancelar notificación programada
    const cancelScheduledNotification = useCallback(async (eventId: string) => {
        try {
            await sharedNotificationService.cancelScheduledNotification(eventId);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error al cancelar notificación');
            onError?.(error);
        }
    }, [onError]);

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            if (deviceToken) {
                sharedNotificationService.unregisterToken(deviceToken).catch(console.error);
            }
        };
    }, [deviceToken]);

    return {
        isInitialized,
        unreadCount,
        preferences,
        updatePreferences,
        markAsRead,
        markAllAsRead,
        scheduleNotification,
        cancelScheduledNotification
    };
}