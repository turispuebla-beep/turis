// EJEMPLO de configuración de credenciales del administrador
// ⚠️ IMPORTANTE: Copia este archivo como config.js y modifica las credenciales
// En producción, estas credenciales deberían estar en variables de entorno del servidor

const ADMIN_CONFIG = {
    // Email del administrador principal
    adminEmail: 'tu-email@ejemplo.com',
    
    // Hashes de las contraseñas (NO las contraseñas en texto plano)
    // Para generar un hash, usa la función generateHash() en la consola del navegador
    // Ejemplo: generateHash('tu-contraseña').then(hash => console.log(hash))
    passwordHashes: {
        admin123: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin123
        superAdmin: '7c4a8d09ca3762af61e59520943dc26494f8941b' // 533712
    },
    
    // Configuración de seguridad
    maxLoginAttempts: 3,
    lockoutDuration: 15 * 60 * 1000, // 15 minutos en milisegundos
    
    // Configuración del equipo
    teamId: 'TU_EQUIPO_ID',
    teamName: 'Nombre de tu Equipo'
};

// Función para obtener configuración
function getAdminConfig() {
    return ADMIN_CONFIG;
}

// Función para verificar si un email es de administrador
function isAdminEmail(email) {
    return email.toLowerCase() === ADMIN_CONFIG.adminEmail.toLowerCase();
}

// Función para obtener hashes de contraseñas
function getPasswordHashes() {
    return ADMIN_CONFIG.passwordHashes;
}

// Exportar funciones (si se usa como módulo)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAdminConfig,
        isAdminEmail,
        getPasswordHashes
    };
}

/*
INSTRUCCIONES PARA CONFIGURAR:

1. Copia este archivo como config.js
2. Cambia adminEmail por tu email de administrador
3. Para cambiar las contraseñas:
   - Abre la consola del navegador (F12)
   - Ejecuta: generateHash('tu-nueva-contraseña').then(hash => console.log(hash))
   - Copia el hash generado y reemplaza el valor correspondiente
4. Cambia teamId y teamName por los de tu equipo
5. Guarda el archivo

⚠️ IMPORTANTE: Nunca subas config.js al repositorio, solo config.example.js
*/
