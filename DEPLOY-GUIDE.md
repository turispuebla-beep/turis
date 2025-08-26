# 🚀 GUÍA DE DESPLIEGUE CDSANABRIACF

## 📋 Configuración Automática para Netlify y Railway

### 🌐 NETLIFY (Página Web)

**URL del repositorio**: `https://github.com/turispuebla-beep/turis`

**Configuración de Build**:
- **Build command**: `echo 'No build needed'`
- **Publish directory**: `CDSANABRIACF-FINAL`
- **Branch**: `master`

**Variables de entorno** (opcional):
```
CONTACT_EMAIL=cdsanabriafc@gmail.com
CLUB_NAME=CDSANABRIACF
CLUB_LOCATION=Puebla de Sanabria, Zamora
```

### 🔧 RAILWAY (Backend)

**URL del repositorio**: `https://github.com/turispuebla-beep/turis`

**Configuración**:
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Variables de entorno necesarias**:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cdsanabriacf
JWT_SECRET=cdsanabriacf_secret_key_2024
PORT=3000
CORS_ORIGIN=https://tu-sitio.netlify.app
```

## 🎯 Pasos Rápidos

### 1. Netlify
1. Ve a https://app.netlify.com
2. "New site from Git" → GitHub → `turispuebla-beep/turis`
3. Configura build settings como arriba
4. Deploy

### 2. Railway
1. Ve a https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Selecciona `turispuebla-beep/turis`
4. Configura root directory como `backend`
5. Añade variables de entorno
6. Deploy

## 🔗 URLs Finales

- **Frontend**: https://tu-sitio.netlify.app
- **Backend**: https://tu-backend.railway.app

## ✅ Verificación

Una vez desplegado, verifica:
1. La página web carga correctamente
2. El backend responde en `/api/health`
3. Los administradores pueden hacer login
4. La sincronización funciona

## 🆘 Soporte

Si hay problemas:
1. Revisar logs en Netlify/Railway
2. Verificar variables de entorno
3. Comprobar conexión a MongoDB
