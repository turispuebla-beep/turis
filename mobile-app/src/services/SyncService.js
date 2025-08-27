/**
 * Servicio de Sincronización en Tiempo Real - APK CDSANABRIACF
 * Maneja la sincronización entre la APK y el backend de Railway
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { 
  BACKEND_URL, 
  WEBSOCKET_CONFIG, 
  SYNC_CONFIG, 
  API_ENDPOINTS, 
  WEBSOCKET_EVENTS,
  STORAGE_CONFIG 
} from '../config/syncConfig';

class SyncService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.autoSyncInterval = null;
    this.listeners = new Map();
    this.pendingOperations = [];
    
    this.init();
  }

  // Inicializar el servicio
  async init() {
    try {
      console.log('🚀 Inicializando servicio de sincronización...');
      
      // Verificar conectividad
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        this.connectWebSocket();
        this.startAutoSync();
      } else {
        console.log('⚠️ Sin conexión a internet, usando modo offline');
      }

      // Escuchar cambios de conectividad
      NetInfo.addEventListener(this.handleConnectivityChange);
      
      console.log('✅ Servicio de sincronización inicializado');
    } catch (error) {
      console.error('❌ Error inicializando servicio de sincronización:', error);
    }
  }

  // Manejar cambios de conectividad
  handleConnectivityChange = (state) => {
    if (state.isConnected && !this.isConnected) {
      console.log('🌐 Conexión a internet restaurada');
      this.connectWebSocket();
      this.startAutoSync();
      this.processPendingOperations();
    } else if (!state.isConnected && this.isConnected) {
      console.log('❌ Conexión a internet perdida');
      this.disconnectWebSocket();
      this.stopAutoSync();
    }
  }

  // Conectar WebSocket
  connectWebSocket() {
    try {
      // En React Native, usamos una implementación diferente para WebSocket
      // Por ahora usaremos polling HTTP como fallback
      console.log('🔌 Conectando al servidor...');
      this.setupPolling();
    } catch (error) {
      console.error('❌ Error conectando WebSocket:', error);
      this.setupPolling();
    }
  }

  // Configurar polling como fallback
  setupPolling() {
    console.log('🔄 Configurando polling como fallback...');
    this.autoSyncInterval = setInterval(() => {
      this.syncData();
    }, SYNC_CONFIG.autoSyncInterval);
  }

  // Desconectar WebSocket
  disconnectWebSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.stopAutoSync();
  }

  // Iniciar sincronización automática
  startAutoSync() {
    if (!this.autoSyncInterval) {
      this.autoSyncInterval = setInterval(() => {
        this.syncData();
      }, SYNC_CONFIG.autoSyncInterval);
    }
  }

  // Detener sincronización automática
  stopAutoSync() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
  }

  // Sincronizar datos con el servidor
  async syncData() {
    try {
      console.log('🔄 Sincronizando datos...');
      
      // Obtener datos del servidor
      const serverData = await this.fetchServerData();
      
      // Actualizar datos locales
      await this.updateLocalData(serverData);
      
      // Enviar datos pendientes al servidor
      await this.sendPendingData();
      
      // Actualizar timestamp de sincronización
      await AsyncStorage.setItem(
        STORAGE_CONFIG.keys.SYNC_TIMESTAMP, 
        new Date().toISOString()
      );
      
      console.log('✅ Datos sincronizados correctamente');
      this.emit('sync-completed', { success: true, timestamp: new Date() });
      
    } catch (error) {
      console.error('❌ Error sincronizando datos:', error);
      this.emit('sync-error', { error: error.message });
    }
  }

  // Obtener datos del servidor
  async fetchServerData() {
    const endpoints = [
      API_ENDPOINTS.members.list,
      API_ENDPOINTS.teams.list,
      API_ENDPOINTS.players.list,
      API_ENDPOINTS.events.list,
      API_ENDPOINTS.friends.list,
    ];

    const results = await Promise.allSettled(
      endpoints.map(endpoint => this.apiRequest(endpoint))
    );

    return {
      members: results[0].status === 'fulfilled' ? results[0].value.data : [],
      teams: results[1].status === 'fulfilled' ? results[1].value.data : [],
      players: results[2].status === 'fulfilled' ? results[2].value.data : [],
      events: results[3].status === 'fulfilled' ? results[3].value.data : [],
      friends: results[4].status === 'fulfilled' ? results[4].value.data : [],
    };
  }

  // Actualizar datos locales
  async updateLocalData(serverData) {
    try {
      // Guardar datos en AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_CONFIG.keys.MEMBERS_DATA, JSON.stringify(serverData.members)),
        AsyncStorage.setItem(STORAGE_CONFIG.keys.TEAMS_DATA, JSON.stringify(serverData.teams)),
        AsyncStorage.setItem(STORAGE_CONFIG.keys.PLAYERS_DATA, JSON.stringify(serverData.players)),
        AsyncStorage.setItem(STORAGE_CONFIG.keys.EVENTS_DATA, JSON.stringify(serverData.events)),
        AsyncStorage.setItem(STORAGE_CONFIG.keys.FRIENDS_DATA, JSON.stringify(serverData.friends)),
      ]);

      // Emitir eventos de actualización
      this.emit('data-updated', serverData);
      
    } catch (error) {
      console.error('❌ Error actualizando datos locales:', error);
    }
  }

  // Enviar datos pendientes al servidor
  async sendPendingData() {
    if (this.pendingOperations.length === 0) return;

    console.log(`📤 Enviando ${this.pendingOperations.length} operaciones pendientes...`);

    for (const operation of this.pendingOperations) {
      try {
        await this.executeOperation(operation);
        // Remover operación exitosa
        this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
      } catch (error) {
        console.error(`❌ Error ejecutando operación ${operation.id}:`, error);
      }
    }
  }

  // Ejecutar operación
  async executeOperation(operation) {
    const { type, endpoint, data, method = 'POST' } = operation;
    
    try {
      const response = await this.apiRequest(endpoint, {
        method,
        body: data ? JSON.stringify(data) : undefined,
      });

      console.log(`✅ Operación ${type} ejecutada correctamente`);
      this.emit('operation-completed', { type, data: response });
      
    } catch (error) {
      console.error(`❌ Error ejecutando operación ${type}:`, error);
      throw error;
    }
  }

  // Añadir operación pendiente
  addPendingOperation(operation) {
    operation.id = Date.now() + Math.random();
    operation.timestamp = new Date().toISOString();
    this.pendingOperations.push(operation);
    
    console.log(`📝 Operación añadida a la cola: ${operation.type}`);
    
    // Intentar ejecutar inmediatamente si hay conexión
    if (this.isConnected) {
      this.sendPendingData();
    }
  }

  // Procesar operaciones pendientes
  async processPendingOperations() {
    if (this.pendingOperations.length > 0) {
      console.log(`🔄 Procesando ${this.pendingOperations.length} operaciones pendientes...`);
      await this.sendPendingData();
    }
  }

  // Realizar petición HTTP
  async apiRequest(endpoint, options = {}) {
    const url = `${BACKEND_URL}${endpoint}`;
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`❌ Error en petición HTTP ${endpoint}:`, error);
      throw error;
    }
  }

  // Obtener datos locales
  async getLocalData(type) {
    try {
      const key = STORAGE_CONFIG.keys[`${type.toUpperCase()}_DATA`];
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`❌ Error obteniendo datos locales ${type}:`, error);
      return [];
    }
  }

  // Guardar datos locales
  async saveLocalData(type, data) {
    try {
      const key = STORAGE_CONFIG.keys[`${type.toUpperCase()}_DATA`];
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ Datos ${type} guardados localmente`);
    } catch (error) {
      console.error(`❌ Error guardando datos locales ${type}:`, error);
    }
  }

  // CRUD Operations

  // Crear socio
  async createMember(memberData) {
    const operation = {
      type: 'create-member',
      endpoint: API_ENDPOINTS.members.create,
      data: memberData,
      method: 'POST',
    };

    this.addPendingOperation(operation);
    
    // Añadir a datos locales inmediatamente
    const currentMembers = await this.getLocalData('members');
    const newMember = { ...memberData, id: Date.now(), synced: false };
    await this.saveLocalData('members', [...currentMembers, newMember]);
    
    this.emit('member-added', newMember);
    return newMember;
  }

  // Actualizar socio
  async updateMember(id, memberData) {
    const operation = {
      type: 'update-member',
      endpoint: API_ENDPOINTS.members.update(id),
      data: memberData,
      method: 'PUT',
    };

    this.addPendingOperation(operation);
    
    // Actualizar datos locales inmediatamente
    const currentMembers = await this.getLocalData('members');
    const updatedMembers = currentMembers.map(member => 
      member.id === id ? { ...member, ...memberData, synced: false } : member
    );
    await this.saveLocalData('members', updatedMembers);
    
    const updatedMember = updatedMembers.find(m => m.id === id);
    this.emit('member-changed', updatedMember);
    return updatedMember;
  }

  // Eliminar socio
  async deleteMember(id) {
    const operation = {
      type: 'delete-member',
      endpoint: API_ENDPOINTS.members.delete(id),
      method: 'DELETE',
    };

    this.addPendingOperation(operation);
    
    // Eliminar de datos locales inmediatamente
    const currentMembers = await this.getLocalData('members');
    const filteredMembers = currentMembers.filter(member => member.id !== id);
    await this.saveLocalData('members', filteredMembers);
    
    this.emit('member-deleted', { id });
    return true;
  }

  // Crear equipo
  async createTeam(teamData) {
    const operation = {
      type: 'create-team',
      endpoint: API_ENDPOINTS.teams.create,
      data: teamData,
      method: 'POST',
    };

    this.addPendingOperation(operation);
    
    const currentTeams = await this.getLocalData('teams');
    const newTeam = { ...teamData, id: Date.now(), synced: false };
    await this.saveLocalData('teams', [...currentTeams, newTeam]);
    
    this.emit('team-added', newTeam);
    return newTeam;
  }

  // Crear evento
  async createEvent(eventData) {
    const operation = {
      type: 'create-event',
      endpoint: API_ENDPOINTS.events.create,
      data: eventData,
      method: 'POST',
    };

    this.addPendingOperation(operation);
    
    const currentEvents = await this.getLocalData('events');
    const newEvent = { ...eventData, id: Date.now(), synced: false };
    await this.saveLocalData('events', [...currentEvents, newEvent]);
    
    this.emit('event-added', newEvent);
    return newEvent;
  }

  // Event listeners
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error en callback de evento ${event}:`, error);
        }
      });
    }
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      backendUrl: BACKEND_URL,
      reconnectAttempts: this.reconnectAttempts,
      pendingOperations: this.pendingOperations.length,
    };
  }

  // Forzar sincronización
  async forceSync() {
    console.log('🔄 Forzando sincronización...');
    await this.syncData();
  }

  // Limpiar datos
  async clearData() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_CONFIG.keys.MEMBERS_DATA),
        AsyncStorage.removeItem(STORAGE_CONFIG.keys.TEAMS_DATA),
        AsyncStorage.removeItem(STORAGE_CONFIG.keys.PLAYERS_DATA),
        AsyncStorage.removeItem(STORAGE_CONFIG.keys.EVENTS_DATA),
        AsyncStorage.removeItem(STORAGE_CONFIG.keys.FRIENDS_DATA),
        AsyncStorage.removeItem(STORAGE_CONFIG.keys.SYNC_TIMESTAMP),
      ]);
      
      this.pendingOperations = [];
      console.log('✅ Datos limpiados correctamente');
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
    }
  }
}

// Crear instancia singleton
const syncService = new SyncService();

export default syncService;
