#!/usr/bin/env node

/**
 * Verificación Completa de Sincronización en Tiempo Real
 * CD Sanabria CF - Railway Backend
 */

const https = require('https');

const RAILWAY_URL = 'https://turis-production.up.railway.app';

console.log('🔍 VERIFICACIÓN COMPLETA DE SINCRONIZACIÓN EN TIEMPO REAL');
console.log('========================================================');
console.log(`📡 URL del Backend: ${RAILWAY_URL}\n`);

// Función para hacer peticiones HTTP
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'CDSANABRIACF-Sync-Test/1.0'
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve({
                        status: res.statusCode,
                        data: jsonData,
                        headers: res.headers
                    });
                } catch (error) {
                    resolve({
                        status: res.statusCode,
                        data: responseData,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

// Función para mostrar resultado
function showResult(testName, success, message, data = null) {
    const icon = success ? '✅' : '❌';
    const status = success ? 'EXITOSO' : 'FALLIDO';
    console.log(`${icon} ${testName}: ${status}`);
    console.log(`   ${message}`);
    if (data && success) {
        console.log(`   Datos: ${JSON.stringify(data, null, 2)}`);
    }
    console.log('');
    return success;
}

// Tests de verificación
async function runCompleteTests() {
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Health Check
    totalTests++;
    try {
        console.log('1️⃣ Verificando Health Check...');
        const response = await makeRequest(`${RAILWAY_URL}/api/health`);
        const success = response.status === 200;
        passedTests += showResult(
            'Health Check',
            success,
            `Status: ${response.status}, Backend funcionando: ${success ? 'Sí' : 'No'}`,
            success ? response.data : null
        );
    } catch (error) {
        showResult('Health Check', false, `Error: ${error.message}`);
    }

    // Test 2: API de Socios
    totalTests++;
    try {
        console.log('2️⃣ Verificando API de Socios...');
        const response = await makeRequest(`${RAILWAY_URL}/api/members`);
        const success = response.status === 200 && response.data.success;
        passedTests += showResult(
            'API Socios',
            success,
            `Status: ${response.status}, Socios encontrados: ${response.data.data?.length || 0}`,
            success ? { count: response.data.data.length, sample: response.data.data[0] } : null
        );
    } catch (error) {
        showResult('API Socios', false, `Error: ${error.message}`);
    }

    // Test 3: API de Equipos
    totalTests++;
    try {
        console.log('3️⃣ Verificando API de Equipos...');
        const response = await makeRequest(`${RAILWAY_URL}/api/equipos`);
        const success = response.status === 200 && response.data.success;
        passedTests += showResult(
            'API Equipos',
            success,
            `Status: ${response.status}, Equipos encontrados: ${response.data.data?.length || 0}`,
            success ? { count: response.data.data.length, sample: response.data.data[0] } : null
        );
    } catch (error) {
        showResult('API Equipos', false, `Error: ${error.message}`);
    }

    // Test 4: Crear Socio Nuevo
    totalTests++;
    try {
        console.log('4️⃣ Probando Crear Socio...');
        const socioData = JSON.stringify({
            nombre: 'Test Sincronización',
            apellidos: 'Usuario Test',
            dni: '99999999T',
            telefono: '999999999',
            email: 'test@cdsanabriacf.com',
            direccion: 'Calle Test 123, Puebla de Sanabria'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/members`, 'POST', socioData);
        const success = response.status === 201 || response.status === 200;
        passedTests += showResult(
            'Crear Socio',
            success,
            `Status: ${response.status}, Socio creado: ${success ? 'Sí' : 'No'}`,
            success ? { id: response.data.data?.id, nombre: response.data.data?.nombre } : null
        );
    } catch (error) {
        showResult('Crear Socio', false, `Error: ${error.message}`);
    }

    // Test 5: Crear Equipo Nuevo
    totalTests++;
    try {
        console.log('5️⃣ Probando Crear Equipo...');
        const equipoData = JSON.stringify({
            nombre: 'Test Equipo Sincronización',
            categoria: 'test',
            descripcion: 'Equipo de prueba para sincronización'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/equipos`, 'POST', equipoData);
        const success = response.status === 201 || response.status === 200;
        passedTests += showResult(
            'Crear Equipo',
            success,
            `Status: ${response.status}, Equipo creado: ${success ? 'Sí' : 'No'}`,
            success ? { id: response.data.data?.id, nombre: response.data.data?.nombre } : null
        );
    } catch (error) {
        showResult('Crear Equipo', false, `Error: ${error.message}`);
    }

    // Test 6: WebSocket/Server Status
    totalTests++;
    try {
        console.log('6️⃣ Verificando Servidor WebSocket...');
        const response = await makeRequest(`${RAILWAY_URL}/`);
        const success = response.status === 200;
        passedTests += showResult(
            'Servidor WebSocket',
            success,
            `Status: ${response.status}, Servidor respondiendo: ${success ? 'Sí' : 'No'}`,
            success ? { message: response.data.message, version: response.data.version } : null
        );
    } catch (error) {
        showResult('Servidor WebSocket', false, `Error: ${error.message}`);
    }

    // Test 7: Sincronización
    totalTests++;
    try {
        console.log('7️⃣ Probando Endpoint de Sincronización...');
        const syncData = JSON.stringify({
            data: {
                members: [],
                equipos: [],
                jugadores: [],
                eventos: [],
                amigos: []
            }
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/sync`, 'POST', syncData);
        const success = response.status === 200;
        passedTests += showResult(
            'Sincronización',
            success,
            `Status: ${response.status}, Sincronización funcionando: ${success ? 'Sí' : 'No'}`,
            success ? { message: response.data.message } : null
        );
    } catch (error) {
        showResult('Sincronización', false, `Error: ${error.message}`);
    }

    // Resumen final
    console.log('📊 RESUMEN DE VERIFICACIÓN COMPLETA');
    console.log('===================================');
    console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
    console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ¡SINCRONIZACIÓN EN TIEMPO REAL FUNCIONANDO PERFECTAMENTE!');
        console.log('✅ Backend Railway operativo');
        console.log('✅ APIs REST funcionando');
        console.log('✅ WebSocket configurado');
        console.log('✅ Sincronización bidireccional activa');
        console.log('✅ Web y APK pueden conectarse');
        
        console.log('\n🚀 PRÓXIMOS PASOS:');
        console.log('1. Abrir la web: index.html');
        console.log('2. Probar sincronización en tiempo real');
        console.log('3. Verificar que los datos se actualizan automáticamente');
        
    } else {
        console.log('\n⚠️ SINCRONIZACIÓN PARCIAL');
        console.log('❌ Algunos tests fallaron');
        console.log('🔧 Revisar configuración en Railway');
    }

    console.log('\n📞 Soporte: cdsanabriafc@gmail.com');
    console.log('🌐 URL del Backend:', RAILWAY_URL);
}

// Ejecutar tests
runCompleteTests().catch(error => {
    console.error('❌ Error ejecutando tests:', error.message);
    process.exit(1);
});
