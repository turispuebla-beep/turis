/**
 * CDSANABRIACF - Gestor de Datos
 * Interfaz simplificada para gestionar datos del club
 */

class DataManager {
    constructor() {
        this.db = window.cdSanabriaDB;
        this.init();
    }

    async init() {
        // Esperar a que la base de datos esté inicializada
        while (!this.db.isInitialized) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Migrar datos existentes de localStorage si es necesario
        await this.migrateExistingData();
        
        console.log('✅ Gestor de datos inicializado');
    }

    async migrateExistingData() {
        // Migrar socios existentes
        const existingSocios = localStorage.getItem('socios');
        if (existingSocios) {
            try {
                const socios = JSON.parse(existingSocios);
                for (const socio of socios) {
                    await this.db.addSocio(socio);
                }
                localStorage.removeItem('socios');
                console.log(`✅ Migrados ${socios.length} socios`);
            } catch (error) {
                console.error('Error migrando socios:', error);
            }
        }

        // Migrar amigos existentes
        const existingAmigos = localStorage.getItem('amigos');
        if (existingAmigos) {
            try {
                const amigos = JSON.parse(existingAmigos);
                for (const amigo of amigos) {
                    await this.db.addAmigo(amigo);
                }
                localStorage.removeItem('amigos');
                console.log(`✅ Migrados ${amigos.length} amigos`);
            } catch (error) {
                console.error('Error migrando amigos:', error);
            }
        }

        // Migrar encuentros existentes
        const existingEncuentros = localStorage.getItem('encuentros');
        if (existingEncuentros) {
            try {
                const encuentros = JSON.parse(existingEncuentros);
                for (const encuentro of encuentros) {
                    await this.db.addEncuentro(encuentro);
                }
                localStorage.removeItem('encuentros');
                console.log(`✅ Migrados ${encuentros.length} encuentros`);
            } catch (error) {
                console.error('Error migrando encuentros:', error);
            }
        }
    }

    // ===== GESTIÓN DE SOCIOS =====
    async registrarSocio(socioData) {
        // Validar datos obligatorios
        if (!socioData.nombre || !socioData.apellidos || !socioData.telefono) {
            throw new Error('Nombre, apellidos y teléfono son obligatorios');
        }

        // Calcular edad si se proporciona fecha de nacimiento
        if (socioData.fecha_nacimiento) {
            const fechaNac = new Date(socioData.fecha_nacimiento);
            const hoy = new Date();
            socioData.edad = hoy.getFullYear() - fechaNac.getFullYear();
            
            // Calcular cuota basada en la edad
            socioData.cuota = socioData.edad >= 18 ? 20 : 10;
        } else {
            socioData.cuota = 20; // Por defecto adulto
        }

        // Verificar DNI único
        if (socioData.dni) {
            const existing = await this.db.getSocios({ dni: socioData.dni });
            if (existing.success && existing.data.length > 0) {
                throw new Error('Ya existe un socio con ese DNI');
            }
        }

        const result = await this.db.addSocio(socioData);
        if (result.success) {
            console.log('✅ Socio registrado correctamente');
            return result;
        } else {
            throw new Error('Error al registrar socio: ' + result.error);
        }
    }

