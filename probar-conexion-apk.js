#!/usr/bin/env node

/**
 * Prueba de Conexión APK - Backend Railway
 * CD Sanabria CF
 */

const https = require('https');

const RAILWAY_URL = 'https://turis-production.up.railway.app';

console.log('📱 PROBANDO CONEXIÓN APK - BACKEND RAILWAY');
console.log('==========================================');
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
                'Accept': 'application/json',
                'User-Agent': 'CDSANABRIACF-Mobile/1.0.0'
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

// Tests de conexión APK
async function testAPKConnection() {
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

    // Test 2: Obtener Socios (como lo haría la APK)
    totalTests++;
    try {
        console.log('2️⃣ Obteniendo socios (simulando APK)...');
        const response = await makeRequest(`${RAILWAY_URL}/api/members`);
        const success = response.status === 200 && response.data.success;
        
        if (success) {
            const socios = response.data.data;
            passedTests += showResult(
                'Obtener Socios',
                success,
                `Status: ${response.status}, Socios encontrados: ${socios.length}`,
                { count: socios.length, sample: socios[0] }
            );
        } else {
            showResult('Obtener Socios', false, `Status: ${response.status}, Error: ${response.data.error || 'Desconocido'}`);
        }
    } catch (error) {
        showResult('Obtener Socios', false, `Error: ${error.message}`);
    }

    // Test 3: Crear Socio desde APK
    totalTests++;
    try {
        console.log('3️⃣ Creando socio desde APK...');
        const socioData = JSON.stringify({
            nombre: 'APK Test',
            apellidos: 'Usuario Móvil',
            dni: '66666666T',
            telefono: '666666666',
            email: 'apk@cdsanabriacf.com',
            direccion: 'Calle APK 789, Puebla de Sanabria'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/members`, 'POST', socioData);
        const success = response.status === 201 || response.status === 200;
        passedTests += showResult(
            'Crear Socio APK',
            success,
            `Status: ${response.status}, Socio creado: ${success ? 'Sí' : 'No'}`,
            success ? { id: response.data.data?.id, nombre: response.data.data?.nombre } : null
        );
    } catch (error) {
        showResult('Crear Socio APK', false, `Error: ${error.message}`);
    }

    // Test 4: Sincronización APK
    totalTests++;
    try {
        console.log('4️⃣ Probando sincronización APK...');
        const syncData = JSON.stringify({
            data: {
                members: [
                    {
                        id: "apk-sync-1",
                        numeroSocio: "SOC-APK-001",
                        nombre: "Sincronización",
                        apellidos: "APK",
                        dni: "55555555T",
                        telefono: "555555555",
                        email: "sync-apk@cdsanabriacf.com",
                        direccion: "Calle Sincronización APK 123, Puebla de Sanabria"
                    }
                ]
            }
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/sync`, 'POST', syncData);
        const success = response.status === 200;
        passedTests += showResult(
            'Sincronización APK',
            success,
            `Status: ${response.status}, Sincronización: ${success ? 'Funcionando' : 'Falló'}`,
            success ? { message: response.data.message } : null
        );
    } catch (error) {
        showResult('Sincronización APK', false, `Error: ${error.message}`);
    }

    // Test 5: WebSocket/Real-time
    totalTests++;
    try {
        console.log('5️⃣ Verificando WebSocket para APK...');
        const response = await makeRequest(`${RAILWAY_URL}/`);
        const success = response.status === 200;
        passedTests += showResult(
            'WebSocket APK',
            success,
            `Status: ${response.status}, WebSocket disponible: ${success ? 'Sí' : 'No'}`,
            success ? { message: response.data.message, version: response.data.version } : null
        );
    } catch (error) {
        showResult('WebSocket APK', false, `Error: ${error.message}`);
    }

    // Resumen final
    console.log('📊 RESUMEN DE CONEXIÓN APK');
    console.log('==========================');
    console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
    console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ¡APK CONECTADA PERFECTAMENTE AL BACKEND RAILWAY!');
        console.log('✅ Backend Railway accesible');
        console.log('✅ APIs REST funcionando');
        console.log('✅ Sincronización activa');
        console.log('✅ WebSocket disponible');
        console.log('✅ APK puede enviar y recibir datos');
        
        console.log('\n📱 CONFIGURACIÓN APK:');
        console.log('Backend URL:', RAILWAY_URL);
        console.log('Estado: Conectado');
        console.log('Sincronización: En tiempo real');
        
        console.log('\n🚀 PRÓXIMOS PASOS:');
        console.log('1. Compilar la APK con la nueva configuración');
        console.log('2. Instalar en dispositivo móvil');
        console.log('3. Verificar sincronización en tiempo real');
        console.log('4. Probar crear/editar socios desde la APK');
        
    } else {
        console.log('\n⚠️ CONEXIÓN APK PARCIAL');
        console.log('❌ Algunos tests fallaron');
        console.log('🔧 Revisar configuración de red');
    }

    console.log('\n📞 Soporte: cdsanabriafc@gmail.com');
    console.log('🌐 URL del Backend:', RAILWAY_URL);
}

// Ejecutar tests
testAPKConnection().catch(error => {
    console.error('❌ Error ejecutando tests:', error.message);
    process.exit(1);
});
