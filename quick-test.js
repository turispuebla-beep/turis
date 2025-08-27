
#!/usr/bin/env node
// Script de verificación rápida post-despliegue
const https = require('https');

const RAILWAY_URL = process.argv[2];
if (!RAILWAY_URL) {
    console.log('❌ Uso: node quick-test.js [URL_RAILWAY]');
    process.exit(1);
}

console.log('🔍 Verificación rápida de Railway...');
console.log('URL:', RAILWAY_URL);

https.get(RAILWAY_URL + '/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const result = JSON.parse(data);
            if (result.status === 'OK') {
                console.log('✅ Railway funcionando correctamente!');
                console.log('Mensaje:', result.message);
                console.log('Timestamp:', result.timestamp);
            } else {
                console.log('❌ Railway respondió pero con error');
            }
        } catch (e) {
            console.log('❌ Error parseando respuesta');
        }
    });
}).on('error', (err) => {
    console.log('❌ Error conectando a Railway:', err.message);
});
