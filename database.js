/**
 * Sistema de Base de Datos CDSANABRIACF - VERSIÓN FINAL Y LIMPIA
 * Base de datos nueva y funcional para el club deportivo
 */

class CDSANABRIACFDatabase {
    constructor() {
        this.dbName = 'CDSANABRIACF_CLEAN_DB';
        this.version = 1.0;
        this.db = null;
        this.isInitialized = false;
        this.init();
    }

    // Inicializar la base de datos
    async init() {
        try {
            console.log('🚀 Iniciando base de datos CDSANABRIACF limpia...');
            
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = (event) => {
                console.error('❌ Error al abrir la base de datos:', event.target.error);
                this.useLocalStorageFallback();
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.isInitialized = true;
                console.log('✅ Base de datos CDSANABRIACF inicializada correctamente');
                this.loadInitialData();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('🔄 Creando estructura de la base de datos...');
                this.createObjectStores(db);
            };
        } catch (error) {
            console.error('❌ Error al inicializar la base de datos:', error);
            this.useLocalStorageFallback();
        }
    }

    // Crear las tablas de la base de datos
    createObjectStores(db) {
        console.log('📊 Creando estructura de tablas...');

        // Tabla de Socios
        if (!db.objectStoreNames.contains('socios')) {
            const sociosStore = db.createObjectStore('socios', { keyPath: 'id', autoIncrement: true });
            sociosStore.createIndex('dni', 'dni', { unique: true });
            sociosStore.createIndex('numeroSocio', 'numeroSocio', { unique: true });
            sociosStore.createIndex('estado', 'estado', { unique: false });
            console.log('✅ Tabla socios creada');
        }

        // Tabla de Amigos del Club
        if (!db.objectStoreNames.contains('amigos')) {
            const amigosStore = db.createObjectStore('amigos', { keyPath: 'id', autoIncrement: true });
            amigosStore.createIndex('dni', 'dni', { unique: true });
            amigosStore.createIndex('estado', 'estado', { unique: false });
            console.log('✅ Tabla amigos creada');
        }

        // Tabla de Equipos
        if (!db.objectStoreNames.contains('equipos')) {
            const equiposStore = db.createObjectStore('equipos', { keyPath: 'id', autoIncrement: true });
            equiposStore.createIndex('categoria', 'categoria', { unique: false });
            equiposStore.createIndex('nombre', 'nombre', { unique: true });
            console.log('✅ Tabla equipos creada');
        }

        // Tabla de Jugadores
        if (!db.objectStoreNames.contains('jugadores')) {
            const jugadoresStore = db.createObjectStore('jugadores', { keyPath: 'id', autoIncrement: true });
            jugadoresStore.createIndex('dni', 'dni', { unique: true });
            jugadoresStore.createIndex('equipoId', 'equipoId', { unique: false });
            console.log('✅ Tabla jugadores creada');
        }

        // Tabla de Eventos
        if (!db.objectStoreNames.contains('eventos')) {
            const eventosStore = db.createObjectStore('eventos', { keyPath: 'id', autoIncrement: true });
            eventosStore.createIndex('fecha', 'fecha', { unique: false });
            eventosStore.createIndex('estado', 'estado', { unique: false });
            console.log('✅ Tabla eventos creada');
        }

        // Tabla de Administradores
        if (!db.objectStoreNames.contains('administradores')) {
            const adminStore = db.createObjectStore('administradores', { keyPath: 'id', autoIncrement: true });
            adminStore.createIndex('email', 'email', { unique: true });
            adminStore.createIndex('rol', 'rol', { unique: false });
            console.log('✅ Tabla administradores creada');
        }

        console.log('🎉 Estructura de base de datos creada completamente');
    }

    // Cargar datos iniciales
    async loadInitialData() {
        try {
            console.log('📥 Cargando datos iniciales...');

            // Crear equipos por defecto
            await this.createDefaultTeams();
            
            // Crear administradores por defecto
            await this.createDefaultAdmins();

            console.log('✅ Datos iniciales cargados correctamente');
        } catch (error) {
            console.error('❌ Error cargando datos iniciales:', error);
        }
    }

