# 🏆 CDSANABRIACF - Club Deportivo Sanabriacf

## 📋 Descripción del Proyecto

Sistema web completo para la gestión del Club Deportivo Sanabriacf, desarrollado con HTML, CSS y JavaScript. Incluye gestión de socios, amigos del club, entrenadores, equipos, eventos, documentos, publicidad y un sistema de permisos avanzado.

**🚀 ACTUALIZADO: Sistema completamente funcional con sincronización automática, login seguro para entrenadores y despliegue en la nube.**

## 🚀 Características Principales

### 👥 Gestión de Usuarios
- **Socios**: Acceso completo a todas las funcionalidades
- **Amigos del Club**: Acceso limitado a competiciones y encuentros
- **Entrenadores**: Panel especializado con login seguro (email + contraseña)
- **Administradores**: Panel completo de gestión

### 🔐 Sistema de Autenticación
- **Login por email/teléfono** para socios y amigos
- **Login por email y contraseña** para entrenadores (🆕 SEGURO)
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

#### 👥 Gestión Avanzada de Socios (🆕 ACTUALIZADO)
- **Registro Automático**: Nuevos socios se reflejan inmediatamente en el dashboard
- **Validación por Administradores**: Sistema de validación con sincronización automática
- **Sincronización en Tiempo Real**: Dashboard y base de datos siempre actualizados
- **Verificación de Duplicados**: Detecta automáticamente socios existentes
- **Numeración Automática**: Asigna números de socio secuenciales (SOC-0001, SOC-0002, etc.)
- **Eliminación de Socios**: Función para eliminar socios específicos
- **Notificaciones Automáticas**: Alertas para administradores sobre cambios
- **Limpieza de Base de Datos**: Funciones para limpiar socios o toda la base

#### 👨‍🏫 Sistema de Entrenadores (🆕 ACTUALIZADO)
- **Login Seguro**: Email y contraseña obligatorios
- **Validación de Credenciales**: Verificación de email y contraseña
- **Gestión de Contraseñas**: Administradores pueden ver y restablecer contraseñas
- **Panel Especializado**: Acceso a funcionalidades específicas de entrenadores
- **Mensajes Push**: Envío de mensajes a equipos

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

### 📋 Funcionalidades del Panel (🆕 ACTUALIZADO)

#### 🗄️ Base de Datos
- **localStorage** para almacenamiento persistente (Frontend)
- **Sincronización Automática**: Todos los cambios se reflejan inmediatamente
- **Exportación** a CSV y JSON
- **Importación** desde Excel/CSV
- **Backup y restauración** de datos

#### 👥 Gestión de Usuarios
- **Socios**: Registro, validación, gestión de cuotas (🆕 Sincronización automática)
- **Amigos del Club**: Registro y gestión
- **Entrenadores**: Asignación a equipos con gestión de contraseñas (🆕 SEGURO)
- **Jugadores**: Gestión completa con categorías

#### 📅 Gestión de Contenido
- **Eventos**: Creación y gestión
- **Encuentros**: Programación de partidos
- **Documentos**: Subida y categorización
- **Publicidad**: Gestión con múltiples formatos

#### 🔧 Nuevas Funciones de Sincronización (🆕)
- **Diagnosticar y Sincronizar**: Normaliza y sincroniza todos los datos
- **Sincronizar Base de Datos**: Forza la sincronización manual
- **Diagnosticar BD**: Verifica el estado de la base de datos
- **Crear BD Simulada**: Crea una base de datos simulada para compatibilidad

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

### 👨‍🏫 Entrenadores (🆕 ACTUALIZADO)
**Acceso Completo + Panel Especial:**
- ✅ Todo el contenido de socios
- ✅ Panel de entrenadores
- ✅ Login seguro con email y contraseña
- ✅ Mensajes push a equipos
- ✅ Gestión de jugadores del equipo

## 📁 Estructura del Proyecto

