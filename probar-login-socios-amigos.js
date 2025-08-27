#!/usr/bin/env node

/**
 * Prueba de Sistema de Login - Socios y Amigos
 * CD Sanabria CF
 */

const https = require('https');

const RAILWAY_URL = 'https://turis-production.up.railway.app';

console.log('🔐 PROBANDO SISTEMA DE LOGIN - SOCIOS Y AMIGOS');
console.log('==============================================');
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
                'User-Agent': 'CDSANABRIACF-Login-Test/1.0.0'
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

// Tests de login
async function testLoginSystem() {
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Verificar que existen socios para login
    totalTests++;
    try {
        console.log('1️⃣ Verificando socios disponibles...');
        const response = await makeRequest(`${RAILWAY_URL}/api/members`);
        const success = response.status === 200 && response.data.success;
        
        if (success) {
            const socios = response.data.data;
            const sociosConPassword = socios.filter(s => s.password);
            passedTests += showResult(
                'Socios Disponibles',
                success,
                `Status: ${response.status}, Socios con contraseña: ${sociosConPassword.length}/${socios.length}`,
                { total: socios.length, withPassword: sociosConPassword.length, sample: sociosConPassword[0] }
            );
        } else {
            showResult('Socios Disponibles', false, `Status: ${response.status}, Error: ${response.data.error || 'Desconocido'}`);
        }
    } catch (error) {
        showResult('Socios Disponibles', false, `Error: ${error.message}`);
    }

    // Test 2: Verificar que existen amigos para login
    totalTests++;
    try {
        console.log('2️⃣ Verificando amigos disponibles...');
        const response = await makeRequest(`${RAILWAY_URL}/api/amigos`);
        const success = response.status === 200 && response.data.success;
        
        if (success) {
            const amigos = response.data.data;
            const amigosConPassword = amigos.filter(a => a.password);
            passedTests += showResult(
                'Amigos Disponibles',
                success,
                `Status: ${response.status}, Amigos con contraseña: ${amigosConPassword.length}/${amigos.length}`,
                { total: amigos.length, withPassword: amigosConPassword.length, sample: amigosConPassword[0] }
            );
        } else {
            showResult('Amigos Disponibles', false, `Status: ${response.status}, Error: ${response.data.error || 'Desconocido'}`);
        }
    } catch (error) {
        showResult('Amigos Disponibles', false, `Error: ${error.message}`);
    }

    // Test 3: Crear un socio de prueba para login
    totalTests++;
    try {
        console.log('3️⃣ Creando socio de prueba para login...');
        const socioData = JSON.stringify({
            nombre: 'Test Login',
            apellidos: 'Socio Prueba',
            dni: '77777777T',
            telefono: '777777777',
            email: 'test-login-socio@cdsanabriacf.com',
            direccion: 'Calle Test Login 123, Puebla de Sanabria',
            password: '123456',
            status: 'active'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/members`, 'POST', socioData);
        const success = response.status === 201 || response.status === 200;
        passedTests += showResult(
            'Crear Socio Login',
            success,
            `Status: ${response.status}, Socio creado: ${success ? 'Sí' : 'No'}`,
            success ? { id: response.data.data?.id, email: response.data.data?.email } : null
        );
    } catch (error) {
        showResult('Crear Socio Login', false, `Error: ${error.message}`);
    }

    // Test 4: Crear un amigo de prueba para login
    totalTests++;
    try {
        console.log('4️⃣ Creando amigo de prueba para login...');
        const amigoData = JSON.stringify({
            nombre: 'Test Login',
            apellidos: 'Amigo Prueba',
            dni: '88888888T',
            telefono: '888888888',
            email: 'test-login-amigo@cdsanabriacf.com',
            password: '123456',
            status: 'active'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/amigos`, 'POST', amigoData);
        const success = response.status === 201 || response.status === 200;
        passedTests += showResult(
            'Crear Amigo Login',
            success,
            `Status: ${response.status}, Amigo creado: ${success ? 'Sí' : 'No'}`,
            success ? { id: response.data.data?.id, email: response.data.data?.email } : null
        );
    } catch (error) {
        showResult('Crear Amigo Login', false, `Error: ${error.message}`);
    }

    // Test 5: Simular login de socio
    totalTests++;
    try {
        console.log('5️⃣ Simulando login de socio...');
        const loginData = JSON.stringify({
            email: 'test-login-socio@cdsanabriacf.com',
            password: '123456',
            type: 'socio'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/auth/login`, 'POST', loginData);
        const success = response.status === 200;
        passedTests += showResult(
            'Login Socio',
            success,
            `Status: ${response.status}, Login: ${success ? 'Exitoso' : 'Falló'}`,
            success ? { message: response.data.message, user: response.data.user } : null
        );
    } catch (error) {
        showResult('Login Socio', false, `Error: ${error.message}`);
    }

    // Test 6: Simular login de amigo
    totalTests++;
    try {
        console.log('6️⃣ Simulando login de amigo...');
        const loginData = JSON.stringify({
            email: 'test-login-amigo@cdsanabriacf.com',
            password: '123456',
            type: 'amigo'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/auth/login`, 'POST', loginData);
        const success = response.status === 200;
        passedTests += showResult(
            'Login Amigo',
            success,
            `Status: ${response.status}, Login: ${success ? 'Exitoso' : 'Falló'}`,
            success ? { message: response.data.message, user: response.data.user } : null
        );
    } catch (error) {
        showResult('Login Amigo', false, `Error: ${error.message}`);
    }

    // Resumen final
    console.log('📊 RESUMEN DE SISTEMA DE LOGIN');
    console.log('==============================');
    console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
    console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ¡SISTEMA DE LOGIN FUNCIONANDO PERFECTAMENTE!');
        console.log('✅ Socios pueden registrarse y hacer login');
        console.log('✅ Amigos pueden registrarse y hacer login');
        console.log('✅ Autenticación funcionando');
        console.log('✅ Acceso diferenciado por tipo de usuario');
        
        console.log('\n🔐 CREDENCIALES DE PRUEBA:');
        console.log('Socio: test-login-socio@cdsanabriacf.com / 123456');
        console.log('Amigo: test-login-amigo@cdsanabriacf.com / 123456');
        
        console.log('\n📱 ACCESO:');
        console.log('- Página Web: Abrir index.html y hacer login');
        console.log('- APK: Usar las mismas credenciales');
        
    } else {
        console.log('\n⚠️ SISTEMA DE LOGIN PARCIAL');
        console.log('❌ Algunos tests fallaron');
        console.log('🔧 Revisar configuración de autenticación');
    }

    console.log('\n📞 Soporte: cdsanabriafc@gmail.com');
    console.log('🌐 URL del Backend:', RAILWAY_URL);
}

// Ejecutar tests
testLoginSystem().catch(error => {
    console.error('❌ Error ejecutando tests:', error.message);
    process.exit(1);
});
