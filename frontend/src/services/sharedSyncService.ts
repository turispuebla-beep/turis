import api from './api';

export interface SyncState {
    lastSync: number;
    collections: {
        [key: string]: {
            lastSync: number;
            version: number;
        };
    };
}

export interface SyncResult {
    updates: {
        collection: string;
        items: any[];
        deletedIds: string[];
    }[];
    timestamp: number;
    version: number;
}

export const sharedSyncService = {
    /**
     * Obtiene el estado de sincronización actual
     */
    async getSyncState(): Promise<SyncState> {
        const response = await api.get('/sync/state');
        return response.data;
    },

    /**
     * Sincroniza los datos con el servidor
     */
    async sync(collections: string[], lastSync: number): Promise<SyncResult> {
        const response = await api.post('/sync', {
            collections,
            lastSync
        });
        return response.data;
    },

    /**
     * Sincroniza una colección específica
     */
    async syncCollection(collection: string, lastSync: number): Promise<{
        items: any[];
        deletedIds: string[];
        timestamp: number;
        version: number;
    }> {
        const response = await api.post(`/sync/${collection}`, { lastSync });
        return response.data;
    },

    /**
     * Envía cambios locales al servidor
     */
    async pushChanges(collection: string, changes: {
        created: any[];
        updated: any[];
        deleted: string[];
    }): Promise<{
        accepted: string[];
        rejected: {
            id: string;
            reason: string;
        }[];
        conflicts: {
            localItem: any;
            serverItem: any;
        }[];
    }> {
        const response = await api.post(`/sync/${collection}/push`, changes);
        return response.data;
    },

    /**
     * Resuelve conflictos de sincronización
     */
    async resolveConflicts(collection: string, resolutions: {
        id: string;
        resolution: 'local' | 'server' | 'merged';
        mergedData?: any;
    }[]): Promise<void> {
        await api.post(`/sync/${collection}/resolve`, { resolutions });
    },

    /**
     * Obtiene el historial de sincronización
     */
    async getSyncHistory(): Promise<{
        timestamp: number;
        status: 'success' | 'partial' | 'failed';
        collections: string[];
        errors?: string[];
    }[]> {
        const response = await api.get('/sync/history');
        return response.data;
    },

    /**
     * Reinicia la sincronización
     */
    async resetSync(): Promise<void> {
        await api.post('/sync/reset');
    },

    /**
     * Verifica si hay actualizaciones disponibles
     */
    async checkUpdates(): Promise<{
        hasUpdates: boolean;
        collections: string[];
    }> {
        const response = await api.get('/sync/check');
        return response.data;
    },

    /**
     * Obtiene el estado de la conexión
     */
    async getConnectionStatus(): Promise<{
        online: boolean;
        lastSync: number;
        pendingChanges: boolean;
    }> {
        const response = await api.get('/sync/status');
        return response.data;
    },

    /**
     * Configura las preferencias de sincronización
     */
    async setSyncPreferences(preferences: {
        autoSync: boolean;
        syncInterval: number;
        syncOnWifiOnly: boolean;
        collections: {
            [key: string]: {
                enabled: boolean;
                priority: 'high' | 'normal' | 'low';
            };
        };
    }): Promise<void> {
        await api.put('/sync/preferences', preferences);
    },

    /**
     * Obtiene las preferencias de sincronización
     */
    async getSyncPreferences(): Promise<{
        autoSync: boolean;
        syncInterval: number;
        syncOnWifiOnly: boolean;
        collections: {
            [key: string]: {
                enabled: boolean;
                priority: 'high' | 'normal' | 'low';
            };
        };
    }> {
        const response = await api.get('/sync/preferences');
        return response.data;
    }
};