    // Crear equipos por defecto
    async createDefaultTeams() {
        const equipos = [
            {
                nombre: 'CDSANABRIACF Prebenjamín',
                categoria: 'prebenjamín',
                descripcion: 'Equipo de fútbol prebenjamín del CD Sanabria CF',
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            },
            {
                nombre: 'CDSANABRIACF Benjamín',
                categoria: 'benjamín',
                descripcion: 'Equipo de fútbol benjamín del CD Sanabria CF',
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            },
            {
                nombre: 'CDSANABRIACF Alevín',
                categoria: 'alevín',
                descripcion: 'Equipo de fútbol alevín del CD Sanabria CF',
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            },
            {
                nombre: 'CDSANABRIACF Infantil',
                categoria: 'infantil',
                descripcion: 'Equipo de fútbol infantil del CD Sanabria CF',
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            },
            {
                nombre: 'CDSANABRIACF Aficionado',
                categoria: 'aficionado',
                descripcion: 'Equipo de fútbol aficionado del CD Sanabria CF',
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            }
        ];

        for (const equipo of equipos) {
            await this.addEquipo(equipo);
        }
        console.log('✅ Equipos por defecto creados');
    }

    // Crear administradores por defecto
    async createDefaultAdmins() {
        const administradores = [
            {
                nombre: 'Administrador Principal',
                email: 'amco@gmx.es',
                password: '533712',
                rol: 'super_admin',
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            },
            {
                nombre: 'Administrador Secundario',
                email: 'cdsanabriafc@gmail.com',
                password: 'admin123',
                rol: 'admin',
                estado: 'activo',
                fechaCreacion: new Date().toISOString()
            }
        ];

        for (const admin of administradores) {
            await this.addAdministrador(admin);
        }
        console.log('✅ Administradores por defecto creados');
    }

    // ===== MÉTODOS CRUD PARA SOCIOS =====

    async addSocio(socio) {
        return new Promise(async (resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            try {
                const transaction = this.db.transaction(['socios'], 'readwrite');
                const store = transaction.objectStore('socios');

                // Generar número de socio automático secuencial
                socio.numeroSocio = await this.generateSocioNumber();
                socio.fechaRegistro = new Date().toISOString();
                socio.estado = 'pendiente';
                socio.pagado = false;

                const request = store.add(socio);

                request.onsuccess = () => {
                    console.log('✅ Socio añadido:', socio.nombre, 'Número:', socio.numeroSocio);
                    resolve(request.result);
                };

                request.onerror = () => {
                    console.error('❌ Error añadiendo socio:', request.error);
                    reject(request.error);
                };
            } catch (error) {
                console.error('❌ Error en addSocio:', error);
                reject(error);
            }
        });
    }

