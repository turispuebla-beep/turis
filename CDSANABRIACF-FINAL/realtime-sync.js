/**
 * Sincronización en Tiempo Real - CD Sanabria CF
 * Conecta la aplicación web con el backend de Railway
 */

class RealtimeSync {
    constructor() {
        this.backendUrl = 'https://turis-production.up.railway.app';
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        
        this.init();
    }

    // Inicializar conexión
    init() {
        try {
            console.log('🔌 Iniciando sincronización en tiempo real...');
            this.connectWebSocket();
            this.setupEventListeners();
        } catch (error) {
            console.error('❌ Error inicializando sincronización:', error);
        }
    }

    // Conectar WebSocket
    connectWebSocket() {
        try {
            // Usar Socket.IO desde CDN
            if (typeof io !== 'undefined') {
                this.socket = io(this.backendUrl);
                this.setupSocketEvents();
            } else {
                console.warn('⚠️ Socket.IO no disponible, usando polling');
                this.setupPolling();
            }
        } catch (error) {
            console.error('❌ Error conectando WebSocket:', error);
            this.setupPolling();
        }
    }

    // Configurar eventos del WebSocket
    setupSocketEvents() {
        this.socket.on('connect', () => {
            console.log('✅ Conectado al servidor en tiempo real');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.updateConnectionStatus(true);
            
            // Cargar datos iniciales del servidor
            this.loadInitialData();
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 Desconectado del servidor');
            this.isConnected = false;
            this.updateConnectionStatus(false);
            this.attemptReconnect();
        });

        this.socket.on('data-sync', (data) => {
            console.log('📡 Datos recibidos del servidor:', data);
            this.handleDataSync(data);
        });

        this.socket.on('member-added', (member) => {
            console.log('➕ Socio añadido desde servidor:', member);
            this.handleMemberAdded(member);
        });

        this.socket.on('member-changed', (member) => {
            console.log('📝 Socio actualizado desde servidor:', member);
            this.handleMemberChanged(member);
        });

        this.socket.on('member-deleted', (id) => {
            console.log('🗑️ Socio eliminado desde servidor:', id);
            this.handleMemberDeleted(id);
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión WebSocket:', error);
            this.setupPolling();
        });
    }

    // Configurar polling como fallback
    setupPolling() {
        console.log('🔄 Configurando polling como fallback...');
        setInterval(() => {
            this.syncData();
        }, 10000); // Sincronizar cada 10 segundos
    }

