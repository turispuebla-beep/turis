# 🚀 Despliegue Automatizado en Railway - CD Sanabria CF

## 📋 **PASOS PARA DESPLEGAR AUTOMÁTICAMENTE**

### **PASO 1: Preparar el Repositorio**
```bash
# Asegurar que todos los archivos estén en el repositorio
git add .
git commit -m "Preparar para despliegue en Railway"
git push origin main
```

### **PASO 2: Crear Proyecto en Railway**
1. **Ir a**: https://railway.app
2. **Hacer clic**: "Start a New Project"
3. **Seleccionar**: "Deploy from GitHub repo"
4. **Conectar**: Tu repositorio GitHub
5. **Seleccionar**: Directorio `backend/` como raíz del proyecto

### **PASO 3: Configurar Variables de Entorno**
En Railway, ir a la pestaña "Variables" y añadir:

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

### **PASO 4: Desplegar**
1. **Hacer clic**: "Deploy Now"
2. **Esperar**: Que termine el despliegue
3. **Copiar**: La URL generada (ej: https://tu-proyecto.railway.app)

### **PASO 5: Actualizar URLs en el Código**
Una vez desplegado, actualizar las URLs en:

1. **database.js**:
```javascript
const BACKEND_URL = 'https://tu-proyecto.railway.app';
```

2. **realtime-sync.js**:
```javascript
this.backendUrl = 'https://tu-proyecto.railway.app';
```

3. **mobile-app/src/config/syncConfig.js**:
```javascript
export const BACKEND_URL = 'https://tu-proyecto.railway.app';
```

### **PASO 6: Verificar Despliegue**
```bash
# Probar el health check
curl https://tu-proyecto.railway.app/api/health

# Probar obtener socios
curl https://tu-proyecto.railway.app/api/members
```

---

## 🔧 **ARCHIVOS NECESARIOS PARA RAILWAY**

### **backend/package.json** ✅
```json
{
  "name": "cdsanabriacf-backend",
  "version": "2.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "socket.io": "^4.7.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  }
}
```

### **backend/server.js** ✅
- Servidor Express con Socket.IO
- APIs REST completas
- WebSocket para tiempo real

### **backend/railway.json** ✅
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

---

## 📊 **VERIFICACIÓN POST-DESPLIEGUE**

### **1. Health Check**
```bash
curl https://tu-proyecto.railway.app/api/health
# Debe devolver: {"status":"OK","message":"CD Sanabria CF Backend funcionando"}
```

### **2. APIs REST**
```bash
# Listar socios
curl https://tu-proyecto.railway.app/api/members

# Listar equipos
curl https://tu-proyecto.railway.app/api/equipos

# Login administrador
curl -X POST https://tu-proyecto.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"amco@gmx.es","password":"533712"}'
```

### **3. WebSocket**
```javascript
// Probar en consola del navegador
const socket = io('https://tu-proyecto.railway.app');
socket.on('connect', () => console.log('Conectado al WebSocket'));
```

---

## 🎯 **RESULTADO ESPERADO**

Después del despliegue exitoso:

✅ **Backend funcionando en Railway**
- URL: `https://tu-proyecto.railway.app`
- APIs REST operativas
- WebSocket conectado
- Base de datos en memoria funcionando

✅ **Sincronización completa**
- Web ↔ Railway funcionando
- APK ↔ Railway funcionando
- Tiempo real activo

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Application not found"**
- Verificar que el directorio `backend/` esté seleccionado
- Comprobar que `package.json` esté en la raíz del proyecto

### **Error: "Module not found"**
- Ejecutar `npm install` en Railway
- Verificar que todas las dependencias estén en `package.json`

### **Error: "Port already in use"**
- Railway asignará automáticamente el puerto
- Usar `process.env.PORT` en lugar de puerto fijo

### **Error: "CORS"**
- Verificar que `CORS_ORIGIN=*` esté configurado
- Comprobar que el frontend use la URL correcta

---

## 📞 **SOPORTE**

- **Email**: cdsanabriafc@gmail.com
- **Documentación**: README-RAILWAY.md
- **Estado**: ESTADO-SINCRONIZACION.md

---

## ✅ **CHECKLIST FINAL**

- [ ] Repositorio subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] Directorio `backend/` seleccionado
- [ ] Variables de entorno configuradas
- [ ] Despliegue completado
- [ ] URLs actualizadas en el código
- [ ] Health check funcionando
- [ ] APIs REST probadas
- [ ] WebSocket conectado
- [ ] Sincronización verificada

**Estado**: 🟡 **LISTO PARA DESPLEGAR**
