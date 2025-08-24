# 🚀 CDSANABRIACF - Configuración para Google Play Store

## 📱 Información de la Aplicación

### Datos Básicos
- **Nombre de la App**: CDSANABRIACF
- **Package Name**: `com.cdsanabriacf.app`
- **Versión**: 1.0.0
- **Versión Code**: 1
- **APK**: `CDSANABRIACF-GOOGLE-PLAY-READY.apk`

### Categoría
- **Categoría Principal**: Deportes
- **Categoría Secundaria**: Estilo de vida

## 🎯 Descripción para Google Play Store

### Título (80 caracteres máximo)
```
CDSANABRIACF - Club Deportivo
```

### Descripción Corta (80 caracteres máximo)
```
Gestión completa del Club Deportivo Sanabriacf
```

### Descripción Completa
```
🏆 CDSANABRIACF - Club Deportivo Sanabriacf

La aplicación oficial del Club Deportivo Sanabriacf de Puebla de Sanabria, Zamora.

FUNCIONALIDADES PRINCIPALES:
✅ Gestión completa de socios del club
✅ Registro y validación automática de nuevos socios
✅ Panel de administración con sincronización en tiempo real
✅ Login seguro para entrenadores con contraseñas
✅ Gestión de equipos: Prebenjamín, Benjamín, Alevín, Infantil, Aficionado
✅ Calendario de partidos y entrenamientos
✅ Eventos del club con inscripciones
✅ Galería de fotos y videos
✅ Documentos del club (PDF)
✅ Sistema de amigos del club con acceso limitado
✅ Publicidad y noticias del club

CARACTERÍSTICAS TÉCNICAS:
🔒 Sistema de autenticación seguro
📱 Interfaz optimizada para móviles
🔄 Sincronización automática de datos
⚡ Carga rápida y eficiente
🔄 Actualizaciones automáticas

PERFILES DE USUARIO:
👥 Socios: Acceso completo a todas las funcionalidades
🤝 Amigos del Club: Acceso limitado a competiciones y resultados
👨‍🏫 Entrenadores: Panel especializado con gestión de equipos
👨‍💼 Administradores: Gestión completa del club

INFORMACIÓN DEL CLUB:
📍 Ubicación: Puebla de Sanabria, Zamora
📧 Email: cdsanabriafc@gmail.com
🌐 Web: www.cdsanabriacf.com

Esta aplicación permite a todos los miembros del club acceder a la información más actualizada del Club Deportivo Sanabriacf de forma fácil, rápida y segura.

¡Descarga la app oficial del CDSANABRIACF y mantente conectado con tu club deportivo!
```

## 🖼️ Imágenes Requeridas

### Icono de la App (512x512 px)
- Archivo: `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

### Capturas de Pantalla (mínimo 2, máximo 8)
- Resolución: 1080x1920 px (portrait)
- Formatos: PNG o JPEG
- Contenido sugerido:
  1. Página principal con menú
  2. Panel de administración
  3. Registro de socios
  4. Calendario de partidos

### Imagen Promocional (1024x500 px)
- Banner promocional para la ficha de la app

## 🔧 Configuración Técnica

### Permisos Requeridos
- `android.permission.INTERNET` - Para cargar contenido web
- `android.permission.ACCESS_NETWORK_STATE` - Para verificar conectividad
- `android.permission.POST_NOTIFICATIONS` - Para notificaciones push
- `android.permission.WAKE_LOCK` - Para actualizaciones en segundo plano

### Características Técnicas
- **Min SDK**: 28 (Android 9.0)
- **Target SDK**: 34 (Android 14)
- **Compile SDK**: 34
- **Arquitectura**: WebView con contenido local
- **Actualizaciones**: In-App Updates de Google Play Store

## 📋 Pasos para Publicar en Google Play Store

### 1. Crear Cuenta de Desarrollador
- Ir a [Google Play Console](https://play.google.com/console)
- Crear cuenta de desarrollador ($25 USD, pago único)
- Completar información de la cuenta

### 2. Crear Nueva Aplicación
- Hacer clic en "Crear aplicación"
- Seleccionar idioma predeterminado: Español
- Ingresar título: "CDSANABRIACF"
- Especificar tipo: Aplicación
- Indicar si es gratuita o de pago: Gratuita

### 3. Configurar Información de la App
- **Información de la app**:
  - Título: "CDSANABRIACF - Club Deportivo"
  - Descripción corta: "Gestión completa del Club Deportivo Sanabriacf"
  - Descripción completa: (usar la descripción de arriba)
  - Categoría: Deportes

### 4. Subir APK
- Ir a "Producción" → "Pistas de lanzamiento"
- Crear nueva pista de lanzamiento
- Subir archivo: `CDSANABRIACF-GOOGLE-PLAY-READY.apk`
- Completar información de la versión

### 5. Configurar Contenido
- **Imágenes**: Subir icono y capturas de pantalla
- **Clasificación de contenido**: Completar cuestionario
- **Privacidad**: Configurar política de privacidad

### 6. Configurar Precios y Distribución
- **Países**: Seleccionar España (y otros países si es necesario)
- **Precio**: Gratuita
- **Dispositivos**: Teléfonos y tablets

### 7. Revisar y Publicar
- Revisar toda la información
- Enviar para revisión
- Esperar aprobación (1-3 días)

## 🔄 Actualizaciones Automáticas

### Configuración de Versiones
Para futuras actualizaciones, incrementar:
- `versionCode`: +1 cada actualización
- `versionName`: formato semántico (1.0.1, 1.1.0, etc.)

### Proceso de Actualización
1. Actualizar archivos web en `app/src/main/assets/`
2. Incrementar versiones en `build.gradle.kts`
3. Compilar nueva APK: `./gradlew assembleRelease`
4. Subir a Google Play Console
5. Los usuarios recibirán actualización automática

## 📞 Soporte

### Información de Contacto
- **Desarrollador**: Club Deportivo Sanabriacf
- **Email**: cdsanabriafc@gmail.com
- **Web**: www.cdsanabriacf.com
- **Ubicación**: Puebla de Sanabria, Zamora, España

### Política de Privacidad
La aplicación no recopila datos personales más allá de los necesarios para el funcionamiento del club deportivo. Todos los datos se almacenan localmente en el dispositivo del usuario.

---

**¡La app está lista para ser publicada en Google Play Store!** 🚀
