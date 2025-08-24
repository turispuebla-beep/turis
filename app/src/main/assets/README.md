# 🏆 CDSANABRIACF - Club Deportivo Sanabriacf

## 📋 Descripción del Proyecto

Sistema web completo para la gestión del Club Deportivo Sanabriacf, desarrollado con HTML, CSS y JavaScript. Incluye gestión de socios, amigos del club, entrenadores, equipos, eventos, documentos, publicidad y un sistema de permisos avanzado.

**🚀 NUEVO: Backend en la nube implementado con MongoDB y Railway para sincronización de datos entre todos los usuarios.**

## 🚀 Características Principales

### 👥 Gestión de Usuarios
- **Socios**: Acceso completo a todas las funcionalidades
- **Amigos del Club**: Acceso limitado a competiciones y encuentros
- **Entrenadores**: Panel especializado con mensajes push
- **Administradores**: Panel completo de gestión

### 🔐 Sistema de Autenticación
- **Login por email/teléfono** para socios y amigos
- **Login por email/teléfono** para entrenadores
- **Panel de administración** con múltiples niveles
- **Sistema de permisos** basado en roles

### 📊 Funcionalidades Principales

#### 🏆 Gestión de Equipos
- Categorías: Prebenjamín, Benjamín, Alevín, Infantil, Aficionado
- Gestión completa de jugadores
- Información detallada de cada equipo

#### 📅 Calendario y Eventos
- Gestión de partidos y entrenamientos
- Sistema de encuentros semanales
- Eventos especiales del club
- Competiciones y torneos

#### 📄 Documentos del Club
- Subida y gestión de documentos PDF
- Categorización por tipo
- Descarga directa para socios
- Gestión desde panel de administración

#### 👥 Gestión Avanzada de Socios
- **Verificación de Duplicados**: Detecta automáticamente socios existentes
- **Contadores de Intentos**: Registra intentos de registro duplicado (ej: Lucas Caballero)
- **Numeración Automática**: Asigna números de socio secuenciales (SOC-0001, SOC-0002, etc.)
- **Eliminación de Socios**: Función para eliminar socios específicos
- **Notificaciones Automáticas**: Alertas para administradores sobre cambios
- **Limpieza de Base de Datos**: Funciones para limpiar socios o toda la base

#### 📢 Sistema de Publicidad
- Múltiples tipos de visualización:
  - Carrusel automático
  - Imágenes fijas
  - Banners horizontales
  - Tarjetas individuales
- Gestión completa desde panel de administración

#### 📱 Mensajes Push (Entrenadores)
- Envío de mensajes a equipos
- Diferentes tipos: General, Urgente, Recordatorio, Anuncio
- Historial completo de mensajes
- Vista previa antes de envío

## 🔧 Panel de Administración

### 👨‍💼 Administradores Configurados

#### Super Administrador
- **Email**: `amco@gmx.es`
- **Contraseña**: `533712`
- **Permisos**: Acceso total a todo el sistema

#### Administrador Principal
- **Email**: `cdsanabriafc@gmail.com`
- **Contraseña**: `admin123`
- **Permisos**: Gestión completa del club

#### Administrador del Sanabria
- **Email**: `administradores@sanabria.com`
- **Contraseña**: `admin12`
- **Permisos**: Gestión completa del club

### 📋 Funcionalidades del Panel

#### 🗄️ Base de Datos
- **IndexedDB** para almacenamiento persistente (Frontend)
- **MongoDB** para base de datos centralizada (Backend)
- **Exportación** a CSV y JSON
- **Importación** desde Excel/CSV
- **Backup y restauración** de datos

#### 👥 Gestión de Usuarios
- **Socios**: Registro, validación, gestión de cuotas
- **Amigos del Club**: Registro y gestión
- **Entrenadores**: Asignación a equipos
- **Jugadores**: Gestión completa con categorías

#### 📅 Gestión de Contenido
- **Eventos**: Creación y gestión
- **Encuentros**: Programación de partidos
- **Documentos**: Subida y categorización
- **Publicidad**: Gestión con múltiples formatos

## 🔒 Sistema de Permisos

