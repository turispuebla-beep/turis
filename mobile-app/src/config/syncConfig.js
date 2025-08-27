/**
 * Configuración de Sincronización en Tiempo Real - APK CDSANABRIACF
 * Configura la sincronización entre la APK y el backend de Railway
 */

// URL del backend de Railway
export const BACKEND_URL = 'https://turis-production.up.railway.app';

// Configuración de WebSocket
export const WEBSOCKET_CONFIG = {
  url: BACKEND_URL,
  options: {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    reconnectionDelayMax: 10000,
  }
};

// Configuración de sincronización
export const SYNC_CONFIG = {
  // Intervalo de sincronización automática (en milisegundos)
  autoSyncInterval: 30000, // 30 segundos
  
  // Tiempo máximo de espera para operaciones de red
  networkTimeout: 10000, // 10 segundos
  
  // Número máximo de reintentos para operaciones fallidas
  maxRetries: 3,
  
  // Tiempo entre reintentos
  retryDelay: 2000, // 2 segundos
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
  },
  
  // Socios
  members: {
    list: '/api/members',
    create: '/api/members',
    update: (id) => `/api/members/${id}`,
    delete: (id) => `/api/members/${id}`,
    sync: '/api/sync',
  },
  
  // Equipos
  teams: {
    list: '/api/equipos',
    create: '/api/equipos',
    update: (id) => `/api/equipos/${id}`,
    delete: (id) => `/api/equipos/${id}`,
  },
  
  // Jugadores
  players: {
    list: '/api/jugadores',
    create: '/api/jugadores',
    update: (id) => `/api/jugadores/${id}`,
    delete: (id) => `/api/jugadores/${id}`,
  },
  
  // Eventos
  events: {
    list: '/api/eventos',
    create: '/api/eventos',
    update: (id) => `/api/eventos/${id}`,
    delete: (id) => `/api/eventos/${id}`,
  },
  
  // Amigos
  friends: {
    list: '/api/amigos',
    create: '/api/amigos',
    update: (id) => `/api/amigos/${id}`,
    delete: (id) => `/api/amigos/${id}`,
  },
  
  // Health check
  health: '/api/health',
};

// Eventos de WebSocket
export const WEBSOCKET_EVENTS = {
  // Conexión
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  
  // Sincronización de datos
  DATA_SYNC: 'data-sync',
  
  // Socios
  MEMBER_ADDED: 'member-added',
  MEMBER_CHANGED: 'member-changed',
  MEMBER_DELETED: 'member-deleted',
  
  // Equipos
  TEAM_ADDED: 'team-added',
  TEAM_CHANGED: 'team-changed',
  TEAM_DELETED: 'team-deleted',
  
  // Jugadores
  PLAYER_ADDED: 'player-added',
  PLAYER_CHANGED: 'player-changed',
  PLAYER_DELETED: 'player-deleted',
  
  // Eventos
  EVENT_ADDED: 'event-added',
  EVENT_CHANGED: 'event-changed',
  EVENT_DELETED: 'event-deleted',
  
  // Amigos
  FRIEND_ADDED: 'friend-added',
  FRIEND_CHANGED: 'friend-changed',
  FRIEND_DELETED: 'friend-deleted',
};

// Configuración de almacenamiento local
export const STORAGE_CONFIG = {
  // Claves para AsyncStorage
  keys: {
    // Datos de usuario
    USER_DATA: 'cdsanabriacf_user_data',
    AUTH_TOKEN: 'cdsanabriacf_auth_token',
    
    // Datos de sincronización
    SYNC_TIMESTAMP: 'cdsanabriacf_sync_timestamp',
    LAST_SYNC: 'cdsanabriacf_last_sync',
    
    // Datos de la aplicación
    MEMBERS_DATA: 'cdsanabriacf_members_data',
    TEAMS_DATA: 'cdsanabriacf_teams_data',
    PLAYERS_DATA: 'cdsanabriacf_players_data',
    EVENTS_DATA: 'cdsanabriacf_events_data',
    FRIENDS_DATA: 'cdsanabriacf_friends_data',
    
    // Configuración
    APP_SETTINGS: 'cdsanabriacf_app_settings',
    NOTIFICATIONS: 'cdsanabriacf_notifications',
  },
  
  // Tiempo de expiración para datos en caché (en milisegundos)
  cacheExpiration: {
    members: 5 * 60 * 1000, // 5 minutos
    teams: 10 * 60 * 1000,  // 10 minutos
    players: 5 * 60 * 1000, // 5 minutos
    events: 2 * 60 * 1000,  // 2 minutos
    friends: 5 * 60 * 1000, // 5 minutos
  }
};

// Configuración de notificaciones push
export const PUSH_CONFIG = {
  // Configuración para notificaciones en tiempo real
  enabled: true,
  
  // Tipos de notificaciones
  types: {
    NEW_MEMBER: 'new_member',
    MEMBER_UPDATED: 'member_updated',
    NEW_EVENT: 'new_event',
    EVENT_REMINDER: 'event_reminder',
    TEAM_UPDATE: 'team_update',
    GENERAL_ANNOUNCEMENT: 'general_announcement',
  },
  
  // Configuración de sonidos
  sounds: {
    default: 'default',
    notification: 'notification',
  },
  
  // Configuración de vibración
  vibration: {
    enabled: true,
    pattern: [0, 250, 250, 250], // Patrón de vibración
  }
};

// Configuración de logging
export const LOG_CONFIG = {
  // Habilitar logs detallados
  enabled: true,
  
  // Niveles de log
  levels: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
  },
  
  // Configuración de archivos de log
  file: {
    enabled: true,
    maxSize: 1024 * 1024, // 1MB
    maxFiles: 5,
  }
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  // Modo de desarrollo
  development: __DEV__,
  
  // URL del backend en desarrollo
  devBackendUrl: 'http://localhost:3000',
  
  // URL del backend en producción
  prodBackendUrl: BACKEND_URL,
  
  // Obtener URL del backend según el entorno
  getBackendUrl: () => {
    return __DEV__ ? DEV_CONFIG.devBackendUrl : DEV_CONFIG.prodBackendUrl;
  }
};

// Configuración de seguridad
export const SECURITY_CONFIG = {
  // Habilitar HTTPS
  httpsOnly: true,
  
  // Configuración de certificados SSL
  ssl: {
    enabled: true,
    verify: true,
  },
  
  // Configuración de headers de seguridad
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'CDSANABRIACF-Mobile/1.0.0',
  }
};

// Exportar configuración completa
export default {
  BACKEND_URL,
  WEBSOCKET_CONFIG,
  SYNC_CONFIG,
  API_ENDPOINTS,
  WEBSOCKET_EVENTS,
  STORAGE_CONFIG,
  PUSH_CONFIG,
  LOG_CONFIG,
  DEV_CONFIG,
  SECURITY_CONFIG,
};
