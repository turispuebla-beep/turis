# Documentación de la API

## Autenticación

Todas las rutas protegidas requieren el header `Authorization: Bearer {token}`.

### POST /api/auth/login
Login de administrador.

```json
{
  "email": "admin@ejemplo.com",
  "password": "contraseña"
}
```

### POST /api/auth/register
Registro de administrador de equipo (solo admin principal).

```json
{
  "email": "teamadmin@ejemplo.com",
  "password": "contraseña",
  "name": "Nombre Admin",
  "teamId": "id_del_equipo"
}
```

## Equipos

### GET /api/teams
Listar todos los equipos.

Parámetros de consulta:
- `category`: Filtrar por categoría
- `page`: Número de página
- `limit`: Resultados por página

### POST /api/teams
Crear nuevo equipo (solo admin principal).

```json
{
  "name": "Nombre Equipo",
  "category": "prebenjamin",
  "admin": {
    "name": "Nombre Admin",
    "email": "admin@equipo.com",
    "phone": "123456789"
  },
  "contactInfo": {
    "email": "contacto@equipo.com",
    "phone": "987654321"
  }
}
```

### PUT /api/teams/:id
Actualizar equipo.

```json
{
  "name": "Nuevo Nombre",
  "contactInfo": {
    "email": "nuevo@equipo.com"
  }
}
```

## Jugadores/as

### GET /api/teams/:teamId/players
Listar jugadores/as de un equipo.

Parámetros de consulta:
- `category`: Filtrar por categoría
- `age`: Filtrar por edad
- `page`: Número de página
- `limit`: Resultados por página

### POST /api/teams/:teamId/players
Añadir jugador/a al equipo.

```json
{
  "name": "Nombre",
  "surname": "Apellidos",
  "dni": "12345678A",
  "phone": "123456789",
  "birthDate": "2010-01-01",
  "gender": "masculino",
  "guardianInfo": [{
    "name": "Nombre Tutor",
    "dni": "87654321B",
    "phone": "987654321",
    "email": "tutor@ejemplo.com",
    "relation": "padre"
  }],
  "photoConsent": true,
  "teamConsent": true
}
```

## Socios/as

### GET /api/teams/:teamId/members
Listar socios/as.

Parámetros de consulta:
- `status`: Filtrar por estado (pending, active)
- `page`: Número de página
- `limit`: Resultados por página

### POST /api/teams/:teamId/members
Registrar nuevo/a socio/a.

```json
{
  "name": "Nombre",
  "surname": "Apellidos",
  "dni": "12345678A",
  "phone": "123456789",
  "email": "socio@ejemplo.com",
  "gender": "femenino"
}
```

### PUT /api/teams/:teamId/members/:id/status
Actualizar estado de socio/a.

```json
{
  "status": "active"
}
```

## Eventos

### GET /api/teams/:teamId/events
Listar eventos.

Parámetros de consulta:
- `upcoming`: true/false para eventos futuros
- `page`: Número de página
- `limit`: Resultados por página

### POST /api/teams/:teamId/events
Crear nuevo evento.

```json
{
  "title": "Título Evento",
  "description": "Descripción",
  "date": "2024-02-01T18:00:00Z",
  "price": 10.00,
  "minParticipants": 5,
  "maxParticipants": 20,
  "photoConsent": true,
  "location": "Ubicación"
}
```

### POST /api/teams/:teamId/events/:id/register
Inscribir socio/a en evento.

```json
{
  "memberId": "id_del_socio"
}
```

## Medios

### GET /api/teams/:teamId/media
Listar fotos y videos.

Parámetros de consulta:
- `type`: "photo" o "video"
- `page`: Número de página
- `limit`: Resultados por página

### POST /api/teams/:teamId/media/photos
Subir foto.

```
FormData:
- photo: Archivo de imagen
- description: "Descripción de la foto"
```

### POST /api/teams/:teamId/media/videos
Subir video.

```
FormData:
- video: Archivo de video
- description: "Descripción del video"
```

## Exportación

### GET /api/teams/:teamId/export/players
Exportar lista de jugadores/as a Excel.

Parámetros de consulta:
- `category`: Filtrar por categoría

### GET /api/teams/:teamId/export/members
Exportar lista de socios/as a Excel.

Parámetros de consulta:
- `status`: Filtrar por estado

## Códigos de Error

- `400`: Error de validación o datos incorrectos
- `401`: No autenticado
- `403`: No autorizado
- `404`: Recurso no encontrado
- `409`: Conflicto (ej: DNI duplicado)
- `413`: Archivo demasiado grande
- `415`: Tipo de archivo no soportado
- `429`: Demasiadas peticiones
- `500`: Error interno del servidor

## Límites y Restricciones

- Tamaño máximo de foto: 10MB
- Tamaño máximo de video: 100MB
- Formatos de foto permitidos: jpg, jpeg, png, webp
- Formatos de video permitidos: mp4, webm
- Rate limit: 100 peticiones por 15 minutos
- Tiempo de expiración del token JWT: 24 horas
- Tiempo de aprobación de socios/as: 7 días