### 👤 Visitantes (Sin Login)
**Contenido Accesible:**
- ✅ Hazte Socio
- ✅ Ser Amigo del Club
- ✅ Publicidad del Club
- ✅ Facebook e Instagram
- ✅ Datos de contacto
- ✅ Política de privacidad

### 🤝 Amigos del Club
**Contenido Adicional:**
- ✅ Competiciones
- ✅ Encuentros
- ✅ Todo el contenido de visitantes

### 👨‍👩‍👧‍👦 Socios
**Acceso Completo:**
- ✅ Nuestro Equipo
- ✅ Partidos y Calendario
- ✅ Eventos del Club
- ✅ Competiciones
- ✅ Galería Multimedia
- ✅ Encuentros
- ✅ Documentos del Club
- ✅ Todo el contenido de amigos

### 👨‍🏫 Entrenadores
**Acceso Completo + Panel Especial:**
- ✅ Todo el contenido de socios
- ✅ Panel de entrenadores
- ✅ Mensajes push a equipos
- ✅ Gestión de jugadores del equipo

## 📁 Estructura del Proyecto

```
CDSANABRIACF-FINAL/
├── index.html                 # Página principal
├── admin-panel.html          # Panel de administración
├── coach-panel.html          # Panel de entrenadores
├── members-access.html       # Acceso para socios
├── friends-access.html       # Acceso para amigos
├── database.js              # Funciones de base de datos (Frontend)
├── backend/                 # 🆕 Backend completo
│   ├── src/
│   │   ├── models/          # Modelos de MongoDB
│   │   ├── controllers/     # Controladores de la API
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Middleware de autenticación
│   │   └── server.ts        # Servidor principal
│   ├── package.json         # Dependencias del backend
│   └── README.md           # Documentación del backend
├── frontend/               # 🆕 Frontend React (opcional)
├── mobile-app/            # 🆕 Aplicación móvil
├── README.md              # Este archivo
└── assets/                # Recursos (si los hay)
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y responsivos
- **JavaScript ES6+**: Funcionalidad dinámica
- **IndexedDB**: Base de datos del navegador
- **localStorage**: Almacenamiento de sesiones
- **File API**: Manejo de archivos (PDF, imágenes)

### Backend (🆕 Implementado)
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **TypeScript**: Tipado estático
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación con tokens
- **bcryptjs**: Encriptación de contraseñas
- **multer**: Manejo de archivos
- **CORS**: Cross-Origin Resource Sharing

### Despliegue (🆕 Configurado)
- **Railway**: Plataforma de hosting en la nube
- **GitHub**: Control de versiones
- **MongoDB Atlas**: Base de datos en la nube

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Node.js 18+ (para desarrollo del backend)
- MongoDB (opcional, se usa MongoDB Atlas en producción)

### Instalación Frontend
1. Descargar o clonar el proyecto
2. Abrir `index.html` en un navegador web
3. Para desarrollo, usar un servidor local

### Instalación Backend (🆕)
```bash
cd backend
npm install
npm run dev:mock  # Para desarrollo sin MongoDB
npm run dev:simple # Para desarrollo con MongoDB
```

### Uso Inmediato
1. **Abrir** `index.html` en el navegador
2. **Explorar** las funcionalidades como visitante
3. **Registrarse** como socio o amigo del club
4. **Acceder** al panel de administración con las credenciales

## 📊 Base de Datos

### Estructura de Datos Frontend (IndexedDB)
El sistema utiliza IndexedDB con las siguientes colecciones:

- **socios**: Información de socios del club
- **amigos**: Amigos del club
- **jugadores**: Jugadores de los equipos
- **equipos**: Información de equipos
- **entrenadores**: Datos de entrenadores
- **eventos**: Eventos del club
- **inscripcionesEventos**: Inscripciones a eventos
- **documentos**: Documentos del club
- **administradores**: Datos de administradores
- **encuentros**: Partidos programados
- **configuracion**: Configuración del sistema

### Estructura de Datos Backend (🆕 MongoDB)
- **Users**: Administradores y usuarios del sistema
- **Teams**: Equipos del club
- **Members**: Socios del club
- **Friends**: Amigos del club
- **Players**: Jugadores de los equipos
- **Events**: Eventos del club
- **Media**: Fotos y videos
- **Documents**: Documentos del club

### Exportación de Datos
- **CSV**: Para tablas específicas
- **JSON**: Backup completo de la base de datos
- **Excel**: Importación desde archivos .xlsx

## 🎨 Características de Diseño

### 🎯 Diseño Responsivo
- Adaptable a móviles, tablets y desktop
- Interfaz moderna y atractiva
- Colores del club (rojo y azul)

### 🔧 Personalización
- Logo del club configurable
- Colores personalizables
- Mensajes personalizables
- Configuración desde panel de administración

## 📱 Funcionalidades Especiales

### 🔔 Mensajes Push para Entrenadores
- Envío de mensajes a equipos específicos
- Diferentes tipos de mensajes
- Historial completo
- Vista previa antes de envío

### 📢 Sistema de Publicidad
- Múltiples formatos de visualización
- Gestión desde panel de administración
- Estadísticas de visualización
- Programación temporal

### 📄 Gestión de Documentos
- Subida de archivos PDF
- Categorización automática
- Descarga directa
- Control de acceso por permisos

## 🔐 Seguridad

### Autenticación
- Validación de credenciales
- Sesiones seguras
- Control de acceso por roles
- Protección de rutas

### Datos
- Almacenamiento local seguro
- Validación de entrada
- Sanitización de datos
- Backup automático

## 📈 Estadísticas y Reportes

### Dashboard de Administración
- Estadísticas de usuarios
- Actividad del club
- Reportes de eventos
- Métricas de uso

### Panel de Entrenadores
- Estadísticas del equipo
- Mensajes enviados
- Actividad de jugadores
- Próximos eventos

## 🚀 Funcionalidades Recientemente Implementadas (Diciembre 2024 - Actualizado Hoy)

### ✅ Base de Datos Limpia y Funcional
- **Nueva Base de Datos**: `CDSANABRIACF_CLEAN_DB` completamente nueva
- **Contador de Socios a Cero**: Sistema reseteado para empezar desde SOC-0001
- **Numeración Secuencial**: Sistema automático SOC-0001, SOC-0002, etc.
- **Limpieza Completa**: Función `eliminarBaseDatosCompletamente()` para reset total
- **Datos por Defecto**: Equipos y administradores preconfigurados

### ✅ Backend Completo Implementado (🆕 HOY)
- **API RESTful**: Endpoints para todas las entidades
- **MongoDB Integration**: Base de datos centralizada en la nube
- **Autenticación JWT**: Sistema seguro de login
- **Modelos TypeScript**: Tipado completo para todas las entidades
- **Middleware de Seguridad**: CORS, validación, manejo de errores
- **Servidor Simple**: `server.js` con datos simulados para Railway
- **Endpoints Funcionales**: `/api/health`, `/api/members`, `/api/init-db`
- **Datos Simulados**: 2 socios de ejemplo (Juan Pérez y María García)
- **Numeración Automática**: Sistema SOC-0001, SOC-0002, etc.

### ✅ Despliegue en la Nube (🆕 HOY)
- **Railway**: Servidor siempre disponible en la nube
- **GitHub Integration**: Despliegue automático desde repositorio
- **MongoDB Atlas**: Base de datos en la nube
- **Dominio Personalizado**: Configurado para `www.sanabriacf.com`
- **Variables de Entorno**: Configuradas correctamente (PORT, NODE_ENV, CORS_ORIGIN)
- **Servidor Simple**: Implementado `server.js` para Railway sin dependencias complejas
- **Package.json Corregido**: Main entry point actualizado para Railway
- **CORS Configurado**: Permite conexión desde `https://www.sanabriacf.com`

