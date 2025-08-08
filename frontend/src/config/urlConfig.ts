export const URL_CONFIG = {
    // Dominio base
    BASE_URL: process.env.VITE_BASE_URL || 'https://turisteam.es',
    
    // Subdominios
    ADMIN_URL: process.env.VITE_ADMIN_URL || 'https://admin.turisteam.es',
    API_URL: process.env.VITE_API_URL || 'https://api.turisteam.es',
    
    // Rutas principales
    ROUTES: {
        // Rutas públicas
        HOME: '/',
        ABOUT: '/sobre-nosotros',
        CONTACT: '/contacto',
        
        // Rutas de autenticación
        LOGIN: '/acceso',
        REGISTER: '/registro',
        RECOVER_PASSWORD: '/recuperar-password',
        
        // Rutas de administración
        ADMIN: {
            ROOT: '/admin',
            DASHBOARD: '/admin/dashboard',
            TEAMS: '/admin/equipos',
            CATEGORIES: '/admin/categorias',
            USERS: '/admin/usuarios',
            SETTINGS: '/admin/configuracion',
            LOGS: '/admin/registros',
            PERMISSIONS: '/admin/permisos'
        },
        
        // Rutas de equipo
        TEAM: {
            ROOT: '/equipo',
            LIST: '/equipos',
            DETAIL: (teamId: string) => `/equipo/${teamId}`,
            PLAYERS: (teamId: string) => `/equipo/${teamId}/jugadores`,
            MATCHES: (teamId: string) => `/equipo/${teamId}/partidos`,
            EVENTS: (teamId: string) => `/equipo/${teamId}/eventos`,
            STATS: (teamId: string) => `/equipo/${teamId}/estadisticas`,
            MEDIA: (teamId: string) => `/equipo/${teamId}/multimedia`,
            DOCUMENTS: (teamId: string) => `/equipo/${teamId}/documentos`
        },
        
        // Rutas de categoría
        CATEGORY: {
            ROOT: '/categoria',
            LIST: '/categorias',
            DETAIL: (categoryId: string) => `/categoria/${categoryId}`,
            TEAMS: (categoryId: string) => `/categoria/${categoryId}/equipos`,
            STATS: (categoryId: string) => `/categoria/${categoryId}/estadisticas`
        },
        
        // Rutas de usuario
        USER: {
            PROFILE: '/perfil',
            SETTINGS: '/configuracion',
            NOTIFICATIONS: '/notificaciones',
            MESSAGES: '/mensajes'
        }
    },
    
    // Configuración de SEO
    SEO: {
        defaultTitle: 'TURISTEAM - Gestión de Equipos Deportivos',
        titleTemplate: '%s | TURISTEAM',
        defaultDescription: 'Plataforma de gestión integral para equipos deportivos',
        siteUrl: 'https://turisteam.es',
        openGraph: {
            type: 'website',
            locale: 'es_ES',
            site_name: 'TURISTEAM'
        }
    },
    
    // Configuración de redireccionamiento
    REDIRECTS: {
        afterLogin: '/dashboard',
        afterLogout: '/',
        unauthorized: '/acceso',
        notFound: '/404'
    },
    
    // URLs de recursos externos
    EXTERNAL: {
        TERMS: 'https://turisteam.es/terminos',
        PRIVACY: 'https://turisteam.es/privacidad',
        HELP: 'https://ayuda.turisteam.es',
        BLOG: 'https://blog.turisteam.es'
    }
};