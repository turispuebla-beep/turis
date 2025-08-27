
🚀 DESPLIEGUE EN RAILWAY - PASOS AUTOMATIZADOS
==============================================

✅ PREPARACIÓN COMPLETADA:
- Código subido a GitHub: https://github.com/turispuebla-beep/turis.git
- Archivos verificados y correctos
- Dependencias instaladas
- Configuración Railway lista

🚂 PASO 1: CREAR PROYECTO EN RAILWAY
====================================
1. Ir a: https://railway.app
2. Hacer clic: "Start a New Project"
3. Seleccionar: "Deploy from GitHub repo"
4. Autorizar GitHub si es necesario
5. Seleccionar repositorio: turispuebla-beep/turis
6. IMPORTANTE: Seleccionar directorio backend/ como raíz

🔧 PASO 2: CONFIGURAR VARIABLES DE ENTORNO
=========================================
En Railway, ir a la pestaña "Variables" y añadir:

NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
JWT_SECRET=cdsanabriacf_jwt_secret_2024
ADMIN_EMAIL=amco@gmx.es
ADMIN_PASSWORD=533712
CONTACT_EMAIL=cdsanabriafc@gmail.com
CLUB_NAME=CDSANABRIACF
CLUB_LOCATION=Puebla de Sanabria, Zamora

🚀 PASO 3: DESPLEGAR
====================
1. Hacer clic: "Deploy Now"
2. Esperar: 2-3 minutos
3. Copiar la URL generada (ej: https://tu-proyecto.railway.app)

🧪 PASO 4: VERIFICAR DESPLIEGUE
===============================
Ejecutar: node test-railway-deployment.js [URL_DE_RAILWAY]

🔧 PASO 5: ACTUALIZAR URLs
==========================
Una vez verificado, actualizar estas URLs en el código:
- database.js línea 766
- realtime-sync.js línea 8  
- mobile-app/src/config/syncConfig.js línea 5

📊 RESULTADO ESPERADO
=====================
✅ Backend funcionando en Railway
✅ APIs REST operativas
✅ WebSocket conectado
✅ Sincronización en tiempo real
✅ Web y APK conectadas

📞 SOPORTE
==========
Email: cdsanabriafc@gmail.com
Documentación: DEPLOY-RAILWAY.md
Estado: ESTADO-SINCRONIZACION.md

🎯 PRÓXIMO PASO: Ir a Railway.app y seguir los pasos 1-3
