# Backend CD Sanabria CF

Backend completo para la aplicación web del Club Deportivo Sanabria CF con base de datos MongoDB centralizada.

## 🚀 Características

- **Base de datos MongoDB** centralizada para sincronización entre usuarios
- **Autenticación JWT** con roles de administrador
- **API RESTful** completa para todas las entidades
- **Subida de archivos** para fotos, videos y documentos
- **Validación de datos** con express-validator
- **TypeScript** para mejor desarrollo y mantenimiento

## 📋 Entidades del Sistema

### 👤 Usuarios (Users)
- **Super Admin**: Acceso completo a toda la aplicación
- **Team Admin**: Administrador de equipo específico
- Autenticación con email y contraseña

### ⚽ Equipos (Teams)
- Prebenjamín, Benjamín, Alevín, Infantil, Aficionado
- Configuración de colores y logos

### 👥 Socios (Members)
- Numeración automática secuencial (SOC-0001, SOC-0002...)
- Estados: pendiente, confirmado, rechazado
- Confirmación automática en 7 días

### 🏃 Jugadores (Players)
- Información completa con DNI, teléfono, dirección
- Cálculo automático de edad
- Información de tutores para menores de edad
- Dorsales únicos por equipo

### 👋 Amigos (Friends)
- Acceso limitado a calendario, equipos y resultados
- No requieren confirmación

### 📅 Eventos (Events)
- Gestión de inscripciones con límites
- Precios y control de participantes
- Fotos y permisos de imagen

### 📸 Media (Fotos y Videos)
- Subida y gestión de contenido multimedia
- Asociación a equipos y eventos

### 📄 Documentos (Documents)
- Gestión de documentos PDF
- Solo administradores pueden subir/eliminar

## 🛠️ Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env
```
Editar `.env` con tus configuraciones:
```env
MONGODB_URI=mongodb://localhost:27017/cdsanabriacf
JWT_SECRET=tu_secret_super_seguro
PORT=3000
```

4. **Compilar TypeScript**
```bash
npm run build
```

5. **Inicializar la base de datos**
```bash
npm run init-db
```

6. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔐 Credenciales por Defecto

Después de ejecutar `npm run init-db`:

### Super Administrador
- **Email**: amco@gmx.es
- **Contraseña**: 533712
- **Acceso**: Completo a toda la aplicación

### Administrador de Equipo
- **Email**: cdsanabriacf@gmail.com
- **Contraseña**: admin123
- **Acceso**: Solo a su equipo asignado

## 📊 Estructura de la Base de Datos

### Colecciones MongoDB
- `users` - Administradores del sistema
- `teams` - Equipos del club
- `members` - Socios del club
- `friends` - Amigos del club
- `players` - Jugadores de los equipos
- `events` - Eventos del club
- `media` - Fotos y videos
- `documents` - Documentos PDF

### Índices Optimizados
- Búsqueda por email en usuarios
- Numeración secuencial de socios
- DNI único en socios y jugadores
- Dorsales únicos por equipo
- Fechas de eventos para calendario

## 🔄 Migración desde IndexedDB

Para migrar desde la base de datos local (IndexedDB) a MongoDB:

1. **Exportar datos locales** desde el frontend
2. **Importar datos** usando la API del backend
3. **Actualizar frontend** para usar la API en lugar de IndexedDB

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Socios
- `GET /api/members` - Listar socios
- `POST /api/members` - Crear socio
- `PUT /api/members/:id` - Actualizar socio
- `DELETE /api/members/:id` - Eliminar socio

### Jugadores
- `GET /api/players` - Listar jugadores
- `POST /api/players` - Crear jugador
- `PUT /api/players/:id` - Actualizar jugador
- `DELETE /api/players/:id` - Eliminar jugador

### Equipos
- `GET /api/teams` - Listar equipos
- `POST /api/teams` - Crear equipo
- `PUT /api/teams/:id` - Actualizar equipo
- `DELETE /api/teams/:id` - Eliminar equipo

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Crear evento
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento

### Media
- `GET /api/media` - Listar media
- `POST /api/media` - Subir archivo
- `DELETE /api/media/:id` - Eliminar archivo

### Documentos
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Subir documento
- `DELETE /api/documents/:id` - Eliminar documento

## 🚀 Despliegue

### Opciones de Despliegue
1. **Heroku** - Fácil integración con MongoDB Atlas
2. **Railway** - Despliegue rápido con base de datos incluida
3. **DigitalOcean** - VPS con MongoDB
4. **AWS** - EC2 con MongoDB

### Variables de Entorno de Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/cdsanabriacf
JWT_SECRET=secret_super_seguro_produccion
CORS_ORIGIN=https://tu-dominio.com
```

## 📝 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm start` - Servidor de producción
- `npm run init-db` - Inicializar base de datos
- `npm test` - Ejecutar tests
- `npm run lint` - Verificar código

## 🔧 Configuración Avanzada

### Personalización de Equipos
Editar `src/scripts/initDatabase.ts` para cambiar:
- Nombres de equipos
- Colores por defecto
- Descripciones

### Configuración de Archivos
- Tamaño máximo: 10MB por defecto
- Tipos permitidos: jpg, png, pdf, mp4
- Ruta de almacenamiento: `./uploads`

## 🆘 Solución de Problemas

### Error de Conexión MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
mongod --version
# En Windows: net start MongoDB
# En macOS: brew services start mongodb-community
```

### Error de Permisos
```bash
# En Linux/macOS
chmod +x scripts/initDatabase.ts
```

### Puerto en Uso
```bash
# Cambiar puerto en .env
PORT=3001
```

## 📞 Soporte

Para problemas o preguntas:
1. Revisar los logs del servidor
2. Verificar la conexión a MongoDB
3. Comprobar las variables de entorno
4. Ejecutar `npm run init-db` para resetear la base de datos



