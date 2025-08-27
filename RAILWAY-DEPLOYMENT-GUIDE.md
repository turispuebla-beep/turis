# 🚀 Guía de Despliegue en Railway - CD Sanabria CF

## 📋 Resumen del Proyecto

Este proyecto incluye:
- **Backend Node.js** con Express y Socket.IO para sincronización en tiempo real
- **Base de datos local** (IndexedDB) con sincronización automática
- **API REST** completa para gestión del club de fútbol
- **WebSocket** para actualizaciones en tiempo real

## 🎯 Objetivo

Desplegar el backend en Railway para que la aplicación web y APK se sincronicen en tiempo real.

## 📁 Estructura del Proyecto

```
CDSANABRIACF/
├── backend/                 # Backend para Railway
│   ├── server.js           # Servidor principal
│   ├── package.json        # Dependencias
│   ├── railway.json        # Configuración Railway
│   └── ...
├── database.js             # Base de datos local
├── realtime-sync.js        # Sincronización en tiempo real
└── index.html              # Aplicación principal
```

## 🚀 Pasos para Desplegar en Railway

### 1. Preparar el Backend

El backend ya está configurado con:
- ✅ Express.js con Socket.IO
- ✅ API REST completa
- ✅ Autenticación JWT
- ✅ Sincronización en tiempo real
- ✅ Configuración Railway

### 2. Crear Cuenta en Railway

