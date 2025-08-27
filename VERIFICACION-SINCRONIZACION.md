# 🔄 Verificación de Sincronización en Tiempo Real - CDSANABRIACF

## 📋 Resumen

Este documento explica cómo verificar que la sincronización en tiempo real funcione correctamente entre la aplicación web y la APK móvil.

## 🎯 Objetivo

Comprobar que los cambios realizados en cualquiera de las dos plataformas (web o APK) se reflejen automáticamente en la otra plataforma en tiempo real.

## 🛠️ Herramientas de Verificación

### 1. Panel de Prueba Web
- **Archivo**: `sync-test-panel.html`
- **Propósito**: Panel de control para verificar sincronización desde la web
- **Acceso**: Abrir en navegador web

### 2. Servicio de Sincronización APK
- **Archivo**: `mobile-app/src/services/SyncService.js`
- **Propósito**: Maneja sincronización en la APK móvil
- **Configuración**: `mobile-app/src/config/syncConfig.js`

## 🚀 Pasos para Verificar Sincronización

### Paso 1: Preparar el Entorno

1. **Desplegar Backend en Railway**
   ```bash
   # Seguir la guía RAILWAY-DEPLOYMENT-GUIDE.md
   # Obtener URL del backend: https://tu-proyecto-production.up.railway.app
   ```

2. **Actualizar URLs en Configuración**
   - En `database.js`: Actualizar `BACKEND_URL`
   - En `realtime-sync.js`: Actualizar `backendUrl`
   - En `mobile-app/src/config/syncConfig.js`: Actualizar `BACKEND_URL`

### Paso 2: Verificar Conexión Web

1. **Abrir Panel de Prueba**
   ```
   Abrir: sync-test-panel.html en navegador
   ```

2. **Verificar Estado de Conexión**
   - Debería mostrar: 🟢 Conectado
   - En logs: "✅ Conexión establecida con el servidor"

3. **Probar Health Check**
   - Clic en "Verificar Backend"
   - Debería mostrar estado "healthy"

### Paso 3: Verificar Conexión APK

1. **Compilar y Instalar APK**
   ```bash
   cd mobile-app
   npm install
   npx expo build:android
   ```

2. **Verificar Logs de Sincronización**
   - En la APK, revisar logs de consola
   - Debería mostrar: "🚀 Inicializando servicio de sincronización..."

### Paso 4: Pruebas de Sincronización

#### Prueba 1: Añadir Socio desde Web

1. **En el Panel Web:**
   - Clic en "Añadir Socio de Prueba"
   - Verificar que aparece en la lista de socios

2. **En la APK:**
   - Verificar que el socio aparece automáticamente
   - Revisar logs: "member-added" event

#### Prueba 2: Añadir Socio desde APK

1. **En la APK:**
   - Usar función de registro de socio
   - Completar formulario y guardar

2. **En el Panel Web:**
   - Verificar que el socio aparece automáticamente
   - Revisar logs: "📡 Sincronización: Socio añadido desde servidor"

#### Prueba 3: Actualizar Socio

1. **Desde cualquiera de las dos plataformas:**
   - Editar datos de un socio existente
   - Guardar cambios

2. **Verificar en la otra plataforma:**
   - Los cambios deberían aparecer automáticamente
   - Revisar logs: "member-changed" event

#### Prueba 4: Eliminar Socio

1. **Desde cualquiera de las dos plataformas:**
   - Eliminar un socio
   - Confirmar eliminación

2. **Verificar en la otra plataforma:**
   - El socio debería desaparecer automáticamente
   - Revisar logs: "member-deleted" event

## 🔍 Verificación Técnica

### Verificar WebSocket (Web)

```javascript
// En consola del navegador
checkConnectionStatus();
// Debería mostrar: { connected: true, backendUrl: "...", reconnectAttempts: 0 }

// Verificar eventos
window.addEventListener('member-added', (event) => {
    console.log('Socio añadido:', event.detail.member);
});
```

### Verificar Sincronización (APK)

```javascript
// En logs de la APK
import syncService from './src/services/SyncService';

// Verificar estado
const status = syncService.getConnectionStatus();
console.log('Estado sincronización:', status);

// Escuchar eventos
syncService.on('member-added', (member) => {
    console.log('Socio añadido en APK:', member);
});
```