```
CDSANABRIACF-FINAL/
├── index.html                 # Página principal
├── admin-panel.html          # Panel de administración (🆕 ACTUALIZADO)
├── coach-panel.html          # Panel de entrenadores
├── members-access.html       # Acceso para socios
├── friends-access.html       # Acceso para amigos
├── database.js              # Funciones de base de datos (Frontend)
├── backend/                 # Backend completo
│   ├── src/
│   │   ├── models/          # Modelos de MongoDB
│   │   ├── controllers/     # Controladores de la API
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Middleware de autenticación
│   │   └── server.ts        # Servidor principal
│   ├── package.json         # Dependencias del backend
│   └── README.md           # Documentación del backend
├── frontend/               # Frontend React (opcional)
├── mobile-app/            # Aplicación móvil
├── README.md              # Este archivo
└── assets/                # Recursos (si los hay)
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y responsivos
- **JavaScript ES6+**: Funcionalidad dinámica
- **localStorage**: Almacenamiento de sesiones y datos
- **File API**: Manejo de archivos (PDF, imágenes)

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **TypeScript**: Tipado estático
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación con tokens
- **bcryptjs**: Encriptación de contraseñas
- **multer**: Manejo de archivos
- **CORS**: Cross-Origin Resource Sharing

### Despliegue
- **Netlify**: Frontend en la nube
- **Railway**: Backend en la nube
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

### Instalación Backend
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

### Estructura de Datos Frontend (localStorage)
El sistema utiliza localStorage con las siguientes colecciones:

- **clubMembers**: Información de socios del club (🆕 Sincronización automática)
- **clubFriends**: Amigos del club
- **clubPlayers**: Jugadores de los equipos
- **clubTeams**: Información de equipos
- **clubCoaches**: Datos de entrenadores (🆕 Con contraseñas)
- **clubEvents**: Eventos del club
- **clubDocuments**: Documentos del club
- **clubAdvertisements**: Publicidad del club

### Estructura de Datos Backend (MongoDB)
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

### Dashboard de Administración (🆕 ACTUALIZADO)
- Estadísticas de usuarios en tiempo real
- Actividad del club
- Reportes de eventos
- Métricas de uso
- Sincronización automática de contadores

### Panel de Entrenadores
- Estadísticas del equipo
- Mensajes enviados
- Actividad de jugadores
- Próximos eventos

## 🚀 Funcionalidades Recientemente Implementadas (Agosto 2025 - ACTUALIZADO HOY)

### ✅ Sistema de Sincronización en Tiempo Real (🆕 NUEVO)
- **Sincronización Automática**: Cada 5 segundos entre web y app
- **Indicador Visual**: Muestra estado de sincronización en tiempo real
- **Comunicación Bidireccional**: Web ↔ App con datos siempre actualizados
- **Sincronización Inmediata**: Al registrar socios/amigos se sincroniza automáticamente
- **Función `syncDataWithApp()`**: Sincroniza datos desde web a app
- **Función `syncDataWithWeb()`**: Sincroniza datos desde app a web
- **localStorage Compartido**: Datos persistentes en ambos lados

### ✅ Lenguaje Inclusivo Implementado (🆕 NUEVO)
- **"Socios"** → **"Socios/as"**
- **"Amigos"** → **"Amigos/as"**
- **"Jugadores"** → **"Jugadores/as"**
- **"Entrenadores"** → **"Entrenadores/as"**
- **Aplicado en**: Página web principal y aplicación Android

### ✅ Sistema de Socios Completamente Funcional
- **Registro Automático**: Nuevos socios se reflejan inmediatamente en el dashboard
- **Validación por Administradores**: Sistema de validación con sincronización automática
- **Dashboard Actualizado**: Contadores en tiempo real
- **Base de Datos Sincronizada**: localStorage como fuente única de verdad
- **Validación de Socios**: Cambio de estado con actualización automática
- **Contadores Automáticos**: Socios activos, pendientes, totales

### ✅ Sistema de Login para Entrenadores (🆕 SEGURO)
- **Login con Email y Contraseña**: Obligatorio para todos los entrenadores
- **Validación de Credenciales**: Verificación de email y contraseña
- **Gestión de Contraseñas**: Administradores pueden ver y restablecer contraseñas
- **Panel de Administración**: Visualización y gestión de contraseñas
- **Seguridad Mejorada**: Sistema de autenticación robusto

### ✅ Sincronización Automática Completa
- **Datos Reflejados**: Todos los cambios se ven inmediatamente en todas las partes
- **Contadores Actualizados**: Dashboard siempre sincronizado
- **Sin Dependencias Externas**: Funcionamiento confiable y estable
- **Funciones de Diagnóstico**: Herramientas para verificar y sincronizar datos
- **Base de Datos Simplificada**: localStorage como fuente principal

### ✅ Funciones de Administración Mejoradas
- **Diagnosticar y Sincronizar**: Normaliza y sincroniza todos los datos
- **Sincronizar Base de Datos**: Forza la sincronización manual
- **Diagnosticar BD**: Verifica el estado de la base de datos
- **Crear BD Simulada**: Crea una base de datos simulada para compatibilidad
- **Reset de Contraseñas**: Para entrenadores desde el panel de administración

### ✅ Compatibilidad de Datos
- **Formato de Datos**: Compatible con diferentes formatos (español/inglés)
- **Normalización Automática**: Convierte datos a formato estándar
- **Migración de Datos**: Sistema para actualizar datos existentes
- **Validación de Integridad**: Verifica la consistencia de los datos

## 🌐 Información de Despliegue

### URLs de Acceso
- **Frontend**: `https://www.sanabriacf.com` (Netlify)
- **Backend API**: `https://tu-proyecto.railway.app` (Railway)
- **Repositorio**: `https://github.com/turispuebla-beep/turis`
- **Railway Dashboard**: `https://railway.com/project/fc2e4462-1781-4859-9ed4-5b68bb9043cb`