    async obtenerSocios(filtros = {}) {
        const result = await this.db.getSocios(filtros);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Error al obtener socios: ' + result.error);
        }
    }

    async validarSocio(socioId, validadoPor) {
        const result = await this.db.update('socios', 
            { 
                estado: 'validado', 
                fecha_validacion: new Date().toISOString(),
                validado_por: validadoPor
            }, 
            { id: socioId }
        );
        
        if (result.success) {
            console.log('✅ Socio validado correctamente');
            return result;
        } else {
            throw new Error('Error al validar socio: ' + result.error);
        }
    }

    async eliminarSocio(socioId) {
        const result = await this.db.delete('socios', { id: socioId });
        if (result.success) {
            console.log('✅ Socio eliminado correctamente');
            return result;
        } else {
            throw new Error('Error al eliminar socio: ' + result.error);
        }
    }

    // ===== GESTIÓN DE AMIGOS =====
    async registrarAmigo(amigoData) {
        // Validar datos obligatorios
        if (!amigoData.nombre || !amigoData.apellidos || !amigoData.telefono || !amigoData.email) {
            throw new Error('Nombre, apellidos, teléfono y email son obligatorios');
        }

        const result = await this.db.addAmigo(amigoData);
        if (result.success) {
            console.log('✅ Amigo registrado correctamente');
            return result;
        } else {
            throw new Error('Error al registrar amigo: ' + result.error);
        }
    }

    async obtenerAmigos(filtros = {}) {
        const result = await this.db.getAmigos(filtros);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Error al obtener amigos: ' + result.error);
        }
    }

    // ===== GESTIÓN DE JUGADORES =====
    async registrarJugador(jugadorData) {
        // Validar datos obligatorios
        if (!jugadorData.nombre || !jugadorData.apellidos || !jugadorData.dni || !jugadorData.telefono || !jugadorData.fecha_nacimiento) {
            throw new Error('Nombre, apellidos, DNI, teléfono y fecha de nacimiento son obligatorios');
        }

        // Calcular edad
        const fechaNac = new Date(jugadorData.fecha_nacimiento);
        const hoy = new Date();
        jugadorData.edad = hoy.getFullYear() - fechaNac.getFullYear();

        // Verificar DNI único
        const existing = await this.db.getJugadores({ dni: jugadorData.dni });
        if (existing.success && existing.data.length > 0) {
            throw new Error('Ya existe un jugador con ese DNI');
        }

        // Verificar dorsal único en la categoría
        if (jugadorData.dorsal && jugadorData.categoria) {
            const existingDorsal = await this.db.getJugadores({ 
                dorsal: jugadorData.dorsal, 
                categoria: jugadorData.categoria 
            });
            if (existingDorsal.success && existingDorsal.data.length > 0) {
                throw new Error('Ya existe un jugador con ese dorsal en la categoría');
            }
        }

        const result = await this.db.addJugador(jugadorData);
        if (result.success) {
            console.log('✅ Jugador registrado correctamente');
            return result;
        } else {
            throw new Error('Error al registrar jugador: ' + result.error);
        }
    }

    async obtenerJugadores(filtros = {}) {
        const result = await this.db.getJugadores(filtros);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Error al obtener jugadores: ' + result.error);
        }
    }

    async obtenerJugadoresPorCategoria(categoria) {
        return await this.obtenerJugadores({ categoria: categoria });
    }

    // ===== GESTIÓN DE ENCUENTROS =====
    async agregarEncuentro(encuentroData) {
        // Validar datos obligatorios
        if (!encuentroData.equipo_local || !encuentroData.equipo_visitante || !encuentroData.fecha || !encuentroData.hora || !encuentroData.campo || !encuentroData.categoria) {
            throw new Error('Todos los campos son obligatorios para un encuentro');
        }

        const result = await this.db.addEncuentro(encuentroData);
        if (result.success) {
            console.log('✅ Encuentro agregado correctamente');
            return result;
        } else {
            throw new Error('Error al agregar encuentro: ' + result.error);
        }
    }

    async obtenerEncuentros(filtros = {}) {
        const result = await this.db.getEncuentros(filtros);
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Error al obtener encuentros: ' + result.error);
        }
    }

    async obtenerEncuentrosProximos() {
        const hoy = new Date().toISOString().split('T')[0];
        const result = await this.db.select('encuentros', 
            { fecha: { $gte: hoy } }, 
            'fecha ASC'
        );
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Error al obtener encuentros próximos: ' + result.error);
        }
    }

    // ===== GESTIÓN DE EVENTOS =====
    async agregarEvento(eventoData) {
        const result = await this.db.insert('eventos', eventoData);
        if (result.success) {
            console.log('✅ Evento agregado correctamente');
            return result;
        } else {
            throw new Error('Error al agregar evento: ' + result.error);
        }
    }

    async obtenerEventos(filtros = {}) {
        const result = await this.db.select('eventos', filtros, 'fecha ASC');
        if (result.success) {
            return result.data;
        } else {
            throw new Error('Error al obtener eventos: ' + result.error);
        }
    }

    // ===== GESTIÓN DE CONFIGURACIÓN =====
    async guardarConfiguracion(clave, valor, descripcion = '') {
        const result = await this.db.update('configuracion', 
            { valor: valor, descripcion: descripcion, fecha_actualizacion: new Date().toISOString() },
            { clave: clave }
        );
        
        if (result.success && result.rowsAffected === 0) {
            // Si no existe, crear nuevo
            await this.db.insert('configuracion', {
                clave: clave,
                valor: valor,
                descripcion: descripcion
            });
        }
        
        return result;
    }

    async obtenerConfiguracion(clave) {
        const result = await this.db.select('configuracion', { clave: clave });
        if (result.success && result.data.length > 0) {
            return result.data[0].valor;
        }
        return null;
    }

    // ===== ESTADÍSTICAS =====
    async obtenerEstadisticas() {
        const stats = {};
        
        // Contar socios
        const socios = await this.obtenerSocios();
        stats.totalSocios = socios.length;
        stats.sociosPendientes = socios.filter(s => s.estado === 'pendiente').length;
        stats.sociosValidados = socios.filter(s => s.estado === 'validado').length;
        
        // Contar amigos
        const amigos = await this.obtenerAmigos();
        stats.totalAmigos = amigos.length;
        
        // Contar jugadores
        const jugadores = await this.obtenerJugadores();
        stats.totalJugadores = jugadores.length;
        
        // Contar por categorías
        const categorias = ['prebenjamin', 'benjamin', 'alevin', 'infantil', 'aficionado'];
        stats.jugadoresPorCategoria = {};
        categorias.forEach(cat => {
            stats.jugadoresPorCategoria[cat] = jugadores.filter(j => j.categoria === cat).length;
        });
        
        // Contar encuentros
        const encuentros = await this.obtenerEncuentros();
        stats.totalEncuentros = encuentros.length;
        stats.encuentrosProgramados = encuentros.filter(e => e.estado === 'programado').length;
        
        return stats;
    }

    // ===== EXPORTAR/IMPORTAR =====
    async exportarDatos() {
        return await this.db.exportAllData();
    }

    async importarDatos(data) {
        return await this.db.importData(data);
    }

    async crearBackup() {
        return await this.db.createBackup();
    }

    async restaurarBackup() {
        return await this.db.restoreBackup();
    }

    // ===== UTILIDADES =====
    async limpiarDatosAntiguos() {
        // Eliminar socios pendientes de más de 7 días
        const sieteDiasAtras = new Date();
        sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);
        
        const sociosPendientes = await this.obtenerSocios({ estado: 'pendiente' });
        let eliminados = 0;
        
        for (const socio of sociosPendientes) {
            const fechaRegistro = new Date(socio.fecha_registro);
            if (fechaRegistro < sieteDiasAtras) {
                await this.eliminarSocio(socio.id);
                eliminados++;
            }
        }
        
        console.log(`✅ Eliminados ${eliminados} socios pendientes antiguos`);
        return eliminados;
    }

    async sincronizarConServidor() {
        // Aquí se implementaría la sincronización con un servidor remoto
        console.log('🔄 Sincronización con servidor (no implementada)');
        return { success: true, message: 'Sincronización no implementada' };
    }
}

// Crear instancia global
window.dataManager = new DataManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