## 📊 Métricas de Verificación

### Indicadores de Éxito

1. **Conexión Estable**
   - ✅ WebSocket conectado
   - ✅ Polling HTTP funcionando
   - ✅ Reconexión automática

2. **Sincronización Bidireccional**
   - ✅ Cambios web → APK
   - ✅ Cambios APK → web
   - ✅ Tiempo de sincronización < 5 segundos

3. **Manejo de Errores**
   - ✅ Modo offline funcionando
   - ✅ Cola de operaciones pendientes
   - ✅ Reintentos automáticos

4. **Datos Consistentes**
   - ✅ Mismos datos en ambas plataformas
   - ✅ Timestamps de sincronización actualizados
   - ✅ Sin duplicados

### Indicadores de Problemas

1. **Conexión**
   - ❌ WebSocket no conecta
   - ❌ Polling HTTP falla
   - ❌ No hay reconexión automática

2. **Sincronización**
   - ❌ Cambios no se propagan
   - ❌ Tiempo de sincronización > 30 segundos
   - ❌ Datos inconsistentes

3. **Errores**
   - ❌ Aplicación se cuelga sin conexión
   - ❌ Operaciones se pierden
   - ❌ No hay logs de error

## 🚨 Solución de Problemas

### Problema: WebSocket no conecta

**Síntomas:**
- Indicador de conexión en rojo
- Logs: "Error conectando WebSocket"

**Solución:**
1. Verificar URL del backend
2. Comprobar que Railway esté desplegado
3. Verificar CORS en backend
4. Usar polling HTTP como fallback

### Problema: Sincronización lenta

**Síntomas:**
- Cambios tardan > 30 segundos en aparecer
- Logs: "Error sincronizando datos"

**Solución:**
1. Verificar conectividad de red
2. Comprobar logs del backend
3. Ajustar intervalos de sincronización
4. Verificar tamaño de datos

### Problema: Datos inconsistentes

**Síntomas:**
- Diferentes datos en web y APK
- Duplicados en la base de datos

**Solución:**
1. Verificar IDs únicos
2. Comprobar lógica de merge
3. Limpiar caché local
4. Forzar sincronización completa

## 📱 Comandos de Verificación

### Web (Consola del Navegador)

```javascript
// Verificar estado de conexión
checkConnectionStatus();

// Forzar sincronización
forceSync();

// Verificar datos locales
window.cdsanabriacfDB.getSocios().then(console.log);

// Limpiar logs
clearLogs();
```

### APK (Logs de Desarrollo)

```javascript
// Verificar estado de sincronización
syncService.getConnectionStatus();

// Forzar sincronización
syncService.forceSync();

// Obtener datos locales
syncService.getLocalData('members');

// Limpiar datos
syncService.clearData();
```

## ✅ Checklist de Verificación

### Antes de las Pruebas
- [ ] Backend desplegado en Railway
- [ ] URLs actualizadas en configuración
- [ ] Panel de prueba web funcionando
- [ ] APK compilada e instalada

### Pruebas de Conexión
- [ ] WebSocket conecta desde web
- [ ] Polling HTTP funciona en APK
- [ ] Reconexión automática funciona
- [ ] Health check responde correctamente

### Pruebas de Sincronización
- [ ] Añadir socio desde web → aparece en APK
- [ ] Añadir socio desde APK → aparece en web
- [ ] Actualizar socio → cambios se propagan
- [ ] Eliminar socio → se elimina en ambas plataformas

### Pruebas de Robustez
- [ ] Funciona sin conexión a internet
- [ ] Operaciones pendientes se envían al reconectar
- [ ] No hay pérdida de datos
- [ ] Logs detallados disponibles

## 🎉 Resultado Esperado

Una vez completadas todas las verificaciones, deberías tener:

- ✅ **Sincronización en tiempo real** entre web y APK
- ✅ **Datos consistentes** en ambas plataformas
- ✅ **Funcionamiento offline** con sincronización posterior
- ✅ **Logs detallados** para monitoreo
- ✅ **Manejo robusto de errores**

¡Tu aplicación del club de fútbol CD Sanabria CF estará completamente sincronizada en tiempo real! ⚽
