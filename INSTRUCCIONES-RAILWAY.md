# 🔗 Cómo encontrar la URL de tu Backend en Railway

## 📋 Pasos para obtener la URL del backend

### 1. **Acceder a Railway**
- Ve a [railway.com/workspace](https://railway.com/workspace)
- Inicia sesión con tu cuenta

### 2. **Buscar tu proyecto**
- En el dashboard verás tus proyectos
- Busca el proyecto llamado:
  - `futbol-web-backend`
  - `CDSANABRIACF`
  - O similar

### 3. **Hacer clic en el proyecto**
- Haz clic en el nombre del proyecto
- Se abrirá la página del proyecto

### 4. **Encontrar la URL**
- En la parte superior verás una URL como:
  - `https://tu-proyecto-railway.railway.app`
  - `https://cdsanabriacf-backend.railway.app`
  - `https://futbol-web-backend-production.railway.app`

### 5. **Copiar la URL**
- Copia la URL completa
- Debería ser algo como: `https://tu-proyecto.railway.app`

## 🔧 Actualizar la configuración

Una vez que tengas la URL:

1. **Abrir `database.js`**
2. **Buscar la línea:**
   ```javascript
   const BACKEND_URL = 'https://tu-proyecto.railway.app';
   ```
3. **Reemplazar con tu URL real:**
   ```javascript
   const BACKEND_URL = 'https://tu-url-real.railway.app';
   ```

## 🧪 Probar la sincronización

1. **Abrir el panel de administración**
2. **Ir a la sección "Sincronización de Datos"**
3. **Hacer clic en "Sincronizar Socios con Backend"**
4. **Verificar que funciona correctamente**

## 📱 Resultado esperado

- ✅ Los socios creados en la web aparecerán en la app
- ✅ Los socios creados en la app aparecerán en la web
- ✅ Sincronización en tiempo real entre ambas plataformas

¡Una vez configurado, tendrás sincronización completa entre web y app! 🚀
