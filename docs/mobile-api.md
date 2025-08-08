# API Móvil - Documentación

## Descripción General

API REST diseñada específicamente para la aplicación móvil Android del sistema de gestión del club de fútbol. Esta API proporciona endpoints optimizados para dispositivos móviles, incluyendo sincronización offline y optimización de recursos.

## Base URL

```
https://api.futbol-web.example.com/api/v1/mobile
```

## Autenticación

### Login Móvil

```http
POST /auth/login
```

Request:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "contraseña",
    "deviceToken": "fcm-token-para-notificaciones"
}
```

Response:
```json
{
    "success": true,
    "token": "jwt-token",
    "user": {
        "id": "user-id",
        "email": "usuario@ejemplo.com",
        "role": "teamAdmin",
        "teamId": "team-id"
    },
    "expiresIn": 86400
}
```

### Actualizar Token de Dispositivo

```http
PUT /auth/device-token
```

Request:
```json
{
    "deviceToken": "nuevo-fcm-token"
}
```

## Sincronización de Datos

### Sincronización Incremental

```http
GET /sync
```

Headers:
```
Authorization: Bearer jwt-token
Last-Sync-Time: 2024-02-01T12:00:00Z
```

Response:
```json
{
    "success": true,
    "data": {
        "updates": {
            "teams": [...],
            "players": [...],
            "members": [...],
            "events": [...],
            "media": [...]
        },
        "deletions": {
            "teams": ["id1", "id2"],
            "players": ["id3"],
            "members": ["id4"],
            "events": ["id5"],
            "media": ["id6"]
        },
        "syncTime": "2024-02-01T12:05:00Z"
    }
}
```

### Sincronización por Lotes

```http
POST /sync/batch
```

Request:
```json
{
    "updates": {
        "players": [{
            "id": "player-id",
            "data": {
                "phone": "nuevo-telefono",
                "lastSyncTime": "2024-02-01T12:00:00Z"
            }
        }],
        "members": [{
            "id": "member-id",
            "data": {
                "email": "nuevo-email",
                "lastSyncTime": "2024-02-01T12:00:00Z"
            }
        }]
    }
}
```

### Resolución de Conflictos

```http
POST /sync/resolve
```

Request:
```json
{
    "entity": "player",
    "id": "player-id",
    "data": {
        "phone": "nuevo-telefono",
        "lastSyncTime": "2024-02-01T12:00:00Z"
    }
}
```

### Sincronización Offline

```http
POST /sync/offline
```

Request:
```json
{
    "entity": "match",
    "tempId": "id-temporal-local",
    "data": {
        "date": "2024-02-01T15:00:00Z",
        "location": "Campo Local",
        "category": "prebenjamin",
        "homeTeam": "Equipo Local",
        "awayTeam": "Equipo Visitante",
        "homeScore": 2,
        "awayScore": 1,
        "players": [...]
    }
}
```

### Sincronizar Eliminaciones

```http
POST /sync/deletions
```

Request:
```json
{
    "deletions": [{
        "entity": "match",
        "id": "match-id",
        "timestamp": "2024-02-01T12:00:00Z"
    }]
}
```

## Optimización de Medios

### Obtener Imagen Optimizada

```http
GET /media/:id
```

Headers:
```
Authorization: Bearer jwt-token
Device-Width: 1080
Device-DPI: 440
```

## Modelos de Datos

### Usuario
```typescript
interface User {
    id: string;
    email: string;
    role: 'admin' | 'teamAdmin';
    teamId?: string;
    deviceToken?: string;
}
```

### Equipo
```typescript
interface Team {
    id: string;
    name: string;
    category: string;
    admin: {
        name: string;
        email: string;
        phone: string;
    };
    logo?: string;
    contactInfo: {
        email: string;
        phone: string;
    };
}
```

### Jugador/a
```typescript
interface Player {
    id: string;
    name: string;
    surname: string;
    dni: string;
    phone: string;
    birthDate: string;
    gender: string;
    teamId: string;
    guardianInfo?: {
        name: string;
        dni: string;
        phone: string;
        email: string;
        relation: string;
    }[];
    photoConsent: boolean;
    teamConsent: boolean;
}
```

### Socio/a
```typescript
interface Member {
    id: string;
    name: string;
    surname: string;
    dni: string;
    phone: string;
    email: string;
    gender: string;
    memberNumber: number;
    status: 'pending' | 'active';
    teamId: string;
    registrationDate: string;
}
```

### Evento
```typescript
interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    price: number;
    location: string;
    minParticipants: number;
    maxParticipants: number;
    photoConsent: boolean;
    teamId: string;
    participants: string[];
    image?: string;
}
```

### Partido
```typescript
interface Match {
    id: string;
    date: string;
    location: string;
    category: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    players: {
        playerId: string;
        goals: number;
        assists: number;
        yellowCards: number;
        redCard: boolean;
        minutesPlayed: number;
    }[];
    summary?: string;
    photos?: string[];
    videos?: string[];
    teamId: string;
}
```

## Estrategias de Sincronización

### Sincronización Inicial
1. Realizar login y obtener token JWT
2. Establecer Last-Sync-Time a "1970-01-01T00:00:00Z"
3. Realizar sincronización completa
4. Almacenar datos en base de datos local (Room)
5. Guardar nuevo Last-Sync-Time

### Sincronización Incremental
1. Enviar Last-Sync-Time del último sync exitoso
2. Recibir solo cambios desde ese momento
3. Aplicar actualizaciones localmente
4. Procesar eliminaciones
5. Actualizar Last-Sync-Time

### Manejo Offline
1. Almacenar cambios locales con ID temporal
2. Registrar timestamp de modificación
3. Al recuperar conexión:
   - Sincronizar cambios pendientes
   - Resolver conflictos por timestamp
   - Actualizar IDs temporales con IDs del servidor

## Códigos de Error

| Código | Descripción                    | Acción Recomendada                    |
|--------|--------------------------------|---------------------------------------|
| 400    | Datos inválidos                | Verificar formato de datos            |
| 401    | No autenticado                 | Renovar sesión                        |
| 403    | No autorizado                  | Verificar permisos                    |
| 404    | Recurso no encontrado          | Actualizar datos locales             |
| 409    | Conflicto de sincronización    | Resolver conflicto manualmente       |
| 413    | Archivo demasiado grande       | Reducir tamaño del archivo           |
| 429    | Demasiadas peticiones          | Implementar exponential backoff       |

## Buenas Prácticas

### Optimización de Red
- Comprimir datos en transferencias
- Usar sincronización incremental
- Implementar caché de imágenes
- Respetar límites de tamaño

### Manejo Offline
- Almacenar datos críticos localmente
- Implementar cola de cambios
- Manejar conflictos automáticamente
- Mostrar indicadores de sincronización

### Seguridad
- Almacenar token JWT seguramente
- Validar certificados SSL
- Encriptar datos sensibles
- Implementar timeout de sesión

### Batería y Datos
- Sincronizar solo cuando sea necesario
- Respetar preferencias de ahorro de datos
- Optimizar frecuencia de sincronización
- Comprimir archivos multimedia

## Ejemplos de Implementación

### Kotlin - Retrofit Client
```kotlin
interface ApiService {
    @POST("auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): LoginResponse

    @GET("sync")
    suspend fun sync(
        @Header("Last-Sync-Time") lastSyncTime: String
    ): SyncResponse

    @Multipart
    @POST("media/photos")
    suspend fun uploadPhoto(
        @Part photo: MultipartBody.Part,
        @Part("description") description: RequestBody
    ): MediaResponse
}
```

### Room Database
```kotlin
@Entity(tableName = "players")
data class PlayerEntity(
    @PrimaryKey val id: String,
    val name: String,
    val surname: String,
    val teamId: String,
    val lastSync: Long
)

@Dao
interface PlayerDao {
    @Query("SELECT * FROM players WHERE teamId = :teamId")
    fun getPlayersByTeam(teamId: String): Flow<List<PlayerEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(players: List<PlayerEntity>)

