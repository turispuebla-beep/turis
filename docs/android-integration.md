# Guía de Integración Android

## Descripción General

Esta guía describe la integración entre la aplicación Android y la API REST del sistema web de gestión del club de fútbol. La aplicación Android consumirá los mismos endpoints que la aplicación web, con algunas consideraciones específicas para dispositivos móviles.

## Endpoints Específicos para Android

### Autenticación

```http
POST /api/v1/mobile/auth/login
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

### Sincronización

```http
GET /api/v1/mobile/sync
```
Headers:
```
Authorization: Bearer jwt-token
Last-Sync-Time: 2024-02-01T12:00:00Z
```

Response:
```json
{
  "updates": {
    "teams": [...],
    "players": [...],
    "members": [...],
    "events": [...],
    "media": [...]
  },
  "deletions": {
    "teams": ["id1", "id2"],
    "players": ["id3", "id4"],
    "members": ["id5", "id6"],
    "events": ["id7", "id8"],
    "media": ["id9", "id10"]
  },
  "syncTime": "2024-02-01T12:05:00Z"
}
```

### Optimización de Imágenes

```http
GET /api/v1/mobile/media/:id
```
Headers:
```
Authorization: Bearer jwt-token
Device-Width: 1080
Device-DPI: 440
```

## Estructura de Datos

### Room Database

```kotlin
@Entity(tableName = "teams")
data class Team(
    @PrimaryKey val id: String,
    val name: String,
    val category: String,
    val adminId: String?,
    val logo: String?,
    val lastSync: Long
)

@Entity(tableName = "players")
data class Player(
    @PrimaryKey val id: String,
    val name: String,
    val surname: String,
    val dni: String,
    val phone: String,
    val birthDate: String,
    val teamId: String,
    val photoUrl: String?,
    val lastSync: Long
)

@Entity(tableName = "members")
data class Member(
    @PrimaryKey val id: String,
    val name: String,
    val surname: String,
    val dni: String,
    val phone: String,
    val email: String?,
    val status: String,
    val memberNumber: Int,
    val teamId: String,
    val lastSync: Long
)

@Entity(tableName = "events")
data class Event(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val date: String,
    val price: Double,
    val location: String,
    val teamId: String,
    val imageUrl: String?,
    val lastSync: Long
)
```

### Retrofit API Client

```kotlin
interface ApiService {
    @POST("mobile/auth/login")
    suspend fun login(@Body loginRequest: LoginRequest): LoginResponse

    @GET("mobile/sync")
    suspend fun sync(
        @Header("Last-Sync-Time") lastSyncTime: String
    ): SyncResponse

    @Multipart
    @POST("mobile/media/photos")
    suspend fun uploadPhoto(
        @Part photo: MultipartBody.Part,
        @Part("description") description: RequestBody
    ): MediaResponse
}
```

## Sincronización de Datos

### Estrategia de Sincronización

1. **Sincronización Inicial**
   ```kotlin
   suspend fun performInitialSync() {
       val syncResponse = apiService.sync("1970-01-01T00:00:00Z")
       database.withTransaction {
           // Insertar datos iniciales
           teamDao.insertAll(syncResponse.updates.teams)
           playerDao.insertAll(syncResponse.updates.players)
           memberDao.insertAll(syncResponse.updates.members)
           eventDao.insertAll(syncResponse.updates.events)
           
           // Guardar tiempo de sincronización
           prefsManager.saveLastSyncTime(syncResponse.syncTime)
       }
   }
   ```

2. **Sincronización Incremental**
   ```kotlin
   suspend fun performIncrementalSync() {
       val lastSync = prefsManager.getLastSyncTime()
       val syncResponse = apiService.sync(lastSync)
       
       database.withTransaction {
           // Aplicar actualizaciones
           syncResponse.updates.apply {
               teams?.let { teamDao.upsertAll(it) }
               players?.let { playerDao.upsertAll(it) }
               members?.let { memberDao.upsertAll(it) }
               events?.let { eventDao.upsertAll(it) }
           }
           
           // Aplicar eliminaciones
           syncResponse.deletions.apply {
               teams?.let { teamDao.deleteByIds(it) }
               players?.let { playerDao.deleteByIds(it) }
               members?.let { memberDao.deleteByIds(it) }
               events?.let { eventDao.deleteByIds(it) }
           }
           
           // Actualizar tiempo de sincronización
           prefsManager.saveLastSyncTime(syncResponse.syncTime)
       }
   }
   ```

### Manejo de Conflictos

```kotlin
suspend fun resolveConflict(localData: Any, serverData: Any): Any {
    return when {
        localData.lastModified > serverData.lastModified -> localData
        else -> serverData
    }
}
```

## Caché de Imágenes

```kotlin
class ImageCache(context: Context) {
    private val cache = ImageLoader.Builder(context)
        .memoryCachePolicy(CachePolicy.ENABLED)
        .diskCachePolicy(CachePolicy.ENABLED)
        .build()

