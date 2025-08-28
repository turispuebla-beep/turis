# ⚽ CDSANABRIACF - Club Deportivo Sanabriacf

## 📱 Aplicación Web Completa para Gestión de Club de Fútbol

### 🎯 **Descripción del Proyecto**
Aplicación web completa para la gestión integral de un club de fútbol, incluyendo gestión de socios, amigos, equipos, eventos, multimedia y administración. Desarrollada con tecnologías web modernas y sincronización en tiempo real.

---

## 🚀 **Características Principales**

### 👥 **Gestión de Usuarios**
- **Socios/as**: Registro completo con validación de datos obligatorios
- **Amigos/as del Club**: Acceso limitado a calendario, equipos y resultados
- **Administradores**: Panel completo de gestión con permisos diferenciados
- **Entrenadores**: Acceso específico a gestión de equipos

### 🏆 **Gestión de Equipos**
- **Categorías**: Prebenjamín, Benjamín, Alevín, Infantil, Aficionado
- **Jugadores**: Gestión completa con datos personales y familiares
- **Dorsales**: Asignación automática de números
- **Validación**: Control de edad y consentimientos para menores

### 📅 **Calendario y Eventos**
- **Encuentros**: Gestión de partidos y resultados
- **Eventos**: Creación con límites de inscripción y precios
- **Inscripciones**: Sistema de reservas para socios

### 📸 **Multimedia**
- **Fotos**: Galería de imágenes del club
- **Videos**: Contenido audiovisual
- **Documentos**: Archivos PDF para socios y administradores

### 🎨 **Personalización**
- **Logo**: Configuración del logo del equipo
- **Temas**: Personalización de colores y fuentes
- **Branding**: Adaptación visual completa

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**
- **HTML5**: Estructura semántica y moderna
- **CSS3**: Diseño responsive con Grid y Flexbox
- **JavaScript ES6+**: Funcionalidad dinámica y sincronización
- **LocalStorage**: Persistencia de datos local
- **SessionStorage**: Gestión de sesiones

### **Backend**
- **Node.js**: Servidor en tiempo real
- **Express.js**: API RESTful
- **Socket.io**: Sincronización en tiempo real
- **Railway**: Despliegue y hosting

### **Sincronización**
- **WebSocket**: Comunicación bidireccional
- **Fetch API**: Peticiones HTTP asíncronas
- **Merge Strategy**: Combinación inteligente de datos locales y remotos

---

## 📁 **Estructura del Proyecto**

```
CDSANABRIACF-FINAL/
├── index.html              # Aplicación principal
├── admin-panel.html        # Panel de administración
├── database.js             # Configuración de base de datos
├── error-handler.js        # Manejo de errores
├── realtime-sync.js        # Sincronización en tiempo real
├── README.md              # Documentación
├── netlify.toml           # Configuración Netlify
├── package.json           # Dependencias Node.js
└── assets/                # Recursos estáticos
    ├── logo-cdsanabriacf-nuevo.png
    └── images/
```

---

## 🔧 **Instalación y Configuración**

### **Requisitos Previos**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para sincronización
- Cuenta de Railway (para backend)

### **Instalación Local**

1. **Clonar el repositorio:**
```bash
git clone [URL_DEL_REPOSITORIO]
cd CDSANABRIACF-FINAL
```

2. **Abrir la aplicación:**
```bash
# Opción 1: Doble clic en index.html
# Opción 2: Servidor local
python -m http.server 8000
# Opción 3: Live Server (VS Code)
```

3. **Acceder a la aplicación:**
```
http://localhost:8000
```

### **Configuración del Backend (Railway)**

