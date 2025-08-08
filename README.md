# ⚽ TURISTEAM

**Gestión Integral de Equipos de Fútbol**

## 📱 Aplicación Móvil Android

TURISTEAM es una aplicación móvil desarrollada en Kotlin para la gestión eficiente de equipos de fútbol. La aplicación incluye funcionalidades para administrar equipos, partidos, comunicación y más. Cada equipo tiene su propio administrador que gestiona únicamente su equipo específico.

### 🚀 Características Principales

- **Gestión de Equipos**: Administra jugadores, entrenadores y personal técnico
- **Partidos y Calendario**: Programa y gestiona partidos de fútbol
- **Comunicación**: Chat en tiempo real entre jugadores y entrenadores
- **Estadísticas**: Seguimiento de rendimiento y estadísticas de jugadores
- **Tienda del Equipo**: Gestión de equipamiento y merchandising
- **Competiciones**: Organización de ligas, torneos y competiciones

### 📥 Descarga

- **APK**: `app-debug.apk` (25MB)
- **Versión**: 1.0
- **Android mínimo**: API 28 (Android 9.0)

### 🛠️ Tecnologías Utilizadas

- **Lenguaje**: Kotlin
- **UI**: Material Design Components
- **Arquitectura**: MVVM con ViewBinding
- **Base de datos**: Room Database
- **Backend**: Firebase (Firestore, Authentication)
- **Notificaciones**: Firebase Cloud Messaging
- **Roles**: Administradores por equipo, Super Administrador

## 🌐 Página Web

La página web (`index.html`) proporciona información sobre la aplicación y permite descargar la APK directamente. Cada equipo puede personalizar su página web a través del panel de administración.

### 🎨 Características de la Web

- **Diseño Responsivo**: Adaptable a móviles y tablets
- **Interfaz Moderna**: Gradientes y animaciones CSS
- **Descarga Directa**: Botón para descargar la APK
- **Información Detallada**: Explicación de todas las funcionalidades futbolísticas
- **Personalización**: Cada equipo puede personalizar colores, logos y contenido

## 📁 Estructura del Proyecto

```
TURISTEAM/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/turisteam/
│   │   │   └── MainActivity.kt
│   │   └── res/
│   │       ├── layout/
│   │       │   └── activity_main.xml
│   │       ├── values/
│   │       │   ├── strings.xml
│   │       │   ├── colors.xml
│   │       │   └── themes.xml
│   │       └── values-night/
│   │           └── themes.xml
│   └── build.gradle.kts
├── build.gradle.kts
├── index.html
├── app-debug.apk
└── README.md
```

## 🚀 Instalación y Uso

### Para Desarrolladores

1. **Clona el repositorio**
2. **Abre el proyecto en Android Studio**
3. **Sincroniza las dependencias**
4. **Compila el proyecto**: `./gradlew assembleDebug`

### Para Usuarios

1. **Descarga la APK** desde la página web
2. **Habilita la instalación desde fuentes desconocidas**
3. **Instala la aplicación**
4. **¡Disfruta de TURISTEAM!**

## 📋 Requisitos del Sistema

- **Android**: 9.0 (API 28) o superior
- **RAM**: 2GB mínimo
- **Almacenamiento**: 50MB disponibles
- **Conexión**: Internet para sincronización

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en el directorio raíz:

```env
# Credenciales del Super Administrador
REACT_APP_SUPER_ADMIN_EMAIL=tu-email@turisteam.com
REACT_APP_SUPER_ADMIN_PASSWORD=tu-contraseña-segura

# Configuración del Backend
JWT_SECRET=tu-jwt-secret-muy-seguro
DATABASE_URL=tu-url-de-base-de-datos
```

### Firebase (Opcional)

La aplicación está configurada para usar Firebase. Para configurar tu propio backend:

1. Crea un proyecto en Firebase Console
2. Descarga el archivo `google-services.json`
3. Colócalo en la carpeta `app/`
4. Configura las reglas de Firestore

## 🔒 Seguridad

Para información detallada sobre seguridad, consulta el archivo [SECURITY.md](SECURITY.md).

### Cambios de Seguridad Implementados:
- ✅ Eliminadas credenciales hardcodeadas
- ✅ Validación de autenticación en servidor
- ✅ Uso de variables de entorno para datos sensibles
- ✅ Permisos granulares por roles

### 🔐 Cambio de Contraseña del Administrador

**Opción 1: Script Automático (Recomendado)**
```bash
node scripts/change-admin-password.js
```

**Opción 2: Manual**
1. Edita el archivo `.env`
2. Cambia `REACT_APP_SUPER_ADMIN_PASSWORD=tu-nueva-contraseña`
3. Reinicia la aplicación

**Requisitos de Contraseña Segura:**
- Mínimo 12 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial

## 📞 Soporte

Para soporte técnico o preguntas sobre la aplicación:

- **Email**: soporte@turisteam.com
- **Documentación**: Disponible en la aplicación
- **FAQ**: Sección de ayuda integrada

## 📄 Licencia

© 2024 TURISTEAM. Todos los derechos reservados.

---

**Desarrollado con ❤️ para la gestión eficiente de equipos de fútbol**