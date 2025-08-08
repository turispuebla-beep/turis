import api from './api';

export type ChangeType = 
    | 'team_update'          // Cambios en equipo
    | 'player_update'        // Cambios en jugadores
    | 'match_update'         // Cambios en partidos
    | 'event_update'         // Cambios en eventos
    | 'permission_update'    // Cambios en permisos
    | 'notification_update'  // Cambios en notificaciones
    | 'settings_update'      // Cambios en configuración
    | 'admin_action';        // Acciones administrativas

export interface RealtimeChange {
    id: string;
    type: ChangeType;
    timestamp: number;
    entityId: string;
    changes: any;
    author: {
        id: string;
        name: string;
        role: string;
    };
    deviceInfo: {
        id: string;
        platform: 'web' | 'android';
    };
}

export const sharedRealtimeService = {
    private websocket: WebSocket | null = null,
    private changeQueue: RealtimeChange[] = [],
    private reconnectAttempts = 0,
    private maxReconnectAttempts = 5,
    private reconnectDelay = 1000, // 1 segundo inicial

    /**
     * Inicia la conexión WebSocket
     */
    async connect(userId: string, authToken: string): Promise<void> {
        const wsUrl = `${process.env.VITE_WS_URL}/realtime?userId=${userId}&token=${authToken}`;
        
        this.websocket = new WebSocket(wsUrl);

        this.websocket.onopen = () => {
            console.log('Conexión realtime establecida');
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            this.processQueuedChanges();
        };

        this.websocket.onmessage = (event) => {
            const change: RealtimeChange = JSON.parse(event.data);
            this.handleIncomingChange(change);
        };

        this.websocket.onclose = () => {
            this.handleDisconnect();
        };

        this.websocket.onerror = (error) => {
            console.error('Error en conexión realtime:', error);
        };
    },

    /**
     * Maneja la reconexión automática
     */
    private async handleDisconnect(): Promise<void> {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.reconnectDelay *= 2; // Backoff exponencial

            console.log(`Intentando reconectar (intento ${this.reconnectAttempts})...`);
            
            setTimeout(() => {
                const userId = localStorage.getItem('userId');
                const token = localStorage.getItem('authToken');
                if (userId && token) {
                    this.connect(userId, token);
                }
            }, this.reconnectDelay);
        } else {
            console.error('No se pudo reconectar después de varios intentos');
            // Notificar al usuario que necesita recargar la página
            window.dispatchEvent(new CustomEvent('realtime-connection-lost'));
        }
    },

    /**
     * Procesa los cambios en cola después de reconectar
     */
    private async processQueuedChanges(): Promise<void> {
        while (this.changeQueue.length > 0) {
            const change = this.changeQueue.shift();
            if (change) {
                await this.broadcastChange(change);
            }
        }
    },

    /**
     * Maneja los cambios entrantes
     */
    private async handleIncomingChange(change: RealtimeChange): Promise<void> {
        // Emitir evento para que los componentes se actualicen
        window.dispatchEvent(new CustomEvent('realtime-change', {
            detail: change
        }));

        // Actualizar caché local si es necesario
        await this.updateLocalCache(change);

        // Registrar el cambio en el historial
        await this.logChange(change);
    },

    /**
     * Actualiza la caché local
     */
    private async updateLocalCache(change: RealtimeChange): Promise<void> {
        switch (change.type) {
            case 'team_update':
                await api.post('/cache/teams/update', change);
                break;
            case 'player_update':
                await api.post('/cache/players/update', change);
                break;
            case 'match_update':
                await api.post('/cache/matches/update', change);
                break;
            case 'event_update':
                await api.post('/cache/events/update', change);
                break;
            case 'permission_update':
                await api.post('/cache/permissions/update', change);
                break;
            // ... otros tipos de cambios
        }
    },

    /**
     * Registra un cambio en el historial
     */
    private async logChange(change: RealtimeChange): Promise<void> {
        await api.post('/history/changes', change);
    },

    /**
     * Transmite un cambio a todos los dispositivos
     */
    async broadcastChange(change: RealtimeChange): Promise<void> {
        if (this.websocket?.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify(change));
        } else {
            // Si no hay conexión, encolar el cambio
            this.changeQueue.push(change);
        }
    },

    /**
     * Obtiene el historial de cambios
     */
    async getChangeHistory(filters?: {
        startDate?: string;
        endDate?: string;
        types?: ChangeType[];
        authorId?: string;
        entityId?: string;
    }): Promise<RealtimeChange[]> {
        const response = await api.get('/history/changes', { params: filters });
        return response.data;
    },

    /**
     * Revierte un cambio específico
     */
    async revertChange(changeId: string): Promise<void> {
        await api.post(`/history/changes/${changeId}/revert`);
    },

    /**
     * Obtiene el estado de sincronización
     */
    async getSyncStatus(): Promise<{
        lastSyncTimestamp: number;
        pendingChanges: number;
        connectedDevices: number;
        syncErrors: any[];
    }> {
        const response = await api.get('/realtime/status');
        return response.data;
    },

    /**
     * Fuerza una sincronización inmediata
     */
    async forceSyncNow(): Promise<void> {
        await api.post('/realtime/sync');
    },

    /**
     * Desconecta el servicio realtime
     */
    disconnect(): void {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
    }
};