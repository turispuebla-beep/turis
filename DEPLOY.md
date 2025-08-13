# 🚀 Guía de Despliegue - CD Sanabria CF

## 📋 Pasos para desplegar en Railway

### 1. **Crear cuenta en Railway**
- Ve a [railway.app](https://railway.app)
- Regístrate con tu cuenta de GitHub
- Crea un nuevo proyecto

### 2. **Conectar GitHub**
- En Railway, haz clic en "Deploy from GitHub repo"
- Selecciona tu repositorio `CDSANABRIACF`
- Railway detectará automáticamente que es un proyecto Node.js

### 3. **Configurar variables de entorno**
En Railway, ve a la pestaña "Variables" y añade:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secret_super_seguro_2024
```

### 4. **Desplegar**
- Railway automáticamente detectará el `package.json`
- Ejecutará `npm install` y `npm start`
- Tu API estará disponible en una URL como: `https://tu-proyecto.railway.app`

### 5. **Probar la API**
Una vez desplegado, prueba estos endpoints:

- **API Principal**: `https://tu-proyecto.railway.app`
- **Health Check**: `https://tu-proyecto.railway.app/api/health`
- **Socios**: `https://tu-proyecto.railway.app/api/members`

## 🔧 Configuración MongoDB Atlas (Opcional)

Si quieres usar MongoDB real en lugar de datos simulados:

### 1. **Crear cuenta en MongoDB Atlas**
- Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
- Crea una cuenta gratuita
- Crea un cluster gratuito (M0)

### 2. **Obtener URL de conexión**
- En Atlas, ve a "Connect"
- Selecciona "Connect your application"
- Copia la URL de conexión

### 3. **Añadir a Railway**
En Railway, añade esta variable:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cdsanabriacf
```

## 📱 Actualizar Frontend

Una vez que tengas la URL de Railway, actualiza tu frontend para usar la nueva API:

```javascript
// Cambiar de:
const API_URL = 'http://localhost:3000';

// A:
const API_URL = 'https://tu-proyecto.railway.app';
```

## 🎉 ¡Listo!

Tu aplicación estará disponible 24/7 sin necesidad de tener tu PC encendido.
