# 🚀 DESPLIEGUE AUTOMATIZADO EN RAILWAY - CD SANABRIA CF

## ✅ **PASO 1 COMPLETADO: Código subido a GitHub**
- ✅ Repositorio: `https://github.com/turispuebla-beep/turis.git`
- ✅ Rama: `master`
- ✅ Commit: `f1588fb` - "Preparar para despliegue en Railway"

---

## 🚂 **PASO 2: DESPLEGAR EN RAILWAY**

### **2.1 Crear Proyecto en Railway**

1. **Ir a Railway**: https://railway.app
2. **Hacer clic**: "Start a New Project"
3. **Seleccionar**: "Deploy from GitHub repo"
4. **Autorizar**: Conectar tu cuenta GitHub
5. **Seleccionar repositorio**: `turispuebla-beep/turis`
6. **Configurar directorio**: Seleccionar `backend/` como raíz del proyecto

### **2.2 Configurar Variables de Entorno**

En Railway, ir a la pestaña "Variables" y añadir estas variables:

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

### **2.3 Desplegar**

1. **Hacer clic**: "Deploy Now"
2. **Esperar**: 2-3 minutos para que termine el despliegue
3. **Copiar URL**: La URL generada (ej: `https://tu-proyecto.railway.app`)

---

## 🔧 **PASO 3: ACTUALIZAR URLs EN EL CÓDIGO**

Una vez que tengas la URL de Railway, actualizar estos archivos:

### **3.1 database.js**
```javascript
// Cambiar línea 766
const BACKEND_URL = 'https://tu-proyecto.railway.app';
```

### **3.2 realtime-sync.js**
```javascript
// Cambiar línea 8
this.backendUrl = 'https://tu-proyecto.railway.app';
```

### **3.3 mobile-app/src/config/syncConfig.js**
```javascript
// Cambiar línea 5
export const BACKEND_URL = 'https://tu-proyecto.railway.app';
```

---

## 🧪 **PASO 4: VERIFICAR DESPLIEGUE**

### **4.1 Health Check**
```bash
curl https://tu-proyecto.railway.app/api/health
```

**Respuesta esperada:**
```json
{
  "status": "OK",
  "message": "CD Sanabria CF Backend funcionando",
  "timestamp": "2024-08-27T15:30:00.000Z"
}
```

### **4.2 Probar APIs**
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

### **4.3 Probar WebSocket**
```javascript
// En consola del navegador
const socket = io('https://tu-proyecto.railway.app');
socket.on('connect', () => console.log('✅ Conectado al WebSocket'));
```

---

## 📊 **PASO 5: VERIFICAR SINCRONIZACIÓN**

### **5.1 Abrir Panel de Verificación**
- Abrir: `verificar-sincronizacion.html`
- Hacer clic: "Sincronización Completa"
- Verificar: Todos los indicadores en verde

### **5.2 Probar Sincronización Bidireccional**
1. **Web → Railway**: Añadir socio desde la web
2. **Railway → Web**: Verificar que aparece en tiempo real
3. **APK → Railway**: Simular envío desde APK
4. **Railway → APK**: Verificar recepción

---

## 🎯 **RESULTADO FINAL ESPERADO**

### ✅ **Backend en Railway**
- URL: `https://tu-proyecto.railway.app`
- APIs REST funcionando
- WebSocket conectado
- Base de datos en memoria operativa

### ✅ **Sincronización Completa**
- Web ↔ Railway funcionando
- APK ↔ Railway funcionando
- Tiempo real activo
- Datos sincronizados automáticamente

### ✅ **Funcionalidades**
- Login administrador: `amco@gmx.es` / `533712`
- Gestión de socios, equipos, eventos
- Sincronización en tiempo real
- Interfaz web y APK conectadas

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Application not found"**
- Verificar que el directorio `backend/` esté seleccionado
- Comprobar que `package.json` esté en la raíz del proyecto

### **Error: "Module not found"**
- Railway ejecutará automáticamente `npm install`
- Verificar que todas las dependencias estén en `package.json`

### **Error: "CORS"**
- Verificar que `CORS_ORIGIN=*` esté configurado
- Comprobar que el frontend use la URL correcta

### **Error: "WebSocket connection failed"**
- Verificar que la URL de Railway sea HTTPS
- Comprobar que Socket.IO esté configurado correctamente

---

## 📞 **SOPORTE**

- **Email**: cdsanabriafc@gmail.com
- **Documentación**: `DEPLOY-RAILWAY.md`
- **Estado**: `ESTADO-SINCRONIZACION.md`
- **Verificación**: `verificar-sincronizacion.html`

---

## ✅ **CHECKLIST FINAL**

- [x] Código subido a GitHub
- [ ] Proyecto creado en Railway
- [ ] Directorio `backend/` seleccionado
- [ ] Variables de entorno configuradas
- [ ] Despliegue completado
- [ ] URLs actualizadas en el código
- [ ] Health check funcionando
- [ ] APIs REST probadas
- [ ] WebSocket conectado
- [ ] Sincronización verificada

**Estado**: 🟡 **EN PROGRESO** - Código subido, pendiente despliegue en Railway
