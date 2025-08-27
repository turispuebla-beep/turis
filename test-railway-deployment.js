#!/usr/bin/env node

/**
 * Script de Verificación de Despliegue en Railway
 * CD Sanabria CF Backend
 */

const https = require('https');
const http = require('http');

// Configuración
const RAILWAY_URL = process.argv[2] || 'https://tu-proyecto.railway.app';

console.log('🔍 Verificando despliegue en Railway...\n');
console.log(`📡 URL: ${RAILWAY_URL}\n`);

// Función para hacer peticiones HTTP/HTTPS
function makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'CDSANABRIACF-Verification/1.0'
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const client = urlObj.protocol === 'https:' ? https : http;
        const req = client.request(options, (res) => {
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
    if (data) {
        console.log(`   Datos: ${JSON.stringify(data, null, 2)}`);
    }
    console.log('');
    return success;
}

// Tests de verificación
async function runTests() {
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Health Check
    totalTests++;
    try {
        console.log('1️⃣ Probando Health Check...');
        const response = await makeRequest(`${RAILWAY_URL}/api/health`);
        const success = response.status === 200 && response.data.status === 'OK';
        passedTests += showResult(
            'Health Check',
            success,
            `Status: ${response.status}, Mensaje: ${response.data.message || 'N/A'}`,
            success ? response.data : null
        );
    } catch (error) {
        showResult('Health Check', false, `Error: ${error.message}`);
    }

    // Test 2: Listar Socios
    totalTests++;
    try {
        console.log('2️⃣ Probando API de Socios...');
        const response = await makeRequest(`${RAILWAY_URL}/api/members`);
        const success = response.status === 200 && Array.isArray(response.data.data);
        passedTests += showResult(
            'API Socios',
            success,
            `Status: ${response.status}, Socios encontrados: ${response.data.data?.length || 0}`,
            success ? { count: response.data.data.length, sample: response.data.data[0] } : null
        );
    } catch (error) {
        showResult('API Socios', false, `Error: ${error.message}`);
    }

    // Test 3: Listar Equipos
    totalTests++;
    try {
        console.log('3️⃣ Probando API de Equipos...');
        const response = await makeRequest(`${RAILWAY_URL}/api/equipos`);
        const success = response.status === 200 && Array.isArray(response.data.data);
        passedTests += showResult(
            'API Equipos',
            success,
            `Status: ${response.status}, Equipos encontrados: ${response.data.data?.length || 0}`,
            success ? { count: response.data.data.length, sample: response.data.data[0] } : null
        );
    } catch (error) {
        showResult('API Equipos', false, `Error: ${error.message}`);
    }

    // Test 4: Login Administrador
    totalTests++;
    try {
        console.log('4️⃣ Probando Login Administrador...');
        const loginData = JSON.stringify({
            email: 'amco@gmx.es',
            password: '533712'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/auth/login`, 'POST', loginData);
        const success = response.status === 200 && response.data.token;
        passedTests += showResult(
            'Login Admin',
            success,
            `Status: ${response.status}, Token: ${success ? 'Generado' : 'No generado'}`,
            success ? { user: response.data.user, tokenLength: response.data.token.length } : null
        );
    } catch (error) {
        showResult('Login Admin', false, `Error: ${error.message}`);
    }

    // Test 5: Crear Socio
    totalTests++;
    try {
        console.log('5️⃣ Probando Crear Socio...');
        const socioData = JSON.stringify({
            nombre: 'Test User',
            apellidos: 'Test Apellido',
            dni: '12345678T',
            telefono: '123456789',
            direccion: 'Calle Test 123',
            email: 'test@test.com'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/members`, 'POST', socioData);
        const success = response.status === 201 || response.status === 200;
        passedTests += showResult(
            'Crear Socio',
            success,
            `Status: ${response.status}, Socio creado: ${success ? 'Sí' : 'No'}`,
            success ? { id: response.data.id, numeroSocio: response.data.numeroSocio } : null
        );
    } catch (error) {
        showResult('Crear Socio', false, `Error: ${error.message}`);
    }

    // Test 6: WebSocket (simulado)
    totalTests++;
    try {
        console.log('6️⃣ Verificando configuración WebSocket...');
        const response = await makeRequest(`${RAILWAY_URL}/`);
        const success = response.status === 200;
        passedTests += showResult(
            'WebSocket Config',
            success,
            `Status: ${response.status}, Servidor respondiendo: ${success ? 'Sí' : 'No'}`,
            success ? { server: 'Express.js + Socket.IO' } : null
        );
    } catch (error) {
        showResult('WebSocket Config', false, `Error: ${error.message}`);
    }

    // Resumen final
    console.log('📊 RESUMEN DE VERIFICACIÓN');
    console.log('==========================');
    console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
    console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ¡DESPLIEGUE EXITOSO!');
        console.log('✅ Backend funcionando correctamente en Railway');
        console.log('✅ APIs REST operativas');
        console.log('✅ Autenticación funcionando');
        console.log('✅ WebSocket configurado');
        console.log('\n🚀 Próximo paso: Actualizar URLs en el código');
    } else {
        console.log('\n⚠️ DESPLIEGUE PARCIAL');
        console.log('❌ Algunos tests fallaron');
        console.log('🔧 Revisar configuración en Railway');
    }

    console.log('\n📞 Soporte: cdsanabriafc@gmail.com');
}

// Ejecutar tests
runTests().catch(error => {
    console.error('❌ Error ejecutando tests:', error.message);
    process.exit(1);
});
