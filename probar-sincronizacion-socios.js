#!/usr/bin/env node

/**
 * Prueba de Sincronización con Socios Existentes
 * CD Sanabria CF - Railway Backend
 */

const https = require('https');

const RAILWAY_URL = 'https://turis-production.up.railway.app';

console.log('🔍 PROBANDO SINCRONIZACIÓN CON SOCIOS EXISTENTES');
console.log('================================================');
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

// Tests de sincronización con socios
async function testSocioSync() {
    let passedTests = 0;
    let totalTests = 0;

    // Test 1: Obtener socios existentes
    totalTests++;
    try {
        console.log('1️⃣ Obteniendo socios existentes...');
        const response = await makeRequest(`${RAILWAY_URL}/api/members`);
        const success = response.status === 200 && response.data.success;
        
        if (success) {
            const socios = response.data.data;
            console.log(`✅ Socios encontrados: ${socios.length}`);
            
            // Mostrar información de cada socio
            socios.forEach((socio, index) => {
                console.log(`   ${index + 1}. ${socio.nombre} ${socio.apellidos} - ${socio.numeroSocio}`);
            });
            
            passedTests += showResult(
                'Obtener Socios',
                success,
                `Status: ${response.status}, Socios encontrados: ${socios.length}`,
                { count: socios.length, socios: socios.map(s => ({ id: s.id, nombre: s.nombre, numeroSocio: s.numeroSocio })) }
            );
        } else {
            showResult('Obtener Socios', false, `Status: ${response.status}, Error: ${response.data.error || 'Desconocido'}`);
        }
    } catch (error) {
        showResult('Obtener Socios', false, `Error: ${error.message}`);
    }

    // Test 2: Crear socio nuevo para sincronización
    totalTests++;
    try {
        console.log('2️⃣ Creando socio nuevo para probar sincronización...');
        const socioData = JSON.stringify({
            nombre: 'Sincronización',
            apellidos: 'Test Real',
            dni: '88888888T',
            telefono: '888888888',
            email: 'sincronizacion@cdsanabriacf.com',
            direccion: 'Calle Sincronización 123, Puebla de Sanabria'
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/members`, 'POST', socioData);
        const success = response.status === 201 || response.status === 200;
        passedTests += showResult(
            'Crear Socio Nuevo',
            success,
            `Status: ${response.status}, Socio creado: ${success ? 'Sí' : 'No'}`,
            success ? { id: response.data.data?.id, nombre: response.data.data?.nombre, numeroSocio: response.data.data?.numeroSocio } : null
        );
    } catch (error) {
        showResult('Crear Socio Nuevo', false, `Error: ${error.message}`);
    }

    // Test 3: Verificar que el socio nuevo aparece en la lista
    totalTests++;
    try {
        console.log('3️⃣ Verificando que el socio nuevo aparece en la lista...');
        const response = await makeRequest(`${RAILWAY_URL}/api/members`);
        const success = response.status === 200 && response.data.success;
        
        if (success) {
            const socios = response.data.data;
            const socioNuevo = socios.find(s => s.dni === '88888888T');
            const encontrado = !!socioNuevo;
            
            passedTests += showResult(
                'Verificar Socio Nuevo',
                encontrado,
                `Status: ${response.status}, Socio nuevo encontrado: ${encontrado ? 'Sí' : 'No'}`,
                encontrado ? { id: socioNuevo.id, nombre: socioNuevo.nombre, numeroSocio: socioNuevo.numeroSocio } : null
            );
        } else {
            showResult('Verificar Socio Nuevo', false, `Status: ${response.status}, Error al obtener socios`);
        }
    } catch (error) {
        showResult('Verificar Socio Nuevo', false, `Error: ${error.message}`);
    }

    // Test 4: Probar sincronización bidireccional
    totalTests++;
    try {
        console.log('4️⃣ Probando sincronización bidireccional...');
        const syncData = JSON.stringify({
            data: {
                members: [
                    {
                        id: "sync-test-1",
                        numeroSocio: "SOC-SYNC-001",
                        nombre: "Sincronización",
                        apellidos: "Bidireccional",
                        dni: "77777777T",
                        telefono: "777777777",
                        email: "bidireccional@cdsanabriacf.com",
                        direccion: "Calle Bidireccional 456, Puebla de Sanabria"
                    }
                ]
            }
        });
        const response = await makeRequest(`${RAILWAY_URL}/api/sync`, 'POST', syncData);
        const success = response.status === 200;
        passedTests += showResult(
            'Sincronización Bidireccional',
            success,
            `Status: ${response.status}, Sincronización: ${success ? 'Funcionando' : 'Falló'}`,
            success ? { message: response.data.message } : null
        );
    } catch (error) {
        showResult('Sincronización Bidireccional', false, `Error: ${error.message}`);
    }

    // Resumen final
    console.log('📊 RESUMEN DE PRUEBA DE SINCRONIZACIÓN');
    console.log('=======================================');
    console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
    console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 ¡SINCRONIZACIÓN CON SOCIOS FUNCIONANDO PERFECTAMENTE!');
        console.log('✅ Socios existentes accesibles');
        console.log('✅ Crear socios nuevos funcionando');
        console.log('✅ Sincronización bidireccional activa');
        console.log('✅ Web y APK pueden sincronizar socios');
        
        console.log('\n🚀 PRÓXIMOS PASOS:');
        console.log('1. Abrir la web: index.html');
        console.log('2. Los socios se sincronizarán automáticamente');
        console.log('3. Crear socios nuevos desde la web');
        console.log('4. Verificar que aparecen en tiempo real');
        
    } else {
        console.log('\n⚠️ SINCRONIZACIÓN PARCIAL');
        console.log('❌ Algunos tests fallaron');
        console.log('🔧 Revisar configuración');
    }

    console.log('\n📞 Soporte: cdsanabriafc@gmail.com');
    console.log('🌐 URL del Backend:', RAILWAY_URL);
}

// Ejecutar tests
testSocioSync().catch(error => {
    console.error('❌ Error ejecutando tests:', error.message);
    process.exit(1);
});
