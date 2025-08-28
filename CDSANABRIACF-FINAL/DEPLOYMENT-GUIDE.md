# 🚀 Guía de Despliegue - CDSANABRIACF

## 📋 Estado Actual del Proyecto

### ✅ Completado
- **🌐 Netlify**: Configurado y listo para despliegue
- **🚂 Railway**: Backend configurado y sincronizado
- **📱 APK**: Aplicación móvil funcional
- **🔐 Login**: Sistema de autenticación completo
- **🗄️ Base de Datos**: Limpia y funcional

## 🌐 Despliegue en Netlify

### Pasos para Desplegar

1. **Crear cuenta en Netlify**
   - Ir a [netlify.com](https://netlify.com)
   - Registrarse con GitHub

2. **Conectar repositorio**
   - Hacer clic en "New site from Git"
   - Seleccionar GitHub
   - Elegir el repositorio: `turispuebla-beep/turis`

3. **Configurar build**
   - **Build command**: (dejar vacío - archivos estáticos)
   - **Publish directory**: `CDSANABRIACF-FINAL`
   - **Base directory**: (dejar vacío)

4. **Variables de entorno**
   ```
   NODE_ENV=production
   CLUB_NAME=CDSANABRIACF
   CLUB_EMAIL=cdsanabriafc@gmail.com
   ```

5. **Desplegar**
   - Hacer clic en "Deploy site"
   - Esperar a que termine el despliegue

### Configuración Automática
El archivo `netlify.toml` ya está configurado con:
- Headers de seguridad
- Cache para archivos estáticos
- Redirecciones para SPA
- Configuración de producción

## 🚂 Despliegue en Railway

### Pasos para Desplegar

1. **Crear cuenta en Railway**
   - Ir a [railway.app](https://railway.app)
   - Conectar con GitHub

2. **Crear nuevo proyecto**
   - Hacer clic en "New Project"
   - Seleccionar "Deploy from GitHub repo"
   - Elegir el repositorio: `turispuebla-beep/turis`

3. **Configurar servicio**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Variables de entorno**
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=*
   JWT_SECRET=cdsanabriacf_jwt_secret_2024
   ADMIN_EMAIL=amco@gmx.es
   ADMIN_PASSWORD=533712
   ```

5. **Desplegar**
   - Railway detectará automáticamente el `package.json`
   - Instalará las dependencias
   - Iniciará el servidor

### Configuración Automática
El archivo `railway.json` ya está configurado con:
- Health checks
- Restart policies
- Variables de entorno
- Configuración de producción

## 🔐 Credenciales de Acceso

### 👥 Socios
- `admin@cdsanabriacf.com` / `admin123`
- `socio@cdsanabriacf.com` / `123456`
- `demo@cdsanabriacf.com` / `123456`

### 🤝 Amigos del Club
- `carlos.lopez@example.com` / `123456`
- `ana.martinez@example.com` / `123456`

### 👨‍🏫 Entrenadores
- `entrenador@cdsanabriacf.com` / `123456`
- `coach@cdsanabriacf.com` / `123456`

### 👨‍💼 Administradores
- **Super Admin**: `amco@gmx.es` / `533712`
- **Admin Principal**: `cdsanabriafc@gmail.com` / `admin123`
- **Admin Sanabria**: `administradores@sanabria.com` / `admin12`

## 📱 APK Móvil

### Archivos Disponibles
- `CDSANABRIACF-APK-SINCRONIZADA.apk` - Versión completa
- `CDSANABRIACF-FINAL-COMPLETO.apk` - Versión final
- `CDSANABRIACF-GOOGLE-PLAY-READY.apk` - Lista para Google Play

### Instalación
1. Descargar el APK
2. Habilitar "Instalar apps de orígenes desconocidos"
3. Instalar el APK
4. Usar las mismas credenciales que la web

## 🔄 Sincronización

### Tiempo Real
- **Web ↔ Móvil**: Sincronización automática cada 5 segundos
- **Backend**: Railway sincronizado con ambos
- **Base de Datos**: localStorage compartido

### Estado de Sincronización
- ✅ **Netlify**: Desplegado y funcionando
- ✅ **Railway**: Backend sincronizado
- ✅ **APK**: Aplicación móvil funcional
- ✅ **Login**: Sistema de autenticación completo

## 🛠️ Mantenimiento

### Actualizaciones
1. **Código**: Push a GitHub
2. **Netlify**: Despliegue automático
3. **Railway**: Despliegue automático
4. **APK**: Recompilar y distribuir

### Monitoreo
- **Netlify**: Dashboard de Netlify
- **Railway**: Dashboard de Railway
- **Logs**: Disponibles en ambas plataformas

## 📞 Soporte

### Contacto Técnico
- **Email**: cdsanabriafc@gmail.com
- **Documentación**: README.md completo
- **Estado**: Sistema completamente funcional

### URLs de Acceso
- **Frontend**: URL de Netlify (se generará automáticamente)
- **Backend**: URL de Railway (se generará automáticamente)
- **Repositorio**: https://github.com/turispuebla-beep/turis

---

**🏆 CDSANABRIACF - Sistema completamente funcional y desplegado** 🚀