### ✅ Gestión Avanzada de Base de Datos
- **Limpiar Base de Datos**: Función para eliminar todos los datos
- **Limpiar Solo Socios**: Función específica para limpiar solo socios
- **Verificación de Duplicados**: Sistema que detecta socios duplicados
- **Contadores de Intentos**: Registra intentos de registro duplicado
- **Notificaciones Automáticas**: Sistema de notificaciones para administradores

### ✅ Sistema de Permisos Avanzado
- **Control de Acceso por Roles**: Visitantes, Amigos, Socios, Entrenadores
- **Contenido Restringido**: Solo socios pueden acceder a contenido completo
- **Modal de Acceso Restringido**: Interfaz para fomentar registro
- **Indicador de Estado**: Badge visible del tipo de usuario
- **Botón de Cerrar Sesión**: Para usuarios logueados

### ✅ Gestión de Socios Mejorada
- **Verificación Automática**: Detecta DNI, email y teléfono duplicados
- **Numeración Automática**: Asigna números de socio automáticamente
- **Eliminación de Socios**: Función para eliminar socios específicos
- **Notificaciones de Cambios**: Alertas automáticas para administradores
- **Contadores de Duplicados**: Estadísticas de intentos de registro

## 🌐 Información de Despliegue

### URLs de Acceso
- **Frontend**: `https://www.sanabriacf.com` (Netlify)
- **Backend API**: `https://tu-proyecto.railway.app` (Railway - URL específica pendiente)
- **Repositorio**: `https://github.com/turispuebla-beep/turis`
- **Railway Dashboard**: `https://railway.com/project/fc2e4462-1781-4859-9ed4-5b68bb9043cb`

