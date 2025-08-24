# 🏪 Tienda CDSANABRIACF - Documentación Completa

## 📋 Descripción

Sistema completo de tienda online para el Club Deportivo CDSANABRIACF. Permite gestionar productos, stock, tallas y configurar la tienda oficial del club.

## 🎯 Funcionalidades Implementadas

### ✅ **Tienda Pública (tienda.html)**
- **Catálogo de productos** con imágenes y descripciones
- **Sistema de filtros** por categorías (camisetas, equipaciones, accesorios, entrenamiento)
- **Gestión de stock** por tallas (S, M, L, XL, Única)
- **Información de entrega** en mano con horarios
- **Enlace a tienda oficial** online
- **Contacto por WhatsApp** para compras
- **Diseño responsive** y atractivo

### ✅ **Panel de Administración (admin-tienda.html)**
- **Gestión completa de productos** (agregar, editar, eliminar)
- **Control de stock** por tallas individuales
- **Estadísticas en tiempo real** (productos totales, stock bajo, valor total)
- **Configuración de la tienda** (contacto, horarios, URL oficial)
- **Subida de imágenes** de productos
- **Sistema de alertas** y notificaciones

## 📁 Archivos del Sistema

```
CDSANABRIACF/
├── tienda.html              # Tienda pública
├── admin-tienda.html        # Panel de administración
├── boton-tienda.html        # Botones para agregar a index.html
├── enlace-admin-tienda.html # Enlaces para admin-panel.html
└── README-TIENDA.md         # Esta documentación
```

## 🛍️ Productos Incluidos

### **Camisetas**
- Camiseta Oficial CDSANABRIACF (€45.00)
- Camiseta de Entrenamiento (€28.00)

### **Equipaciones**
- Equipación Completa (€85.00)
- Chaqueta Deportiva (€65.00)

### **Accesorios**
- Gorra CDSANABRIACF (€18.00)
- Bufanda Oficial (€22.00)
- Mochila Deportiva (€42.00)

### **Entrenamiento**
- Pantalón de Entrenamiento (€35.00)

## 🎨 Características de Diseño

