# 📱 CDSANABRIACF - App Móvil

## 📋 Descripción

Aplicación móvil React Native para el Club Deportivo CDSANABRIACF. App sencilla y funcional que permite a socios y amigos del club acceder a información, equipos, calendario y gestionar su perfil.

## 🎨 Diseño y Colores

### Paleta de Colores
- **Color Primario:** Rojo (#dc2626) - CDSANABRIACF
- **Color Secundario:** Azul (#3b82f6) - Complementario
- **Fondo:** Gris claro (#f8fafc)
- **Texto:** Negro (#333) y Gris (#666)

### Características Visuales
- ✅ Gradientes atractivos (rojo a azul)
- ✅ Iconos Material Design
- ✅ Cards con sombras
- ✅ Interfaz limpia y moderna
- ✅ Diseño responsive

## 📱 Funcionalidades Principales

### Pantalla de Inicio
- ✅ Header con gradiente y logo
- ✅ Reloj en tiempo real
- ✅ Información del usuario
- ✅ Accesos rápidos (Equipos, Calendario, Perfil, Notificaciones)
- ✅ Estadísticas del club
- ✅ Botones de registro/login para usuarios no autenticados

### Sistema de Autenticación
- ✅ Registro de socios y amigos
- ✅ Login con email o teléfono
- ✅ Gestión de sesiones
- ✅ Cerrar sesión con confirmación

### Navegación
- ✅ Bottom tabs para usuarios autenticados
- ✅ Stack navigation para flujo de autenticación
- ✅ Navegación intuitiva entre pantallas

## 🏗️ Estructura del Proyecto

```
mobile-app/
├── App.js                    # Componente principal
├── package.json             # Dependencias
├── README.md               # Documentación
└── src/
    ├── screens/            # Pantallas de la app
    │   ├── HomeScreen.js   # Pantalla principal
    │   ├── LoginScreen.js  # Login
    │   ├── RegisterScreen.js # Registro
    │   ├── TeamsScreen.js  # Equipos
    │   ├── CalendarScreen.js # Calendario
    │   └── ProfileScreen.js # Perfil
    └── context/
        └── AuthContext.js  # Contexto de autenticación
```

## 🚀 Instalación y Uso

### Requisitos
- Node.js (versión 14 o superior)
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS)

### Instalación
```bash
# Clonar el proyecto
cd mobile-app

# Instalar dependencias
npm install

# Para Android
npx react-native run-android

# Para iOS
npx react-native run-ios
```

### Dependencias Principales
- `react-navigation` - Navegación
- `react-native-paper` - Componentes UI
- `react-native-vector-icons` - Iconos
- `react-native-linear-gradient` - Gradientes
- `@react-native-async-storage/async-storage` - Almacenamiento

## 📊 Pantallas Disponibles

### HomeScreen
- **Funcionalidad:** Pantalla principal con información del club
- **Características:**
  - Header con gradiente rojo-azul
  - Reloj en tiempo real
  - Accesos rápidos a funcionalidades
  - Estadísticas del club
  - Información del usuario autenticado

### LoginScreen
- **Funcionalidad:** Acceso de usuarios
- **Características:**
  - Login con email o teléfono
  - Validación de campos
  - Mensajes de error
  - Navegación a registro

### RegisterScreen
- **Funcionalidad:** Registro de nuevos usuarios
- **Características:**
  - Formulario completo
  - Selección de tipo (socio/amigo)
  - Validación de datos
  - Consentimientos

### TeamsScreen
- **Funcionalidad:** Visualización de equipos
- **Características:**
  - Lista de equipos por categoría
  - Información de jugadores
  - Navegación detallada

### CalendarScreen
- **Funcionalidad:** Calendario de eventos
- **Características:**
  - Eventos del club
  - Partidos programados
  - Filtros por fecha

### ProfileScreen
- **Funcionalidad:** Gestión de perfil
- **Características:**
  - Información del usuario
  - Configuración de cuenta
  - Historial de actividades

## 🔧 Características Técnicas

### Tecnologías Utilizadas
- **React Native** - Framework principal
- **React Navigation** - Navegación
- **React Native Paper** - Componentes UI
- **AsyncStorage** - Persistencia de datos
- **Vector Icons** - Iconografía

### Arquitectura
- ✅ Componentes funcionales con hooks
- ✅ Context API para estado global
- ✅ Navegación por tabs y stack
- ✅ Almacenamiento local
- ✅ Validación de formularios

### Rendimiento
- ✅ Lazy loading de pantallas
- ✅ Optimización de imágenes
- ✅ Gestión eficiente del estado
- ✅ Memoria optimizada

## 🎯 Funcionalidades por Tipo de Usuario

### Socios
- ✅ Acceso completo a todas las funcionalidades
- ✅ Visualización de equipos y jugadores
- ✅ Calendario completo de eventos
- ✅ Gestión de perfil avanzada

### Amigos del Club
- ✅ Acceso limitado a calendario
- ✅ Visualización básica de equipos
- ✅ Perfil simplificado

## 📱 Compatibilidad

### Plataformas
- ✅ Android (API 21+)
- ✅ iOS (iOS 11+)

### Dispositivos
- ✅ Smartphones
- ✅ Tablets
- ✅ Diferentes tamaños de pantalla

## 🔄 Actualizaciones Recientes

### Versión 1.1.0
- ✅ Rediseño completo con colores CDSANABRIACF
- ✅ Pantalla de inicio mejorada
- ✅ Reloj en tiempo real
- ✅ Accesos rápidos optimizados
- ✅ Interfaz más atractiva y moderna

### Mejoras de UX
- ✅ Gradientes atractivos
- ✅ Iconos descriptivos
- ✅ Navegación intuitiva
- ✅ Feedback visual mejorado

## 🛠️ Desarrollo

### Comandos Útiles
```bash
# Iniciar Metro bundler
npx react-native start

# Limpiar cache
npx react-native start --reset-cache

# Generar APK de release
cd android && ./gradlew assembleRelease
```

### Estructura de Código
- **Componentes:** Funcionales con hooks
- **Estilos:** StyleSheet con colores consistentes
- **Navegación:** Stack y Tab navigators
- **Estado:** Context API para autenticación

## 📞 Soporte

### Contacto
- **Desarrollador:** Sistema CDSANABRIACF
- **Email:** club@cdsanabriacf.com
- **Versión:** 1.1.0

### Documentación Adicional
- `README.md` - Documentación principal
- Código comentado para facilitar mantenimiento

---

**⚽ CDSANABRIACF - App Móvil**

*Sistema móvil completo para gestión del club deportivo*