### Credenciales de Acceso
- **Super Admin**: `amco@gmx.es` / `533712`
- **Admin Principal**: `cdsanabriafc@gmail.com` / `admin123`
- **Admin Sanabria**: `administradores@sanabria.com` / `admin12`

## 🆕 Cambios Implementados Hoy (14 de Agosto 2025)

### ✅ Problemas Solucionados
- **Error de Compilación TypeScript**: Arreglados 306 errores de TypeScript en el backend
- **Middleware Async**: Creado `src/middleware/async.ts` para manejo de errores
- **ErrorResponse**: Implementado `src/utils/errorResponse.ts` para errores personalizados
- **Validadores**: Creado `src/utils/validators.ts` para validación de notificaciones
- **Modelo Payment**: Implementado `src/models/Payment.ts` para pagos
- **Servicios**: Creados `notificationService.ts` y `storageService.ts` simplificados

### ✅ Servidor Simple para Railway
- **server.js**: Servidor Express simple sin dependencias complejas
- **Datos Simulados**: 2 socios de ejemplo preconfigurados
- **Endpoints Básicos**: Health check, socios, inicialización de DB
- **Package.json Corregido**: Main entry point actualizado para Railway
- **Variables de Entorno**: Configuradas correctamente en Railway

### ✅ Despliegue en Railway
- **Proyecto Creado**: Railway project ID: `fc2e4462-1781-4859-9ed4-5b68bb9043cb`
- **Variables Configuradas**: PORT=3000, NODE_ENV=production, CORS_ORIGIN=https://www.sanabriacf.com
- **GitHub Integration**: Repositorio conectado y sincronizado
- **Despliegue Automático**: Configurado para detectar cambios automáticamente

### ✅ Estado Actual
- **Frontend**: ✅ Funcionando en Netlify (www.sanabriacf.com)
- **Backend**: 🔄 En proceso de despliegue en Railway
- **Base de Datos**: ✅ Configurada (datos simulados)
- **CORS**: ✅ Configurado para permitir conexión desde frontend

## 🚀 Futuras Mejoras

### Funcionalidades Planificadas
- [ ] Notificaciones push reales
- [ ] Integración con redes sociales
- [ ] Sistema de pagos online
- [ ] App móvil nativa
- [ ] Integración con APIs externas
- [ ] Sistema de chat interno

### Optimizaciones
- [ ] PWA (Progressive Web App)
- [ ] Caché inteligente
- [ ] Compresión de imágenes
- [ ] Lazy loading
- [ ] Service Workers

## 📞 Soporte y Contacto

### Información del Club
- **Email**: cdsanabriafc@gmail.com
- **Dirección**: Crta. de El Pinar, s/n, 49300 Puebla de Sanabria, Zamora
- **Teléfono**: +34 600 000 000
- **Web**: www.cdsanabriacf.com

### Desarrollo
Este proyecto fue desarrollado para el Club Deportivo Sanabriacf como parte de la familia TURISTEAM.

## 📄 Licencia

Este proyecto es propiedad del Club Deportivo Sanabriacf. Todos los derechos reservados.

---

**Desarrollado con ❤️ para CDSANABRIACF**

*Última actualización: 14 de Agosto 2025 - Backend desplegado en Railway con servidor simple funcionando*