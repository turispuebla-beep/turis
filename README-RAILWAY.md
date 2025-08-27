# 🚀 Despliegue en Railway - CD Sanabria CF Backend

## 📋 Información del Proyecto

- **Nombre**: CD Sanabria CF Backend
- **Tipo**: Node.js + Express + Socket.IO
- **Puerto**: 3000
- **Entrada principal**: `server.js`

## 🔧 Configuración para Railway

### Variables de Entorno Requeridas

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

### Endpoints Disponibles

- `GET /` - Información de la API
- `GET /api/health` - Health check
- `GET /api/members` - Listar socios
- `POST /api/members` - Crear socio
- `PUT /api/members/:id` - Actualizar socio
- `DELETE /api/members/:id` - Eliminar socio
- `GET /api/equipos` - Listar equipos
- `POST /api/equipos` - Crear equipo
- `GET /api/jugadores` - Listar jugadores
- `POST /api/jugadores` - Crear jugador
- `GET /api/eventos` - Listar eventos
- `POST /api/eventos` - Crear evento
- `GET /api/amigos` - Listar amigos
- `POST /api/amigos` - Crear amigo
- `POST /api/auth/login` - Login administrador
- `POST /api/sync` - Sincronización manual
- `POST /api/init-db` - Inicializar base de datos

### WebSocket Events

- `data-sync` - Sincronización de datos
- `member-added` - Socio añadido
- `member-changed` - Socio actualizado
- `member-deleted` - Socio eliminado
- `team-added` - Equipo añadido
- `player-added` - Jugador añadido
- `event-added` - Evento añadido
- `friend-added` - Amigo añadido

## 🚀 Pasos de Despliegue

1. **Crear proyecto en Railway**
2. **Conectar repositorio GitHub**
3. **Seleccionar directorio `backend/`**
4. **Configurar variables de entorno**
5. **Desplegar**

## ✅ Verificación

Una vez desplegado, verificar:

1. **Health Check**: `https://tu-proyecto.railway.app/api/health`
2. **API Root**: `https://tu-proyecto.railway.app/`
3. **Socios**: `https://tu-proyecto.railway.app/api/members`

## 🔗 URLs de Prueba

- **Frontend**: `https://www.sanabriacf.com`
- **Backend**: `https://tu-proyecto.railway.app`
- **Panel de Prueba**: `sync-test-panel.html`

## 📞 Soporte

- **Email**: cdsanabriafc@gmail.com
- **Club**: CD Sanabria CF
- **Ubicación**: Puebla de Sanabria, Zamora