    @Query("DELETE FROM players WHERE id IN (:ids)")
    suspend fun deleteByIds(ids: List<String>)
}
```

### Sincronización Repository
```kotlin
class SyncRepository(
    private val api: ApiService,
    private val db: AppDatabase,
    private val prefs: SharedPreferences
) {
    suspend fun sync() {
        val lastSync = prefs.getString("last_sync_time", null)
        val response = api.sync(lastSync ?: "1970-01-01T00:00:00Z")

        db.withTransaction {
            // Aplicar actualizaciones
            response.updates.players?.let { players ->
                db.playerDao().insertAll(players.map { it.toEntity() })
            }

            // Aplicar eliminaciones
            response.deletions.players?.let { ids ->
                db.playerDao().deleteByIds(ids)
            }

            // Guardar tiempo de sincronización
            prefs.edit().putString("last_sync_time", response.syncTime).apply()
        }
    }
}
```

## Pruebas

### Postman Collection
Disponible en `/docs/postman/mobile-api.json`

### Curl Examples
```bash
# Login
curl -X POST https://api.example.com/api/v1/mobile/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass","deviceToken":"fcm-token"}'

# Sync
curl -X GET https://api.example.com/api/v1/mobile/sync \
  -H "Authorization: Bearer token" \
  -H "Last-Sync-Time: 2024-02-01T12:00:00Z"
```