    // Intentar reconectar
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Intento de reconexión ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
                this.connectWebSocket();
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('❌ Máximo de intentos de reconexión alcanzado');
        }
    }

    // Configurar listeners de eventos
    setupEventListeners() {
        // Escuchar cambios en la base de datos local
        if (window.cdsanabriacfDB) {
            // Interceptar métodos de la base de datos para sincronizar
            this.interceptDatabaseMethods();
        }
    }

    // Interceptar métodos de la base de datos
    interceptDatabaseMethods() {
        const originalAddSocio = window.cdsanabriacfDB.addSocio;
        const originalDeleteSocio = window.cdsanabriacfDB.deleteSocio;

        // Interceptar añadir socio
        window.cdsanabriacfDB.addSocio = async (socio) => {
            const result = await originalAddSocio.call(window.cdsanabriacfDB, socio);
            this.syncMemberToServer(socio);
            return result;
        };

        // Interceptar eliminar socio
        window.cdsanabriacfDB.deleteSocio = async (id) => {
            const result = await originalDeleteSocio.call(window.cdsanabriacfDB, id);
            this.deleteMemberFromServer(id);
            return result;
        };
    }

    // Sincronizar datos con el servidor
    async syncData() {
        try {
            const response = await fetch(`${this.backendUrl}/api/members`);
            if (response.ok) {
                const data = await response.json();
                console.log('📡 Datos sincronizados desde servidor:', data);
                this.handleDataSync(data);
            }
        } catch (error) {
            console.error('❌ Error sincronizando datos:', error);
        }
    }

    // Manejar sincronización de datos
    handleDataSync(data) {
        console.log('📡 Datos recibidos del servidor:', data);
        
        // Guardar socios en localStorage
        if (data.members && Array.isArray(data.members)) {
            localStorage.setItem('clubMembers', JSON.stringify(data.members));
            console.log('✅ Socios guardados en localStorage:', data.members.length);
        }
        
        // Guardar amigos en localStorage
        if (data.amigos && Array.isArray(data.amigos)) {
            localStorage.setItem('clubFriends', JSON.stringify(data.amigos));
            console.log('✅ Amigos guardados en localStorage:', data.amigos.length);
        }
        
        // Guardar equipos en localStorage
        if (data.equipos && Array.isArray(data.equipos)) {
            localStorage.setItem('clubTeams', JSON.stringify(data.equipos));
            console.log('✅ Equipos guardados en localStorage:', data.equipos.length);
        }
        
        // Emitir evento para que la UI se actualice
        window.dispatchEvent(new CustomEvent('database-updated', {
            detail: { data }
        }));
    }

    // Actualizar base de datos local
    updateLocalDatabase(serverData) {
        console.log('🔄 Actualizando base de datos local con datos del servidor');
        
        // Emitir evento para que la UI se actualice
        window.dispatchEvent(new CustomEvent('database-updated', {
            detail: { data: serverData }
        }));
    }

    // Sincronizar socio al servidor
    async syncMemberToServer(member) {
        try {
            const response = await fetch(`${this.backendUrl}/api/members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(member)
            });

            if (response.ok) {
                console.log('✅ Socio sincronizado al servidor');
            } else {
                console.error('❌ Error sincronizando socio al servidor');
            }
        } catch (error) {
            console.error('❌ Error en sincronización:', error);
        }
    }

    // Eliminar socio del servidor
    async deleteMemberFromServer(id) {
        try {
            const response = await fetch(`${this.backendUrl}/api/members/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                console.log('✅ Socio eliminado del servidor');
            } else {
                console.error('❌ Error eliminando socio del servidor');
            }
        } catch (error) {
            console.error('❌ Error eliminando socio:', error);
        }
    }

    // Manejar socio añadido
    handleMemberAdded(member) {
        // Emitir evento para actualizar UI
        window.dispatchEvent(new CustomEvent('member-added', {
            detail: { member }
        }));
    }

    // Manejar socio cambiado
    handleMemberChanged(member) {
        // Emitir evento para actualizar UI
        window.dispatchEvent(new CustomEvent('member-changed', {
            detail: { member }
        }));
    }

    // Manejar socio eliminado
    handleMemberDeleted(id) {
        // Emitir evento para actualizar UI
        window.dispatchEvent(new CustomEvent('member-deleted', {
            detail: { id }
        }));
    }

    // Actualizar estado de conexión en la UI
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = connected ? '🟢 Conectado' : '🔴 Desconectado';
            statusElement.className = connected ? 'connected' : 'disconnected';
        }

        // Emitir evento de cambio de estado
        window.dispatchEvent(new CustomEvent('connection-status-changed', {
            detail: { connected }
        }));
    }

    // Obtener estado de conexión
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            backendUrl: this.backendUrl,
            reconnectAttempts: this.reconnectAttempts
        };
    }

    // Enviar datos al servidor
    sendToServer(event, data) {
        if (this.socket && this.isConnected) {
            this.socket.emit(event, data);
        } else {
            console.warn('⚠️ Socket no disponible, enviando por HTTP');
            this.sendViaHTTP(event, data);
        }
    }

    // Enviar por HTTP como fallback
    async sendViaHTTP(event, data) {
        try {
            const response = await fetch(`${this.backendUrl}/api/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event, data })
            });

            if (response.ok) {
                console.log('✅ Datos enviados por HTTP');
            } else {
                console.error('❌ Error enviando datos por HTTP');
            }
        } catch (error) {
            console.error('❌ Error en envío HTTP:', error);
        }
    }

    // Cargar datos iniciales del servidor
    async loadInitialData() {
        try {
            console.log('📥 Cargando datos iniciales del servidor...');
            
            const response = await fetch(`${this.backendUrl}/api/members`);
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    localStorage.setItem('clubMembers', JSON.stringify(data.data));
                    console.log('✅ Socios cargados del servidor:', data.data.length);
                }
            }
            
            const amigosResponse = await fetch(`${this.backendUrl}/api/amigos`);
            if (amigosResponse.ok) {
                const amigosData = await amigosResponse.json();
                if (amigosData.success && amigosData.data) {
                    localStorage.setItem('clubFriends', JSON.stringify(amigosData.data));
                    console.log('✅ Amigos cargados del servidor:', amigosData.data.length);
                }
            }
            
            console.log('✅ Datos iniciales cargados correctamente');
        } catch (error) {
            console.error('❌ Error cargando datos iniciales:', error);
        }
    }
}

// Crear instancia global
const realtimeSync = new RealtimeSync();

// Exportar para uso global
window.realtimeSync = realtimeSync;

// Función para verificar estado de conexión
window.checkConnectionStatus = function() {
    const status = realtimeSync.getConnectionStatus();
    console.log('📊 Estado de conexión:', status);
    return status;
};

// Función para forzar sincronización
window.forceSync = function() {
    console.log('🔄 Forzando sincronización...');
    realtimeSync.syncData();
};

console.log('🚀 Sincronización en tiempo real inicializada');
console.log('📡 Funciones disponibles:');
console.log('- realtimeSync: Instancia principal de sincronización');
console.log('- checkConnectionStatus(): Verificar estado de conexión');
console.log('- forceSync(): Forzar sincronización manual');