1. Ve a [Railway.app](https://railway.app)
2. Regístrate con tu cuenta de GitHub
3. Crea un nuevo proyecto

### 3. Conectar el Repositorio

1. En Railway, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca tu repositorio: `CDSANABRIACF`
4. Selecciona el directorio `backend/`

### 4. Configurar Variables de Entorno

En Railway, ve a la pestaña "Variables" y añade:

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
JWT_SECRET=cdsanabriacf_jwt_secret_2024
ADMIN_EMAIL=amco@gmx.es
ADMIN_PASSWORD=533712
CONTACT_EMAIL=cdsanabriafc@gmail.com
CLUB_NAME=CDSANABRIACF
CLUB_LOCATION=Puebla de Sanabria, Zamora
```

### 5. Desplegar

1. Railway detectará automáticamente que es un proyecto Node.js
2. Instalará las dependencias desde `package.json`
3. Ejecutará `npm start` para iniciar el servidor
4. El despliegue tomará 2-3 minutos

### 6. Obtener la URL

Una vez desplegado, Railway te dará una URL como:
```
https://tu-proyecto-production.up.railway.app
```

## 🔧 Configurar la Aplicación

### 1. Actualizar URL del Backend

En `database.js` y `realtime-sync.js`, actualiza la URL:

```javascript
const BACKEND_URL = 'https://tu-proyecto-production.up.railway.app';
```

### 2. Añadir Socket.IO a la Aplicación

En `index.html`, añade antes de cerrar `</head>`:

```html
<script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>
<script src="realtime-sync.js"></script>
```

### 3. Verificar Conexión

Abre la consola del navegador y ejecuta:
```javascript
checkConnectionStatus();
```

## 📱 Configurar APK

### 1. Actualizar Configuración Android

En tu proyecto Android, actualiza la URL del backend en la configuración.

### 2. Recompilar APK

```bash
cd mobile-app
./gradlew assembleRelease
```

## 🔍 Verificar Funcionamiento

### 1. Health Check

Visita: `https://tu-proyecto-production.up.railway.app/api/health`

Deberías ver:
```json
{
  "status": "healthy",
  "database": "mock (simulado)",
  "websocket": "active",
  "timestamp": "2024-01-XX...",
  "stats": {
    "members": 2,
    "equipos": 5,
    "jugadores": 0,
    "eventos": 0,
    "amigos": 0
  }
}
```

### 2. API de Socios

Visita: `https://tu-proyecto-production.up.railway.app/api/members`

### 3. WebSocket

En la consola del navegador deberías ver:
```
🔌 Iniciando sincronización en tiempo real...
✅ Conectado al servidor en tiempo real
```

## 🛠️ Funciones Disponibles

### Backend API

- `GET /api/members` - Obtener socios
- `POST /api/members` - Crear socio
- `PUT /api/members/:id` - Actualizar socio
- `DELETE /api/members/:id` - Eliminar socio
- `GET /api/equipos` - Obtener equipos
- `POST /api/equipos` - Crear equipo
- `GET /api/jugadores` - Obtener jugadores
- `POST /api/jugadores` - Crear jugador
- `GET /api/eventos` - Obtener eventos
- `POST /api/eventos` - Crear evento
- `GET /api/amigos` - Obtener amigos
- `POST /api/amigos` - Crear amigo
- `POST /api/auth/login` - Login administrador
- `POST /api/sync` - Sincronización manual

### WebSocket Events

- `data-sync` - Sincronización de datos
- `member-added` - Socio añadido
- `member-changed` - Socio actualizado
- `member-deleted` - Socio eliminado

## 🔄 Sincronización en Tiempo Real

### Cómo Funciona

1. **Conexión WebSocket**: La aplicación se conecta automáticamente al servidor
2. **Sincronización Bidireccional**: Los cambios se propagan en tiempo real
3. **Fallback HTTP**: Si WebSocket falla, usa polling HTTP
4. **Reconexión Automática**: Se reconecta automáticamente si se pierde la conexión

### Eventos de Sincronización

```javascript
// Escuchar cambios
window.addEventListener('member-added', (event) => {
    console.log('Nuevo socio:', event.detail.member);
});

window.addEventListener('member-changed', (event) => {
    console.log('Socio actualizado:', event.detail.member);
});

window.addEventListener('member-deleted', (event) => {
    console.log('Socio eliminado:', event.detail.id);
});

window.addEventListener('connection-status-changed', (event) => {
    console.log('Estado conexión:', event.detail.connected);
});
```

## 🚨 Solución de Problemas

### Error de CORS

Si hay errores de CORS, verifica que `CORS_ORIGIN=*` esté configurado.

### Error de Conexión WebSocket

1. Verifica que la URL del backend sea correcta
2. Asegúrate de que Socket.IO esté incluido en la página
3. Revisa los logs de Railway

### Error de Despliegue

1. Verifica que `package.json` tenga el script `start`
2. Asegúrate de que `server.js` sea el archivo principal
3. Revisa los logs de Railway para errores específicos

## 📊 Monitoreo

### Logs de Railway

En Railway, ve a la pestaña "Deployments" para ver los logs en tiempo real.

### Métricas

Railway proporciona métricas de:
- CPU y memoria
- Requests por minuto
- Tiempo de respuesta
- Errores

## 🔐 Seguridad

### Variables Sensibles

- `JWT_SECRET`: Clave secreta para tokens JWT
- `ADMIN_PASSWORD`: Contraseña del administrador principal

### CORS

Configurado para permitir todas las origenes (`*`) en desarrollo. Para producción, especifica dominios específicos.

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de Railway
2. Verifica la configuración de variables de entorno
3. Comprueba que la URL del backend sea correcta
4. Asegúrate de que Socket.IO esté incluido en la aplicación

## ✅ Checklist de Despliegue

- [ ] Cuenta Railway creada
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas
- [ ] Despliegue exitoso
- [ ] Health check funciona
- [ ] URL del backend actualizada en la aplicación
- [ ] Socket.IO incluido en la aplicación
- [ ] Conexión WebSocket establecida
- [ ] Sincronización funcionando
- [ ] APK actualizada con nueva URL

## 🎉 ¡Listo!

Una vez completado, tu aplicación tendrá:
- ✅ Sincronización en tiempo real entre web y APK
- ✅ Backend escalable en Railway
- ✅ API REST completa
- ✅ WebSocket para actualizaciones instantáneas
- ✅ Autenticación segura
- ✅ Fallback automático si falla la conexión

¡Tu aplicación del club de fútbol CD Sanabria CF estará completamente sincronizada en tiempo real! ⚽
