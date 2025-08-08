# 🏪 CDSANABRIACF - Sistema Web Completo

## 📋 Descripción General

Sistema web completo para el Club Deportivo SANABRIACF que incluye gestión de usuarios, equipos, eventos, multimedia, configuración de temas y **sistema completo de tienda online**.

## 🚀 Características Principales

### 👥 Sistema de Usuarios
- **Administrador Único**: Acceso completo a todas las funcionalidades
- **Administradores de Equipo**: Gestión específica de su equipo asignado
- **Socios**: Acceso completo a todas las secciones
- **Amigos del Club**: Acceso limitado (calendario y competiciones)

### 🏪 Sistema Completo de Tienda Online

#### **Panel de Administración (`admin-tienda-completa.html`)**
- ✅ **Gestión de Productos**:
  - Añadir productos con nombre, categoría, precio, descripción
  - Sistema de variantes con tallas, colores y stock individual
  - Agregar múltiples variantes por producto
  - Gestión de stock en tiempo real
  - Eliminar productos con confirmación

- ✅ **Enlaces a Tiendas Online**:
  - Múltiples enlaces configurable
  - Nombre y URL para cada tienda
  - Agregar/quitar enlaces dinámicamente
  - Guardado automático en localStorage

- ✅ **Registro de Compras**:
  - **Nombre y apellido** del socio/amigo que compró
  - Tipo de usuario (socio/amigo)
  - Producto y variante comprada
  - Fecha de compra
  - Precio pagado
  - Estado de la compra

- ✅ **Estadísticas**:
  - Productos totales
  - Stock bajo
  - Valor total del inventario
  - Compras realizadas

#### **Tienda Pública (`tienda-completa.html`)**
- ✅ **Visualización de Productos**:
  - Productos con variantes (tallas, colores)
  - Selección de talla y color antes de comprar
  - Stock en tiempo real por variante
  - Filtros por categoría

- ✅ **Sistema de Compras**:
  - Restricción solo para socios/amigos
  - Registro automático de compras con datos del cliente
  - Actualización automática del stock
  - Enlaces a tiendas online configurados por admin

- ✅ **Información de Entrega**:
  - **Entrega en mano** en las instalaciones del club
  - Enlaces a tiendas online para **envío a casa**
  - Clarificación de métodos de entrega

### 🎨 Personalización de Temas
- **Colores configurables** desde el panel de administración
- **Sincronización en tiempo real** entre admin y página principal
- **Colores forzados**: Rojo primario (#dc2626) y azul secundario (#3b82f6)
- **Mensaje del logo** configurable
- **Persistencia** de configuraciones

### 🔐 Sistema de Autenticación
- **Login flexible**: Email o teléfono para socios/amigos
- **Contraseñas ocultas** con puntos (••••••••)
- **Validación manual** de socios (7 días)
- **Acceso restringido** para amigos

## 📁 Estructura de Archivos

```
CDSANABRIACF/
├── index.html                    # Página principal
├── admin-panel.html              # Panel de administración principal
├── admin-tienda-completa.html    # Panel de administración de tienda
├── tienda-completa.html          # Tienda pública
├── members-access.html           # Acceso para socios
├── friends-access.html           # Acceso para amigos
├── config.js                     # Configuración de credenciales
├── logo-cdsanabriacf.jpeg        # Logo del club
└── README.md                     # Este archivo
```

## 🔧 Instalación y Configuración

### Requisitos
- Navegador web moderno
- Servidor web (opcional, funciona en local)

### Configuración Inicial
1. **Acceso de Administrador Único**:
   - Email: `amco@gmx.es`
   - Contraseña: `533712`

2. **Acceso de Administrador Secundario**:
   - Email: `cdsanabriacf@gmail.com`
   - Contraseña: `admin123`

### Configuración de la Tienda
1. Acceder al panel de administración
2. Ir a la sección "🏪 Tienda"
3. Configurar productos con variantes
4. Añadir enlaces a tiendas online
5. Verificar el registro de compras

## 🛒 Funcionalidades de la Tienda

### Para Administradores
- **Crear productos** con múltiples variantes
- **Gestionar stock** por talla y color
- **Configurar enlaces** a tiendas online
- **Ver estadísticas** de ventas
- **Registro completo** de compras con datos de clientes

### Para Usuarios (Socios y Amigos)
- **Ver productos** con variantes disponibles
- **Seleccionar talla y color** antes de comprar
- **Comprar productos** (solo socios y amigos)
- **Ver enlaces** a tiendas online para envío a casa

### Flujo de Compra
1. Usuario selecciona producto
2. Elige variante (talla/color)
3. Confirma compra
4. Sistema registra:
   - Nombre y apellido del cliente
   - Tipo de usuario (socio/amigo)
   - Producto y variante
   - Fecha y precio
5. Stock se actualiza automáticamente

## 🔐 Seguridad

### Contraseñas
- **Ocultas en campos de entrada** (••••••••)
- **No visibles en alertas** de error
- **Administrador principal** siempre oculto
- **Administradores pueden ver** contraseñas de otros usuarios

### Validación de Usuarios
- **Socios**: Validación manual por administrador (7 días)
- **Amigos**: Acceso inmediato limitado
- **Restricciones de compra**: Solo socios y amigos

## 🎨 Personalización

### Temas
- **Colores primarios y secundarios** configurables
- **Sincronización automática** entre páginas
- **Persistencia** en localStorage
- **Mensaje del logo** personalizable

### Logo
- **Emoji de escudo** por defecto
- **Imagen personalizada** disponible
- **Cambio de color** según tema

## 📱 Responsive Design
- **Diseño adaptativo** para móviles y tablets
- **Interfaz moderna** con gradientes y animaciones
- **Navegación intuitiva** con iconos

## 🔄 Persistencia de Datos
- **localStorage** para todos los datos
- **Sincronización automática** entre páginas
- **Backup automático** de configuraciones

## 🚀 Uso Rápido

### Acceso Administrador
1. Ir a `index.html`
2. Hacer clic en "Administración"
3. Usar credenciales: `amco@gmx.es` / `533712`

### Gestión de Tienda
1. En panel admin, ir a "🏪 Tienda"
2. Crear productos con variantes
3. Configurar enlaces online
4. Ver estadísticas y compras

### Acceso de Usuarios
1. **Socios**: Registro → Validación admin → Acceso completo
2. **Amigos**: Registro → Acceso limitado
3. **Compras**: Solo socios y amigos pueden comprar

## 📊 Estadísticas Disponibles
- **Productos totales** en tienda
- **Stock bajo** (menos de 5 unidades)
- **Valor total** del inventario
- **Compras realizadas** con datos de clientes

## 🔗 Enlaces Importantes
- **Página Principal**: `index.html`
- **Panel Admin**: `admin-panel.html`
- **Admin Tienda**: `admin-tienda-completa.html`
- **Tienda Pública**: `tienda-completa.html`

## 🆘 Soporte
- **Errores de login**: Verificar credenciales
- **Problemas de tienda**: Verificar localStorage
- **Temas no aplicados**: Limpiar caché del navegador

## 📝 Notas Importantes
- **Contraseña principal** (`533712`) siempre oculta
- **Validación de socios** manual por administrador
- **Compras restringidas** a socios y amigos
- **Entrega en mano** en instalaciones del club
- **Envío a casa** a través de tiendas online externas

---

**Desarrollado para CDSANABRIACF** 🏆
*Sistema completo de gestión web con tienda online integrada* 