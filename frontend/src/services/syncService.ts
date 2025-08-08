import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/constants';

class SyncService {
    private socket: Socket | null = null;
    private syncCallbacks: Map<string, Function[]> = new Map();

    constructor() {
        this.initializeSocket();
    }

    private initializeSocket() {
        this.socket = io(API_URL, {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: Infinity
        });

        this.socket.on('connect', () => {
            console.log('Conexión de sincronización establecida');
        });

        this.socket.on('data_update', (data: {
            type: string;
            teamId: string;
            data: any;
            timestamp: number;
        }) => {
            // Notificar a todos los callbacks registrados para este tipo de actualización
            const callbacks = this.syncCallbacks.get(data.type) || [];
            callbacks.forEach(callback => callback(data));
        });
    }

    // Registrar para recibir actualizaciones
    public subscribe(type: string, callback: Function) {
        const callbacks = this.syncCallbacks.get(type) || [];
        callbacks.push(callback);
        this.syncCallbacks.set(type, callbacks);
    }

    // Enviar actualización
    public async sendUpdate(type: string, teamId: string, data: any) {
        const update = {
            type,
            teamId,
            data,
            timestamp: Date.now()
        };

        // Enviar a través de WebSocket
        this.socket?.emit('data_update', update);

        // También enviar a través de HTTP para garantizar la entrega
        try {
            await fetch(`${API_URL}/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update)
            });
        } catch (error) {
            console.error('Error en sincronización HTTP:', error);
            // Los datos se enviarán cuando se restaure la conexión
        }
    }

    // Verificar estado de sincronización
    public async checkSyncStatus(teamId: string): Promise<{
        lastSync: number;
        pendingUpdates: number;
    }> {
        const response = await fetch(`${API_URL}/sync/status/${teamId}`);
        return response.json();
    }

    // Forzar sincronización completa
    public async forceSyncTeam(teamId: string): Promise<void> {
        await fetch(`${API_URL}/sync/force/${teamId}`, { method: 'POST' });
    }
}

export const syncService = new SyncService();