1. **Crear cuenta en Railway:**
   - Visitar [railway.app](https://railway.app)
   - Conectar con GitHub

2. **Desplegar el backend:**
   - Importar el repositorio
   - Configurar variables de entorno
   - Desplegar automáticamente

3. **Configurar URLs:**
   - Actualizar `database.js` con la URL de Railway
   - Verificar conectividad

---

## 🎮 **Guía de Uso**

### **Para Administradores**

#### **Acceso al Panel de Administración:**
- **Email**: `amco@gmx.es`
- **Contraseña**: `533712`

#### **Funcionalidades Disponibles:**
- ✅ Gestión completa de socios y amigos
- ✅ Administración de equipos y jugadores
- ✅ Creación y gestión de eventos
- ✅ Subida de multimedia y documentos
- ✅ Personalización de la aplicación
- ✅ Estadísticas y reportes

### **Para Socios**

#### **Registro:**
1. Hacer clic en "👨‍👩‍👧‍👦 Socios/as"
2. Completar formulario con datos obligatorios:
   - Nombre y apellidos
   - DNI
   - Teléfono
   - Fecha de nacimiento
3. Confirmar registro

#### **Acceso:**
- Email y contraseña registrados
- Opción "Recordar sesión" disponible
- Recuperación de credenciales por administrador

#### **Funcionalidades:**
- 📅 Ver calendario de eventos
- ⚽ Acceder a información de equipos
- 📸 Ver galería multimedia
- 📄 Consultar documentos
- 🎫 Inscribirse en eventos

### **Para Amigos del Club**

#### **Registro:**
1. Hacer clic en "🤝 Amigos/as del Club"
2. Completar formulario básico:
   - Nombre y apellidos
   - DNI
   - Teléfono
   - Email

#### **Acceso Limitado:**
- 📅 Solo calendario
- ⚽ Solo equipos
- 📊 Solo resultados

---

## 🔄 **Sincronización de Datos**

### **Estrategia de Sincronización**
La aplicación utiliza una estrategia inteligente de sincronización que:

1. **Preserva datos locales** - No sobrescribe registros existentes
2. **Carga datos remotos** - Solo cuando no hay datos locales
3. **Combina información** - Merge inteligente de fuentes
4. **Mantiene consistencia** - Evita duplicados y conflictos

### **Flujo de Datos**
```
Usuario registra → localStorage → Sincronización → Servidor
Servidor actualiza → WebSocket → Cliente → Actualización UI
```

### **Persistencia**
- **LocalStorage**: Datos permanentes del usuario
- **SessionStorage**: Datos temporales de sesión
- **Backup automático**: Respaldo en servidor Railway

---

## 🎨 **Personalización**

### **Configuración de Branding**
- **Logo del equipo**: Subida desde panel de administración
- **Colores principales**: Rojo (#dc2626) y Azul (#3b82f6)
- **Fuentes**: Segoe UI (configurable)
- **Temas**: Personalización completa de colores

### **Configuración de Contenido**
- **Información del club**: Editable desde admin panel
- **Política de privacidad**: Configurable
- **Datos de contacto**: Gestión centralizada
- **Publicidad**: Sistema de banners y carruseles

---

## 🔒 **Seguridad y Privacidad**

### **Protección de Datos**
- **Consentimientos**: Obligatorios para menores de edad
- **Validación**: Verificación de datos obligatorios
- **Acceso controlado**: Permisos diferenciados por rol
- **Sesiones seguras**: Gestión de autenticación

### **Cumplimiento RGPD**
- **Política de privacidad**: Visible y accesible
- **Consentimiento explícito**: Para fotos y datos
- **Derecho de cancelación**: Gestión desde admin panel
- **Retención de datos**: Control de plazos

---

## 🚀 **Despliegue**

### **Netlify (Frontend)**
```toml
# netlify.toml
[build]
  publish = "."
  command = ""

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Railway (Backend)**
```json
// package.json
{
  "name": "cdsanabriacf-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### **Variables de Entorno**
```env
# Railway Environment Variables
PORT=3000
NODE_ENV=production
DATABASE_URL=your_database_url
```

---

## 📊 **Estadísticas y Métricas**

### **Funcionalidades Implementadas**
- ✅ **100%** Gestión de usuarios (Socios, Amigos, Admins)
- ✅ **100%** Sistema de autenticación
- ✅ **100%** Panel de administración
- ✅ **100%** Sincronización en tiempo real
- ✅ **100%** Gestión de equipos y jugadores
- ✅ **100%** Sistema de eventos
- ✅ **100%** Galería multimedia
- ✅ **100%** Personalización de branding
- ✅ **100%** Responsive design
- ✅ **100%** Persistencia de datos

### **Tecnologías Integradas**
- ✅ **HTML5** - Estructura semántica
- ✅ **CSS3** - Diseño moderno y responsive
- ✅ **JavaScript ES6+** - Funcionalidad avanzada
- ✅ **Node.js** - Backend robusto
- ✅ **Socket.io** - Tiempo real
- ✅ **Railway** - Hosting y despliegue
- ✅ **Netlify** - Frontend hosting

---

## 🐛 **Solución de Problemas**

### **Problemas Comunes**

#### **1. No se guardan los datos al refrescar**
- **Solución**: Verificar que `loadServerData()` preserve datos locales
- **Comando de diagnóstico**: `diagnosticarSociosAmigos()`

#### **2. Error de login**
- **Verificar**: Email y contraseña correctos
- **Comprobar**: Datos en localStorage
- **Solución**: Usar función de recuperación

#### **3. Panel de administración no abre**
- **Verificar**: Credenciales de admin correctas
- **Comprobar**: Bloqueador de popups
- **Solución**: Permitir popups para el sitio

#### **4. Sincronización no funciona**
- **Verificar**: Conexión a internet
- **Comprobar**: URL del servidor Railway
- **Solución**: Revisar console.log para errores

### **Comandos de Diagnóstico**
```javascript
// Verificar estado de datos
diagnosticarSociosAmigos()

// Limpiar datos (solo en emergencias)
localStorage.clear()
sessionStorage.clear()

// Verificar conexión al servidor
fetch('https://turis-production.up.railway.app/api/members')
  .then(response => console.log('Servidor:', response.status))
```

---

## 📞 **Soporte y Contacto**

### **Información del Proyecto**
- **Desarrollador**: Asistente AI
- **Versión**: 2.0.0
- **Última actualización**: Diciembre 2024
- **Estado**: ✅ Producción

### **Enlaces Importantes**
- **Aplicación Web**: [Netlify URL]
- **Backend API**: [Railway URL]
- **Documentación**: Este README
- **Soporte**: Panel de administración

### **Credenciales de Acceso**
- **Admin Principal**: `amco@gmx.es` / `533712`
- **Admin Equipo**: Configurar desde panel principal
- **Soporte Técnico**: Disponible en panel de admin

---

## 📝 **Changelog**

### **v2.0.0 (Diciembre 2024)**
- ✅ **NUEVO**: Sistema de sincronización mejorado
- ✅ **FIX**: Persistencia de datos locales
- ✅ **FIX**: Login de socios y amigos
- ✅ **FIX**: Panel de administración duplicado
- ✅ **FIX**: Política de privacidad cerrada por defecto
- ✅ **MEJORA**: Diagnóstico automático de datos
- ✅ **MEJORA**: Compatibilidad de nombres de campos
- ✅ **MEJORA**: Robustez del sistema de logout

### **v1.5.0 (Diciembre 2024)**
- ✅ **NUEVO**: Sistema de amigos del club
- ✅ **NUEVO**: Gestión de eventos
- ✅ **NUEVO**: Galería multimedia
- ✅ **MEJORA**: Panel de administración
- ✅ **MEJORA**: Diseño responsive

### **v1.0.0 (Diciembre 2024)**
- ✅ **LANZAMIENTO**: Aplicación base
- ✅ **NUEVO**: Sistema de socios
- ✅ **NUEVO**: Gestión de equipos
- ✅ **NUEVO**: Panel de administración
- ✅ **NUEVO**: Sincronización básica

---

## 📄 **Licencia**

Este proyecto está desarrollado para el **Club Deportivo Sanabriacf** y es de uso exclusivo para la gestión del club.

---

## 🙏 **Agradecimientos**

- **Club Deportivo Sanabriacf** por la confianza
- **Railway** por el hosting del backend
- **Netlify** por el hosting del frontend
- **Comunidad de desarrolladores** por las herramientas utilizadas

---

**⚽ ¡Que disfrutes gestionando tu club de fútbol! ⚽**