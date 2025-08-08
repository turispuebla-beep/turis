# 🔧 Guía del Panel de Administración - TURISTEAM

## 📋 Descripción General

El Panel de Administración de TURISTEAM permite a los administradores de equipos de fútbol personalizar completamente la página web de su equipo sin necesidad de conocimientos técnicos. Cada administrador gestiona únicamente su equipo específico. Todas las configuraciones se guardan localmente y se aplican en tiempo real.

## 🚀 Acceso al Panel

### Opción 1: Botón Flotante
- En la página principal, haz clic en el botón **🔧 Admin** ubicado en la esquina inferior derecha
- Se abrirá el panel en una nueva pestaña

### Opción 2: Acceso Directo
- Navega directamente a `admin-panel.html`
- URL: `http://tu-dominio.com/admin-panel.html`

## 📝 Secciones del Panel

### 1. 📝 Información General
**Configuración básica del sitio:**

- **Título del Sitio**: Nombre principal que aparece en el navegador
- **Subtítulo**: Descripción breve debajo del título
- **Email de Contacto**: Email para soporte y consultas
- **Teléfono**: Número de contacto del equipo
- **Dirección**: Dirección física del club/equipo

### 2. 🎨 Personalización de Colores
**Personalización completa del esquema de colores:**

#### Color Principal
- **Principal**: Color base para gradientes y elementos principales
- **Secundario**: Color complementario para gradientes

#### Colores de Texto
- **Texto Principal**: Color para títulos y texto importante
- **Texto Secundario**: Color para descripciones y texto menor

#### Colores de Botones
- **Botón Principal**: Color de los botones de acción
- **Hover**: Color cuando se pasa el mouse sobre los botones

#### Colores de Fondo
- **Fondo Principal**: Color de fondo de las secciones
- **Fondo de Tarjetas**: Color de fondo de las tarjetas de características

### 3. 🏆 Logos y Escudos
**Gestión de imágenes del sitio:**

#### Logo Principal
- **Formato**: PNG, JPG, SVG
- **Tamaño recomendado**: 200x100px
- **Uso**: Aparece junto al título principal del equipo

#### Escudo del Equipo
- **Formato**: PNG, JPG, SVG
- **Tamaño recomendado**: 150x150px
- **Uso**: Escudo oficial del equipo de fútbol

#### Favicon
- **Formato**: ICO, PNG
- **Tamaño recomendado**: 32x32px
- **Uso**: Icono en la pestaña del navegador

#### Dimensiones
- **Ancho del Logo**: Personalizable (50-500px)
- **Alto del Logo**: Personalizable (30-300px)

### 4. 📢 Gestión de Publicidad
**Sistema completo de publicidad:**

#### Ubicaciones de Publicidad
- **Header**: Publicidad en la parte superior de la página
- **Sidebar**: Publicidad en barra lateral (si está implementada)
- **Footer**: Publicidad en la parte inferior
- **Popup**: Publicidad emergente

#### Frecuencia de Publicidad
- **Siempre visible**: Se muestra en cada visita
- **Una vez por sesión**: Solo se muestra una vez por sesión
- **Una vez por día**: Se muestra máximo una vez por día
- **Una vez por semana**: Se muestra máximo una vez por semana

#### Código HTML para Publicidad
```html
<!-- Ejemplo de banner de Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## 💾 Funciones de Gestión

### Guardar Cambios
- **Botón**: 💾 Guardar Cambios
- **Función**: Guarda todas las configuraciones en el navegador
- **Notificación**: Muestra confirmación de guardado exitoso

### Restaurar Valores por Defecto
- **Botón**: 🔄 Restaurar Valores por Defecto
- **Función**: Elimina todas las configuraciones personalizadas
- **Confirmación**: Pide confirmación antes de proceder

### Exportar Configuración
- **Botón**: 📤 Exportar Configuración
- **Función**: Descarga un archivo JSON con todas las configuraciones
- **Uso**: Para respaldo o transferencia a otro navegador

### Limpiar Todo
- **Botón**: 🗑️ Limpiar Todo
- **Función**: Elimina todas las configuraciones y datos guardados
- **Confirmación**: Pide confirmación antes de proceder

## 👁️ Vista Previa

### Vista Previa en Tiempo Real
- **Ubicación**: Pestaña "Vista Previa"
- **Función**: Muestra la página principal con las configuraciones aplicadas
- **Actualización**: Se actualiza automáticamente al guardar cambios

### Controles de Vista Previa
- **🔄 Actualizar Vista Previa**: Recarga la vista previa
- **🔗 Abrir en Nueva Pestaña**: Abre la página principal en nueva pestaña

## 🔒 Seguridad y Privacidad

### Almacenamiento Local
- **Ubicación**: localStorage del navegador
- **Persistencia**: Los datos se mantienen entre sesiones
- **Privacidad**: Solo accesible desde el mismo navegador

### Acceso Restringido
- **Panel de Administración**: Solo visible para administradores
- **Configuraciones**: No se comparten con terceros
- **Datos**: Se mantienen en el dispositivo local

## 📱 Responsive Design

### Compatibilidad Móvil
- **Panel**: Adaptable a dispositivos móviles
- **Vista Previa**: Responsive en todos los tamaños
- **Navegación**: Tabs adaptables para pantallas pequeñas

### Optimizaciones
- **Tamaños de imagen**: Automáticos para diferentes dispositivos
- **Colores**: Consistentes en todas las resoluciones
- **Publicidad**: Adaptable a diferentes tamaños de pantalla

## 🛠️ Solución de Problemas

### Problemas Comunes

#### Los cambios no se aplican
1. Verifica que hayas hecho clic en "💾 Guardar Cambios"
2. Recarga la página principal
3. Limpia la caché del navegador

#### Las imágenes no se cargan
1. Verifica que el formato sea compatible (PNG, JPG, SVG)
2. Asegúrate de que el archivo no sea muy grande
3. Intenta con una imagen diferente

#### La publicidad no aparece
1. Verifica que el código HTML sea válido
2. Asegúrate de que la frecuencia esté configurada correctamente
3. Limpia la caché del navegador

#### El panel no se abre
1. Verifica que el archivo `admin-panel.html` esté en el mismo directorio
2. Intenta acceder directamente a la URL
3. Verifica que JavaScript esté habilitado

### Contacto de Soporte
- **Email**: soporte@turisteam.com
- **Documentación**: Esta guía
- **Actualizaciones**: Revisar regularmente el panel

## 🔄 Actualizaciones

### Versión 1.0
- ✅ Panel de administración básico
- ✅ Personalización de colores
- ✅ Gestión de logos y escudos
- ✅ Sistema de publicidad
- ✅ Vista previa en tiempo real

### Próximas Funcionalidades
- [ ] Gestión de contenido dinámico
- [ ] Múltiples temas predefinidos
- [ ] Sistema de usuarios y permisos
- [ ] Backup en la nube
- [ ] Estadísticas de visitas

---

**Nota**: Esta guía se actualiza regularmente. Para la versión más reciente, consulta el panel de administración. 