### **Colores CDSANABRIACF**
- **Primario:** Rojo (#dc2626)
- **Secundario:** Azul (#3b82f6)
- **Acentos:** Naranja (#f59e0b), Verde (#059669)

### **Elementos Visuales**
- ✅ Gradientes atractivos
- ✅ Iconos emoji para productos
- ✅ Cards con sombras
- ✅ Botones con efectos hover
- ✅ Diseño responsive

## 📱 Funcionalidades por Usuario

### **👥 Clientes**
- ✅ Ver catálogo completo
- ✅ Filtrar por categorías
- ✅ Ver stock disponible
- ✅ Contactar por WhatsApp
- ✅ Acceder a tienda oficial

### **👨‍💼 Administradores**
- ✅ Gestionar productos
- ✅ Controlar stock por tallas
- ✅ Ver estadísticas
- ✅ Configurar tienda
- ✅ Subir imágenes

## 🚀 Instalación y Uso

### **1. Acceso a la Tienda**
```bash
# Abrir en navegador
tienda.html
```

### **2. Acceso al Panel de Administración**
```bash
# Abrir en navegador
admin-tienda.html
```

### **3. Agregar Botón a la Página Principal**
Copiar el código de `boton-tienda.html` y pegarlo en `index.html` donde se desee.

### **4. Agregar Enlace al Panel de Administración**
Copiar el código de `enlace-admin-tienda.html` y pegarlo en `admin-panel.html`.

## 📊 Gestión de Stock

### **Sistema de Tallas**
- **S, M, L, XL:** Para ropa deportiva
- **Única:** Para accesorios (gorras, bufandas, mochilas)

### **Estados de Stock**
- **🟢 Stock Alto:** Más de 20 unidades
- **🟡 Stock Medio:** Entre 10-20 unidades
- **🔴 Stock Bajo:** Menos de 10 unidades
- **❌ Sin Stock:** 0 unidades

### **Gestión Automática**
- Alertas de stock bajo
- Cálculo automático de valor total
- Estadísticas en tiempo real

## 💰 Sistema de Compras

### **Proceso de Compra**
1. Cliente selecciona producto
2. Hace clic en "Comprar Ahora"
3. Se abre WhatsApp con mensaje predefinido
4. Administrador gestiona la venta
5. Entrega en mano en el club

### **Información de Entrega**
- **Método:** Entrega en mano
- **Ubicación:** Instalaciones del club
- **Horario:** Lunes a Viernes 18:00-20:00h
- **Contacto:** WhatsApp +34 123 456 789

## ⚙️ Configuración de la Tienda

### **Datos Configurables**
- Nombre de la tienda
- Email de contacto
- Teléfono de contacto
- Dirección de recogida
- Horario de recogida
- URL de tienda oficial

### **Configuración por Defecto**
```
Nombre: Tienda CDSANABRIACF
Email: tienda@cdsanabriacf.com
Teléfono: +34 123 456 789
Dirección: Instalaciones del Club
Horario: Lunes a Viernes de 18:00h a 20:00h
URL Oficial: https://tienda-cdsanabriacf.com
```

## 🔧 Funciones Técnicas

### **JavaScript Implementado**
- ✅ Gestión de productos en memoria
- ✅ Filtrado dinámico por categorías
- ✅ Cálculo automático de estadísticas
- ✅ Validación de formularios
- ✅ Sistema de alertas
- ✅ Integración con WhatsApp

### **Almacenamiento**
- ✅ localStorage para persistencia
- ✅ Sincronización entre páginas
- ✅ Exportación/importación de datos

## 📱 Responsive Design

### **Dispositivos Soportados**
- ✅ Desktop (1200px+)
- ✅ Tablet (768px-1199px)
- ✅ Mobile (320px-767px)

### **Adaptaciones**
- Grid responsive para productos
- Navegación adaptativa
- Botones optimizados para touch
- Texto legible en todas las pantallas

## 🔗 Integración con Sistema Principal

### **Enlaces Disponibles**
- ✅ Tienda → Página principal
- ✅ Tienda → Panel de administración
- ✅ Admin tienda → Panel principal
- ✅ Admin tienda → Tienda pública

### **Navegación Consistente**
- Mismos colores CDSANABRIACF
- Estilo visual coherente
- Enlaces bidireccionales

## 📈 Estadísticas Disponibles

### **Panel de Administración**
- **Productos Totales:** Número de productos en catálogo
- **Stock Bajo:** Productos con menos de 10 unidades
- **Valor Total:** Valor monetario del inventario
- **Categorías:** Número de categorías activas

### **Actualización en Tiempo Real**
- Cálculos automáticos
- Actualización al agregar/eliminar productos
- Persistencia de datos

## 🛠️ Mantenimiento

### **Agregar Nuevos Productos**
1. Acceder a `admin-tienda.html`
2. Completar formulario de nuevo producto
3. Especificar stock por tallas
4. Guardar producto

### **Actualizar Stock**
1. En panel de administración
2. Editar producto específico
3. Modificar cantidades por talla
4. Guardar cambios

### **Configurar Tienda**
1. En sección "Configuración de la Tienda"
2. Modificar datos de contacto
3. Actualizar horarios
4. Guardar configuración

## 🔒 Seguridad

### **Medidas Implementadas**
- ✅ Validación de formularios
- ✅ Sanitización de datos
- ✅ Confirmaciones para eliminación
- ✅ Alertas de errores

### **Acceso Administrativo**
- Panel protegido por autenticación
- Funciones de edición restringidas
- Logs de cambios (futuro)

## 🚀 Próximas Funcionalidades

### **Funcionalidades Planificadas**
- 📸 Subida real de imágenes
- 🛒 Carrito de compras
- 💳 Pago online
- 📊 Reportes de ventas
- 📧 Notificaciones por email
- 🔍 Búsqueda avanzada

### **Mejoras Técnicas**
- Base de datos real
- API REST
- Autenticación robusta
- Backup automático
- Analytics de ventas

## 📞 Soporte

### **Contacto Técnico**
- **Email:** club@cdsanabriacf.com
- **Desarrollador:** Sistema CDSANABRIACF
- **Versión:** 1.0.0

### **Documentación**
- `README-TIENDA.md` - Documentación principal
- Código comentado para mantenimiento
- Instrucciones de instalación

---

**🏪 Tienda CDSANABRIACF - Sistema Completo**

*Gestión profesional de productos y ventas para el club deportivo*
