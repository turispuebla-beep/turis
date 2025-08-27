#!/usr/bin/env node

/**
 * Script de Despliegue Automatizado para Railway
 * CD Sanabria CF Backend
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando preparación para despliegue en Railway...\n');

// Verificar archivos necesarios
const requiredFiles = [
    'backend/package.json',
    'backend/server.js',
    'backend/railway.json'
];

console.log('📋 Verificando archivos necesarios...');

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - FALTANTE`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Error: Faltan archivos necesarios para el despliegue');
    process.exit(1);
}

console.log('\n✅ Todos los archivos necesarios están presentes');

// Verificar package.json
console.log('\n📦 Verificando package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    
    const requiredFields = ['name', 'version', 'main', 'scripts', 'dependencies'];
    const missingFields = requiredFields.filter(field => !packageJson[field]);
    
    if (missingFields.length > 0) {
        console.log(`❌ Faltan campos en package.json: ${missingFields.join(', ')}`);
        process.exit(1);
    }
    
    console.log('✅ package.json válido');
    console.log(`   Nombre: ${packageJson.name}`);
    console.log(`   Versión: ${packageJson.version}`);
    console.log(`   Script de inicio: ${packageJson.scripts.start}`);
    
} catch (error) {
    console.log('❌ Error leyendo package.json:', error.message);
    process.exit(1);
}

// Verificar server.js
console.log('\n🔧 Verificando server.js...');
try {
    const serverContent = fs.readFileSync('backend/server.js', 'utf8');
    
    const requiredImports = ['express', 'cors', 'socket.io'];
    const missingImports = requiredImports.filter(importName => 
        !serverContent.includes(`require('${importName}')`)
    );
    
    if (missingImports.length > 0) {
        console.log(`❌ Faltan imports en server.js: ${missingImports.join(', ')}`);
        process.exit(1);
    }
    
    console.log('✅ server.js válido');
    console.log('   Express.js configurado');
    console.log('   CORS habilitado');
    console.log('   Socket.IO configurado');
    
} catch (error) {
    console.log('❌ Error leyendo server.js:', error.message);
    process.exit(1);
}

// Verificar railway.json
console.log('\n🚂 Verificando railway.json...');
try {
    const railwayConfig = JSON.parse(fs.readFileSync('backend/railway.json', 'utf8'));
    
    if (!railwayConfig.deploy || !railwayConfig.deploy.startCommand) {
        console.log('❌ railway.json no tiene startCommand configurado');
        process.exit(1);
    }
    
    console.log('✅ railway.json válido');
    console.log(`   Comando de inicio: ${railwayConfig.deploy.startCommand}`);
    
} catch (error) {
    console.log('❌ Error leyendo railway.json:', error.message);
    process.exit(1);
}

// Generar variables de entorno
console.log('\n🔐 Generando variables de entorno...');

const envVars = {
    NODE_ENV: 'production',
    PORT: '3000',
    CORS_ORIGIN: '*',
    JWT_SECRET: 'cdsanabriacf_jwt_secret_2024',
    ADMIN_EMAIL: 'amco@gmx.es',
    ADMIN_PASSWORD: '533712',
    CONTACT_EMAIL: 'cdsanabriafc@gmail.com',
    CLUB_NAME: 'CDSANABRIACF',
    CLUB_LOCATION: 'Puebla de Sanabria, Zamora'
};

const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

fs.writeFileSync('backend/.env.example', envContent);
console.log('✅ Variables de entorno generadas en backend/.env.example');

// Crear script de verificación post-despliegue
console.log('\n🔍 Generando script de verificación...');

const verificationScript = `#!/bin/bash

echo "🔍 Verificando despliegue en Railway..."

# Obtener URL del proyecto (reemplazar con la URL real)
RAILWAY_URL="https://tu-proyecto.railway.app"

echo "📡 Probando health check..."
curl -s "\${RAILWAY_URL}/api/health" | jq .

echo "📊 Probando obtener socios..."
curl -s "\${RAILWAY_URL}/api/members" | jq .

echo "🏆 Probando obtener equipos..."
curl -s "\${RAILWAY_URL}/api/equipos" | jq .

echo "🔐 Probando login administrador..."
curl -s -X POST "\${RAILWAY_URL}/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"amco@gmx.es","password":"533712"}' | jq .

echo "✅ Verificación completada"
`;

fs.writeFileSync('verify-deployment.sh', verificationScript);
console.log('✅ Script de verificación generado: verify-deployment.sh');

// Crear resumen final
console.log('\n📋 RESUMEN DE DESPLIEGUE');
console.log('========================');
console.log('');
console.log('✅ PREPARACIÓN COMPLETADA');
console.log('');
console.log('📁 Archivos verificados:');
console.log('   - backend/package.json');
console.log('   - backend/server.js');
console.log('   - backend/railway.json');
console.log('   - backend/.env.example (generado)');
console.log('   - verify-deployment.sh (generado)');
console.log('');
console.log('🚀 PRÓXIMOS PASOS:');
console.log('');
console.log('1. Subir código a GitHub:');
console.log('   git add .');
console.log('   git commit -m "Preparar para Railway"');
console.log('   git push origin main');
console.log('');
console.log('2. Crear proyecto en Railway:');
console.log('   - Ir a https://railway.app');
console.log('   - "Start a New Project"');
console.log('   - "Deploy from GitHub repo"');
console.log('   - Seleccionar tu repositorio');
console.log('   - Seleccionar directorio: backend/');
console.log('');
console.log('3. Configurar variables de entorno:');
console.log('   - Ir a pestaña "Variables" en Railway');
console.log('   - Copiar contenido de backend/.env.example');
console.log('');
console.log('4. Desplegar:');
console.log('   - Hacer clic en "Deploy Now"');
console.log('   - Esperar que termine');
console.log('   - Copiar la URL generada');
console.log('');
console.log('5. Actualizar URLs en el código:');
console.log('   - database.js');
console.log('   - realtime-sync.js');
console.log('   - mobile-app/src/config/syncConfig.js');
console.log('');
console.log('6. Verificar despliegue:');
console.log('   chmod +x verify-deployment.sh');
console.log('   ./verify-deployment.sh');
console.log('');
console.log('📞 Soporte: cdsanabriafc@gmail.com');
console.log('');
console.log('🎉 ¡Listo para desplegar en Railway!');
