# 🚀 Guía Completa de Despliegue en Railway - CD Sanabria CF

## 📋 Estado Actual

### ✅ **NETLIFY - FUNCIONANDO CORRECTAMENTE**
- **URL**: `https://www.sanabriacf.com` (o URL de Netlify)
- **Estado**: ✅ Funcionando
- **Configuración**: ✅ Correcta

### ❌ **RAILWAY - NECESITA DESPLIEGUE**
- **URL**: `https://cdsanabriacf-backend-production.up.railway.app`
- **Estado**: ❌ No funciona (Error 404)
- **Problema**: Backend no desplegado

## 🔧 Pasos para Desplegar en Railway

### 1. **Preparar el Backend (YA LISTO)**

El backend ya está configurado con:
- ✅ `server.js` - Servidor Express con Socket.IO
- ✅ `package.json` - Dependencias correctas
- ✅ `railway.json` - Configuración Railway
- ✅ `Procfile` - Instrucciones de inicio
- ✅ `env.example` - Variables de entorno

### 2. **Crear Cuenta en Railway**

1. Ve a [Railway.app](https://railway.app)
2. Regístrate con tu cuenta de GitHub
3. Crea un nuevo proyecto

### 3. **Conectar el Repositorio**

1. En Railway, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca tu repositorio: `CDSANABRIACF`
4. **IMPORTANTE**: Selecciona el directorio `backend/` como raíz del proyecto

### 4. **Configurar Variables de Entorno**

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

### 5. **Desplegar**

1. Railway detectará automáticamente que es un proyecto Node.js
2. Instalará las dependencias desde `package.json`
3. Ejecutará `npm start` para iniciar el servidor
4. El despliegue tomará 2-3 minutos

### 6. **Obtener la URL**

Una vez desplegado, Railway te dará una URL como:
```
https://tu-proyecto-production.up.railway.app
```

## 🔍 Verificar el Despliegue

### 1. **Health Check**
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

### 2. **API Root**
Visita: `https://tu-proyecto-production.up.railway.app/`

### 3. **Socios API**
Visita: `https://tu-proyecto-production.up.railway.app/api/members`

## 🔧 Actualizar la Aplicación

### 1. **Actualizar URL del Backend**

Una vez que tengas la URL de Railway, actualiza estos archivos:

**En `database.js`:**
```javascript
const BACKEND_URL = 'https://tu-proyecto-production.up.railway.app';
```

**En `realtime-sync.js`:**
```javascript
const backendUrl = 'https://tu-proyecto-production.up.railway.app';
```

**En `mobile-app/src/config/syncConfig.js`:**
```javascript
export const BACKEND_URL = 'https://tu-proyecto-production.up.railway.app';
```

### 2. **Verificar Sincronización**

1. Abre `sync-test-panel.html` en tu navegador
2. Verifica que la conexión esté establecida
3. Prueba añadir/editar/eliminar socios
4. Verifica que los cambios se sincronicen en tiempo real

## 📱 Configurar APK

### 1. **Actualizar Configuración**
En tu proyecto Android, actualiza la URL del backend.

### 2. **Recompilar APK**
```bash
cd mobile-app
./gradlew assembleRelease
```

## 🚨 Solución de Problemas

### Error 404 - Application not found
- **Causa**: El proyecto no está desplegado en Railway
- **Solución**: Seguir los pasos de despliegue arriba

### Error de CORS
- **Causa**: CORS no configurado correctamente
- **Solución**: Verificar que `CORS_ORIGIN=*` esté en las variables de entorno

### Error de Conexión WebSocket
- **Causa**: Socket.IO no configurado
- **Solución**: Verificar que Socket.IO esté incluido en la página

### Error de Despliegue
- **Causa**: Problemas con `package.json` o `server.js`
- **Solución**: Verificar que el directorio `backend/` sea la raíz del proyecto en Railway

## ✅ Checklist de Despliegue

- [ ] Cuenta Railway creada
- [ ] Repositorio conectado (directorio `backend/`)
- [ ] Variables de entorno configuradas
- [ ] Despliegue exitoso
- [ ] Health check funciona
- [ ] URL del backend actualizada en la aplicación
- [ ] Socket.IO incluido en la aplicación
- [ ] Conexión WebSocket establecida
- [ ] Sincronización funcionando
- [ ] APK actualizada con nueva URL

## 🎉 Resultado Final

Una vez completado, tendrás:

- ✅ **Frontend**: Funcionando en Netlify
- ✅ **Backend**: Funcionando en Railway
- ✅ **Sincronización en tiempo real** entre web y APK
- ✅ **API REST completa** para todas las entidades
- ✅ **WebSocket** para actualizaciones instantáneas
- ✅ **Autenticación segura** con JWT
- ✅ **Fallback automático** si falla la conexión

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de Railway en la pestaña "Deployments"
2. Verifica la configuración de variables de entorno
3. Comprueba que la URL del backend sea correcta
4. Asegúrate de que el directorio `backend/` sea la raíz del proyecto en Railway

¡Tu aplicación del club de fútbol CD Sanabria CF estará completamente sincronizada en tiempo real! ⚽