    suspend fun loadImage(url: String, width: Int, height: Int) {
        val request = ImageRequest.Builder(context)
            .data(url)
            .size(width, height)
            .scale(Scale.FILL)
            .crossfade(true)
            .build()
            
        cache.execute(request)
    }
}
```

## Notificaciones Push

### Configuración FCM

```kotlin
class FirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        // Enviar nuevo token al servidor
        scope.launch {
            apiService.updateDeviceToken(token)
        }
    }

    override fun onMessageReceived(message: RemoteMessage) {
        when (message.data["type"]) {
            "NEW_EVENT" -> showEventNotification(message)
            "MEMBER_STATUS" -> showMemberStatusNotification(message)
            "TEAM_UPDATE" -> showTeamUpdateNotification(message)
        }
    }
}
```

## Manejo de Errores

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

suspend fun <T> safeApiCall(call: suspend () -> T): Result<T> {
    return try {
        Result.Success(call())
    } catch (e: Exception) {
        when (e) {
            is IOException -> Result.Error(NetworkException())
            is HttpException -> {
                when (e.code()) {
                    401 -> Result.Error(UnauthorizedException())
                    403 -> Result.Error(ForbiddenException())
                    404 -> Result.Error(NotFoundException())
                    else -> Result.Error(ServerException())
                }
            }
            else -> Result.Error(UnknownException())
        }
    }
}
```

## Seguridad

### Almacenamiento Seguro

```kotlin
class SecureStorage(context: Context) {
    private val encryptedSharedPrefs = EncryptedSharedPreferences.create(
        context,
        "secure_prefs",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveAuthToken(token: String) {
        encryptedSharedPrefs.edit().putString("auth_token", token).apply()
    }

    fun getAuthToken(): String? {
        return encryptedSharedPrefs.getString("auth_token", null)
    }
}
```

### Interceptor de Autenticación

```kotlin
class AuthInterceptor(private val secureStorage: SecureStorage) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = secureStorage.getAuthToken()
        val request = chain.request().newBuilder()
            .addHeader("Authorization", "Bearer $token")
            .build()
        return chain.proceed(request)
    }
}
```

## Optimización de Rendimiento

### Paginación

```kotlin
@Dao
interface PlayerDao {
    @Query("SELECT * FROM players WHERE teamId = :teamId")
    fun getPlayersPaged(teamId: String): PagingSource<Int, Player>
}

class PlayerRepository(private val playerDao: PlayerDao) {
    fun getPlayersPaged(teamId: String) = Pager(
        config = PagingConfig(
            pageSize = 20,
            enablePlaceholders = false
        ),
        pagingSourceFactory = { playerDao.getPlayersPaged(teamId) }
    ).flow
}
```

### Trabajo en Segundo Plano

```kotlin
class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        return try {
            repository.performIncrementalSync()
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
}

// Programar sincronización periódica
WorkManager.getInstance(context)
    .enqueueUniquePeriodicWork(
        "sync_data",
        ExistingPeriodicWorkPolicy.KEEP,
        PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build()
            )
            .build()
    )
```

## Pruebas

### Unit Tests

```kotlin
@Test
fun `test sync with server updates`() = runTest {
    // Given
    val serverUpdates = SyncResponse(
        updates = Updates(
            teams = listOf(Team("1", "Team A", "prebenjamin", null, null, 0))
        ),
        deletions = Deletions(),
        syncTime = "2024-02-01T12:00:00Z"
    )
    coEvery { apiService.sync(any()) } returns serverUpdates

    // When
    repository.performIncrementalSync()

    // Then
    coVerify { teamDao.upsertAll(serverUpdates.updates.teams!!) }
    verify { prefsManager.saveLastSyncTime(serverUpdates.syncTime) }
}
```

### Integration Tests

```kotlin
@Test
fun `test full sync flow`() = runTest {
    // Given
    val testNavController = TestNavHostController(context)
    
    // When
    launchFragmentInContainer<SyncFragment> {
        testNavController.setGraph(R.navigation.nav_graph)
        testNavController.setCurrentDestination(R.id.syncFragment)
    }

    // Then
    onView(withId(R.id.progressBar)).check(matches(isDisplayed()))
    // ... verificar navegación después de sincronización
}
```

## Consideraciones de Implementación

1. **Modo Offline**
   - Implementar Repository Pattern
   - Usar Single Source of Truth
   - Manejar conflictos de sincronización

2. **Batería y Datos**
   - Comprimir datos en transferencias
   - Optimizar frecuencia de sincronización
   - Respetar preferencias de ahorro de datos

3. **UX/UI**
   - Seguir Material Design 3
   - Implementar temas dinámicos
   - Soportar modo oscuro
   - Adaptarse a diferentes tamaños de pantalla

4. **Seguridad**
   - Validar certificados SSL
   - Encriptar datos sensibles
   - Implementar timeout de sesión
   - Validar inputs

5. **Monitoreo**
   - Implementar Firebase Analytics
   - Usar Crashlytics
   - Monitorear ANR y crashes