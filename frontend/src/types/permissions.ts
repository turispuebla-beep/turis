export type UserRole = 'administrador_unico' | 'administrador_secundario' | 'socio' | 'amigo';

export interface PermissionConfig {
    // Gestión general del equipo
    equipo: {
        ver: boolean;
        editar: boolean;
        eliminar: boolean;
        crearNuevo: boolean;
        asignarPermisos: boolean;
    };
    // Categoría del equipo
    categoria: {
        ver: boolean;
        editar: boolean;
    };
    // Calendario
    calendario: {
        ver: boolean;
        crear: boolean;
        editar: boolean;
        eliminar: boolean;
    };
    // Resultados
    resultados: {
        ver: boolean;
        crear: boolean;
        editar: boolean;
        eliminar: boolean;
    };
    // Fotos y videos
    multimedia: {
        ver: boolean;
        subir: boolean;
        editar: boolean;
        eliminar: boolean;
    };
    // Documentos
    documentos: {
        ver: boolean;
        subir: boolean;
        editar: boolean;
        eliminar: boolean;
    };
}

export const ROLE_PERMISSIONS: Record<UserRole, PermissionConfig> = {
    // Administrador Único (tú - control total)
    'administrador_unico': {
        equipo: {
            ver: true,
            editar: true,
            eliminar: true,
            crearNuevo: true,
            asignarPermisos: true
        },
        categoria: {
            ver: true,
            editar: true
        },
        calendario: {
            ver: true,
            crear: true,
            editar: true,
            eliminar: true
        },
        resultados: {
            ver: true,
            crear: true,
            editar: true,
            eliminar: true
        },
        multimedia: {
            ver: true,
            subir: true,
            editar: true,
            eliminar: true
        },
        documentos: {
            ver: true,
            subir: true,
            editar: true,
            eliminar: true
        }
    },

    // Administrador Secundario (solo los permisos otorgados por el admin único)
    'administrador_secundario': {
        equipo: {
            ver: true,
            editar: false, // Solo si el admin único lo permite
            eliminar: false, // Solo si el admin único lo permite
            crearNuevo: false,
            asignarPermisos: false
        },
        categoria: {
            ver: true,
            editar: false // Solo si el admin único lo permite
        },
        calendario: {
            ver: true,
            crear: false, // Solo si el admin único lo permite
            editar: false, // Solo si el admin único lo permite
            eliminar: false // Solo si el admin único lo permite
        },
        resultados: {
            ver: true,
            crear: false, // Solo si el admin único lo permite
            editar: false, // Solo si el admin único lo permite
            eliminar: false // Solo si el admin único lo permite
        },
        multimedia: {
            ver: true,
            subir: false, // Solo si el admin único lo permite
            editar: false, // Solo si el admin único lo permite
            eliminar: false // Solo si el admin único lo permite
        },
        documentos: {
            ver: true,
            subir: false, // Solo si el admin único lo permite
            editar: false, // Solo si el admin único lo permite
            eliminar: false // Solo si el admin único lo permite
        }
    },

    // Socios (solo ver contenido específico de su equipo)
    'socio': {
        equipo: {
            ver: false,
            editar: false,
            eliminar: false,
            crearNuevo: false,
            asignarPermisos: false
        },
        categoria: {
            ver: true, // Pueden ver la categoría de su equipo
            editar: false
        },
        calendario: {
            ver: true, // Pueden ver el calendario de su equipo
            crear: false,
            editar: false,
            eliminar: false
        },
        resultados: {
            ver: true, // Pueden ver los resultados de su equipo
            crear: false,
            editar: false,
            eliminar: false
        },
        multimedia: {
            ver: true, // Pueden ver fotos y videos de su equipo
            subir: false,
            editar: false,
            eliminar: false
        },
        documentos: {
            ver: true, // Pueden ver documentos de su equipo
            subir: false,
            editar: false,
            eliminar: false
        }
    },

    // Amigos (acceso muy limitado)
    'amigo': {
        equipo: {
            ver: false,
            editar: false,
            eliminar: false,
            crearNuevo: false,
            asignarPermisos: false
        },
        categoria: {
            ver: false,
            editar: false
        },
        calendario: {
            ver: true, // Solo pueden ver el calendario
            crear: false,
            editar: false,
            eliminar: false
        },
        resultados: {
            ver: true, // Solo pueden ver resultados
            crear: false,
            editar: false,
            eliminar: false
        },
        multimedia: {
            ver: true, // Solo pueden ver fotos y videos
            subir: false,
            editar: false,
            eliminar: false
        },
        documentos: {
            ver: false,
            subir: false,
            editar: false,
            eliminar: false
        }
    }
};