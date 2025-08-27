const https = require('https');

const RAILWAY_URL = 'https://turis-production.up.railway.app';

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'turis-production.up.railway.app',
            port: 443,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(body);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testServer() {
    console.log('🔍 Probando conexión al servidor...');
    
    try {
        // Test 1: Health check
        console.log('\n1️⃣ Health Check...');
        const health = await makeRequest('/api/health');
        console.log('✅ Health Check:', health.status, health.data);
        
        // Test 2: Obtener socios
        console.log('\n2️⃣ Obtener Socios...');
        const members = await makeRequest('/api/members');
        console.log('✅ Socios:', members.status, members.data);
        
        // Test 3: Login de Lucas
        console.log('\n3️⃣ Login de Lucas...');
        const login = await makeRequest('/api/auth/login', 'POST', {
            email: 'lucas.caballero@example.com',
            password: '123456',
            type: 'socio'
        });
        console.log('✅ Login:', login.status, login.data);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testServer();