    async getSocios() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['socios'], 'readonly');
            const store = transaction.objectStore('socios');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async deleteSocio(id) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['socios'], 'readwrite');
            const store = transaction.objectStore('socios');
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('✅ Socio eliminado:', id);
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ===== MÉTODOS CRUD PARA AMIGOS =====

    async addAmigo(amigo) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['amigos'], 'readwrite');
            const store = transaction.objectStore('amigos');

            amigo.fechaRegistro = new Date().toISOString();
            amigo.estado = 'activo';

            const request = store.add(amigo);

            request.onsuccess = () => {
                console.log('✅ Amigo añadido:', amigo.nombre);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getAmigos() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['amigos'], 'readonly');
            const store = transaction.objectStore('amigos');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ===== MÉTODOS CRUD PARA EQUIPOS =====

    async addEquipo(equipo) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['equipos'], 'readwrite');
            const store = transaction.objectStore('equipos');

            equipo.fechaCreacion = new Date().toISOString();
            equipo.estado = 'activo';

            const request = store.add(equipo);

            request.onsuccess = () => {
                console.log('✅ Equipo añadido:', equipo.nombre);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getEquipos() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['equipos'], 'readonly');
            const store = transaction.objectStore('equipos');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ===== MÉTODOS CRUD PARA JUGADORES =====

    async addJugador(jugador) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['jugadores'], 'readwrite');
            const store = transaction.objectStore('jugadores');

            jugador.fechaRegistro = new Date().toISOString();
            jugador.estado = 'activo';

            const request = store.add(jugador);

            request.onsuccess = () => {
                console.log('✅ Jugador añadido:', jugador.nombre);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getJugadores() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['jugadores'], 'readonly');
            const store = transaction.objectStore('jugadores');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ===== MÉTODOS CRUD PARA EVENTOS =====

    async addEvento(evento) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['eventos'], 'readwrite');
            const store = transaction.objectStore('eventos');

            evento.fechaCreacion = new Date().toISOString();
            evento.estado = 'activo';

            const request = store.add(evento);

            request.onsuccess = () => {
                console.log('✅ Evento añadido:', evento.titulo);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getEventos() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['eventos'], 'readonly');
            const store = transaction.objectStore('eventos');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ===== MÉTODOS CRUD PARA ADMINISTRADORES =====

    async addAdministrador(admin) {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['administradores'], 'readwrite');
            const store = transaction.objectStore('administradores');

            admin.fechaCreacion = new Date().toISOString();
            admin.estado = 'activo';

            const request = store.add(admin);

            request.onsuccess = () => {
                console.log('✅ Administrador añadido:', admin.nombre);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getAdministradores() {
        return new Promise((resolve, reject) => {
            if (!this.isInitialized) {
                reject(new Error('Base de datos no inicializada'));
                return;
            }

            const transaction = this.db.transaction(['administradores'], 'readonly');
            const store = transaction.objectStore('administradores');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // ===== MÉTODOS UTILITARIOS =====

    // Contador secuencial para números de socio
    async getNextSocioNumber() {
        try {
            const socios = await this.getSocios();
            const maxNumber = socios.length > 0 ? 
                Math.max(...socios.map(s => {
                    const num = parseInt(s.numeroSocio.replace('SOC-', ''));
                    return isNaN(num) ? 0 : num;
                })) : 0;
            return maxNumber + 1;
        } catch (error) {
            console.error('❌ Error obteniendo siguiente número de socio:', error);
            return 1;
        }
    }

    generateSocioNumber() {
        return new Promise(async (resolve) => {
            const nextNumber = await this.getNextSocioNumber();
            const formattedNumber = nextNumber.toString().padStart(4, '0');
            resolve(`SOC-${formattedNumber}`);
        });
    }

    // Limpiar solo la tabla de socios y resetear contador
    async limpiarSociosYResetearContador() {
        try {
            const transaction = this.db.transaction(['socios'], 'readwrite');
            const store = transaction.objectStore('socios');
            
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = () => {
                    console.log('🧹 Tabla de socios limpiada completamente');
                    resolve();
                };
                request.onerror = reject;
            });
            
            console.log('✅ Contador de socios reseteado a 0');
            return true;
        } catch (error) {
            console.error('❌ Error limpiando socios:', error);
            return false;
        }
    }

    // Limpiar todas las tablas
    async clearAllTables() {
        const tables = ['socios', 'amigos', 'equipos', 'jugadores', 'eventos', 'administradores'];
        
        for (const table of tables) {
            const transaction = this.db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            await new Promise((resolve, reject) => {
                const request = store.clear();
                request.onsuccess = resolve;
                request.onerror = reject;
            });
        }
        
        console.log('🧹 Todas las tablas limpiadas');
    }

    // Fallback a localStorage
    useLocalStorageFallback() {
        console.log('⚠️ Usando localStorage como fallback');
        this.isInitialized = true;
        this.loadInitialData();
    }

    // Obtener estadísticas de la base de datos
    async getEstadisticas() {
        try {
            const socios = await this.getSocios();
            const amigos = await this.getAmigos();
            const equipos = await this.getEquipos();
            const jugadores = await this.getJugadores();
            const eventos = await this.getEventos();

            return {
                totalSocios: socios.length,
                sociosActivos: socios.filter(s => s.estado === 'activo').length,
                sociosPendientes: socios.filter(s => s.estado === 'pendiente').length,
                totalAmigos: amigos.length,
                totalEquipos: equipos.length,
                totalJugadores: jugadores.length,
                totalEventos: eventos.length,
                fechaEstadisticas: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return null;
        }
    }
}

// Crear instancia global de la base de datos
const cdsanabriacfDB = new CDSANABRIACFDatabase();

// Exportar para uso global
window.cdsanabriacfDB = cdsanabriacfDB;

// Función para eliminar completamente la base de datos IndexedDB
window.eliminarBaseDatosCompletamente = function() {
    try {
        console.log('🗑️ Eliminando base de datos IndexedDB completamente...');
        
        // Cerrar la conexión actual
        if (cdsanabriacfDB.db) {
            cdsanabriacfDB.db.close();
        }
        
        // Eliminar la base de datos
        const request = indexedDB.deleteDatabase('CDSANABRIACF_CLEAN_DB');
        
        request.onsuccess = function() {
            console.log('✅ Base de datos IndexedDB eliminada completamente');
            alert('✅ Base de datos eliminada completamente. La página se recargará para crear una nueva base de datos limpia.');
            
            // Limpiar localStorage también
            localStorage.clear();
            
            // Recargar la página
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        };
        
        request.onerror = function() {
            console.error('❌ Error eliminando base de datos:', request.error);
            alert('❌ Error eliminando la base de datos');
        };
        
    } catch (error) {
        console.error('❌ Error eliminando base de datos:', error);
        alert('❌ Error eliminando la base de datos');
    }
};

// Función para limpiar solo socios y resetear contador
window.limpiarSociosYResetearContador = async function() {
    try {
        console.log('🧹 Limpiando socios y reseteando contador...');
        
        if (cdsanabriacfDB.db) {
            await cdsanabriacfDB.limpiarSociosYResetearContador();
        }
        
        // Limpiar socios del localStorage también
        localStorage.removeItem('clubMembers');
        localStorage.removeItem('currentSocio');
        
        console.log('✅ Socios eliminados y contador reseteado');
        alert('✅ Todos los socios han sido eliminados y el contador reseteado a 0.\n\nEl próximo socio tendrá el número SOC-0001');
        
    } catch (error) {
        console.error('❌ Error limpiando socios:', error);
        alert('❌ Error limpiando los socios');
    }
};

// ===== FUNCIONES DE SINCRONIZACIÓN CON BACKEND =====

// URL del backend (Local para pruebas, cambiar por Railway cuando esté desplegado)
const BACKEND_URL = 'http://localhost:3000';

// Función para sincronizar socios con el backend
window.sincronizarSociosConBackend = async function() {
    try {
        console.log('🔄 Sincronizando socios con el backend...');
        
        // Obtener socios locales
        const sociosLocales = await cdsanabriacfDB.getSocios();
        
        // Verificar si tenemos URL real del backend
        if (BACKEND_URL === 'https://tu-proyecto.railway.app') {
            console.log('⚠️ URL del backend no configurada');
            alert('⚠️ URL del backend no configurada\n\nPara sincronizar:\n1. Ve a Railway.com\n2. Busca tu proyecto\n3. Copia la URL\n4. Actualiza BACKEND_URL en database.js');
            return;
        }
        
        // Enviar al backend
        const response = await fetch(`${BACKEND_URL}/api/members/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ socios: sociosLocales })
        });
        
        if (response.ok) {
            console.log('✅ Socios sincronizados con el backend');
            alert('✅ Socios sincronizados correctamente con el backend');
        } else {
            console.error('❌ Error sincronizando socios:', response.statusText);
            alert('❌ Error sincronizando socios con el backend');
        }
    } catch (error) {
        console.error('❌ Error en sincronización:', error);
        alert('❌ Error de conexión con el backend\n\nAsegúrate de que la URL del backend esté correcta');
    }
};

// Función para obtener socios del backend
window.obtenerSociosDelBackend = async function() {
    try {
        console.log('📥 Obteniendo socios del backend...');
        
        // Verificar si tenemos URL real del backend
        if (BACKEND_URL === 'https://tu-proyecto.railway.app') {
            console.log('⚠️ URL del backend no configurada');
            alert('⚠️ URL del backend no configurada\n\nPara sincronizar:\n1. Ve a Railway.com\n2. Busca tu proyecto\n3. Copia la URL\n4. Actualiza BACKEND_URL en database.js');
            return;
        }
        
        const response = await fetch(`${BACKEND_URL}/api/members`);
        
        if (response.ok) {
            const sociosBackend = await response.json();
            console.log('✅ Socios obtenidos del backend:', sociosBackend);
            
            // Actualizar base de datos local
            for (const socio of sociosBackend) {
                await cdsanabriacfDB.agregarSocio(socio);
            }
            
            alert(`✅ ${sociosBackend.length} socios sincronizados desde el backend`);
        } else {
            console.error('❌ Error obteniendo socios:', response.statusText);
            alert('❌ Error obteniendo socios del backend');
        }
    } catch (error) {
        console.error('❌ Error obteniendo socios:', error);
        alert('❌ Error de conexión con el backend\n\nAsegúrate de que la URL del backend esté correcta');
    }
};

console.log('🚀 Base de Datos CDSANABRIACF LIMPIA cargada');
console.log('📊 Funciones disponibles:');
console.log('- cdsanabriacfDB: Instancia principal de la base de datos');
console.log('- eliminarBaseDatosCompletamente(): ELIMINA COMPLETAMENTE la base de datos');
console.log('- limpiarSociosYResetearContador(): Elimina todos los socios y resetea contador a 0');
console.log('- sincronizarSociosConBackend(): Sincroniza socios con el backend');
console.log('- obtenerSociosDelBackend(): Obtiene socios del backend');