### Credenciales de Acceso
- **Super Admin**: `amco@gmx.es` / `533712`
- **Admin Principal**: `cdsanabriafc@gmail.com` / `admin123`
- **Admin Sanabria**: `administradores@sanabria.com` / `admin12`

## 🆕 Cambios Implementados Hoy (14 de Agosto 2025)

### ✅ Sistema de Sincronización en Tiempo Real (🆕 IMPLEMENTADO)
- **Sincronización Automática**: Cada 5 segundos entre web y app
- **Indicador Visual**: Muestra estado de sincronización en tiempo real
- **Comunicación Bidireccional**: Web ↔ App con datos siempre actualizados
- **Sincronización Inmediata**: Al registrar socios/amigos se sincroniza automáticamente
- **Función `syncDataWithApp()`**: Sincroniza datos desde web a app
- **localStorage Compartido**: Datos persistentes en ambos lados

### ✅ Lenguaje Inclusivo Implementado (🆕 IMPLEMENTADO)
- **"Socios"** → **"Socios/as"**
- **"Amigos"** → **"Amigos/as"**
- **"Jugadores"** → **"Jugadores/as"**
- **"Entrenadores"** → **"Entrenadores/as"**
- **Aplicado en**: Página web principal y aplicación Android

### ✅ Sistema de Contraseñas Mejorado (🆕 IMPLEMENTADO)
- **Login con contraseñas** para socios y amigos
- **Contraseñas visibles** para administradores
- **Recordar sesión** implementado
- **Validación de credenciales** mejorada

### ✅ Sistema de Sincronización en Tiempo Real (🆕 NUEVO)
- **Sincronización Automática**: Cada 5 segundos entre web y app
- **Indicador Visual**: Muestra estado de sincronización en tiempo real
- **Comunicación Bidireccional**: Web ↔ App con datos siempre actualizados
- **Sincronización Inmediata**: Al registrar socios/amigos se sincroniza automáticamente
- **Función `syncDataWithApp()`**: Sincroniza datos desde web a app
- **Función `syncDataWithWeb()`**: Sincroniza datos desde app a web
- **localStorage Compartido**: Datos persistentes en ambos lados

### ✅ Lenguaje Inclusivo Implementado (🆕 NUEVO)
- **"Socios"** → **"Socios/as"**
- **"Amigos"** → **"Amigos/as"**
- **"Jugadores"** → **"Jugadores/as"**
- **"Entrenadores"** → **"Entrenadores/as"**
- **Aplicado en**: Página web principal y aplicación Android

### ✅ APK Actualizada con Sincronización
- **`CDSANABRIACF-APP-INCLUSIVA.apk`**: Nueva versión con sincronización en tiempo real
- **Lenguaje Inclusivo**: Implementado en la aplicación Android
- **Sincronización Automática**: Entre web y app cada 5 segundos
- **Indicador Visual**: Estado de sincronización en tiempo real

### ✅ Sistema de Socios Operativo
- **Registro Automático**: Nuevos socios aparecen inmediatamente en el dashboard
- **Validación Funcional**: Administradores pueden validar socios con sincronización automática
- **Dashboard Sincronizado**: Contadores actualizados en tiempo real
- **Base de Datos Simplificada**: localStorage como fuente única de verdad

### ✅ Sistema de Entrenadores Seguro
- **Login con Contraseña**: Email y contraseña obligatorios para entrenadores
- **Validación de Credenciales**: Verificación de email y contraseña
- **Gestión de Contraseñas**: Administradores pueden ver y restablecer contraseñas
- **Panel de Administración**: Visualización y gestión de contraseñas

### ✅ Sincronización Automática
- **Datos Reflejados**: Todos los cambios se ven inmediatamente
- **Contadores Actualizados**: Dashboard siempre sincronizado
- **Funciones de Diagnóstico**: Herramientas para verificar y sincronizar
- **Base de Datos Simplificada**: localStorage como fuente principal

### ✅ Funciones de Administración
- **Diagnosticar y Sincronizar**: Normaliza y sincroniza todos los datos
- **Sincronizar Base de Datos**: Forza la sincronización manual
- **Diagnosticar BD**: Verifica el estado de la base de datos
- **Crear BD Simulada**: Crea una base de datos simulada para compatibilidad

### ✅ Estado Actual del Sistema
- **Frontend**: ✅ Funcionando en Netlify (www.sanabriacf.com)
- **Backend**: 🔄 En proceso de despliegue en Railway
- **Base de Datos**: ✅ Configurada (localStorage + datos simulados)
- **Sincronización**: ✅ Automática y funcional
- **Login Entrenadores**: ✅ Seguro con contraseñas

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

*Última actualización: 14 de Agosto 2025 - Sistema completamente funcional con sincronización en tiempo real, lenguaje inclusivo, contraseñas y login seguro para entrenadores*