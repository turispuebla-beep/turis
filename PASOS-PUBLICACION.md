# 📱 PASOS PARA PUBLICAR CDSANABRIACF EN GOOGLE PLAY STORE

## 🎯 **PASO 1: Crear Cuenta de Desarrollador**

### 1.1 Ir a Google Play Console
- **Enlace directo**: https://play.google.com/console
- **Costo**: $25 USD (pago único, válido para siempre)

### 1.2 Crear Cuenta
1. Hacer clic en "Comenzar"
2. Seleccionar "Cuenta personal" o "Cuenta de organización"
3. Completar información:
   - **Nombre**: Club Deportivo Sanabriacf
   - **Email**: cdsanabriafc@gmail.com
   - **País**: España
   - **Dirección**: Puebla de Sanabria, Zamora

### 1.3 Verificar Cuenta
- Google enviará un email de verificación
- Confirmar la dirección de email
- Completar el pago de $25 USD

---

## 🏗️ **PASO 2: Crear Nueva Aplicación**

### 2.1 Acceder al Dashboard
- Una vez creada la cuenta, ir al dashboard
- Hacer clic en "Crear aplicación"

### 2.2 Configuración Inicial
- **Idioma predeterminado**: Español (España)
- **Título de la app**: CDSANABRIACF
- **Tipo de app**: Aplicación
- **Gratuita o de pago**: Gratuita
- **Declaración de cumplimiento**: Marcar "Sí"

---

## 📋 **PASO 3: Configurar Información de la App**

### 3.1 Información Básica
- **Título**: CDSANABRIACF - Club Deportivo
- **Descripción corta**: Gestión completa del Club Deportivo Sanabriacf
- **Descripción completa**: (Copiar del archivo GOOGLE-PLAY-CONFIG.md)

### 3.2 Categorización
- **Categoría principal**: Deportes
- **Categoría secundaria**: Estilo de vida
- **Etiquetas**: club deportivo, fútbol, gestión, socios

---

## 📤 **PASO 4: Subir APK**

### 4.1 Preparar APK
- **Archivo a subir**: `CDSANABRIACF-GOOGLE-PLAY-READY.apk`
- **Ubicación**: En el directorio raíz del proyecto

### 4.2 Subir a Google Play Console
1. Ir a "Producción" → "Pistas de lanzamiento"
2. Hacer clic en "Crear nueva pista de lanzamiento"
3. Nombrar: "Producción"
4. Subir archivo APK
5. Completar información de la versión:
   - **Notas de la versión**: "Lanzamiento inicial de CDSANABRIACF"

---

## 🖼️ **PASO 5: Configurar Contenido Visual**

### 5.1 Icono de la App
- **Archivo**: `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
- **Tamaño**: 512x512 px
- **Formato**: PNG

### 5.2 Capturas de Pantalla
- **Cantidad**: Mínimo 2, máximo 8
- **Tamaño**: 1080x1920 px (portrait)
- **Contenido sugerido**:
  1. Página principal con menú
  2. Panel de administración
  3. Registro de socios
  4. Calendario de partidos

### 5.3 Imagen Promocional
- **Tamaño**: 1024x500 px
- **Contenido**: Banner promocional del club

---

## ⚙️ **PASO 6: Configurar Clasificación y Privacidad**

### 6.1 Clasificación de Contenido
- Completar cuestionario de clasificación
- **Edad mínima**: 3+ años
- **Contenido**: Sin contenido inapropiado

### 6.2 Política de Privacidad
- **URL**: Crear página web simple o usar servicio gratuito
- **Contenido**: Explicar que no se recopilan datos personales

---

## 🌍 **PASO 7: Configurar Distribución**

### 7.1 Países
- **País principal**: España
- **Otros países**: Seleccionar según necesidad

### 7.2 Dispositivos
- **Teléfonos**: ✅ Habilitado
- **Tablets**: ✅ Habilitado
- **TV**: ❌ Deshabilitado
- **Wear OS**: ❌ Deshabilitado

### 7.3 Precios
- **Precio**: Gratuita
- **Moneda**: EUR (Euro)

---

## ✅ **PASO 8: Revisar y Publicar**

### 8.1 Revisión Final
- Verificar toda la información
- Comprobar que la APK se subió correctamente
- Revisar imágenes y descripciones

### 8.2 Enviar para Revisión
- Hacer clic en "Revisar versión"
- Confirmar envío
- **Tiempo de espera**: 1-3 días

---

## 🔄 **ACTUALIZACIONES FUTURAS**

### Proceso de Actualización
1. **Actualizar archivos web** en `app/src/main/assets/`
2. **Incrementar versiones** en `build.gradle.kts`:
   ```kotlin
   versionCode = 2  // +1 cada actualización
   versionName = "1.0.1"  // Formato semántico
   ```
3. **Compilar nueva APK**:
   ```bash
   ./gradlew assembleRelease
   ```
4. **Subir a Google Play Console**
5. **Los usuarios recibirán actualización automática**

---

## 📞 **CONTACTO Y SOPORTE**

### Información del Club
- **Nombre**: Club Deportivo Sanabriacf
- **Email**: cdsanabriafc@gmail.com
- **Web**: www.cdsanabriacf.com
- **Ubicación**: Puebla de Sanabria, Zamora, España

### Soporte Técnico
- **Desarrollador**: Club Deportivo Sanabriacf
- **Email de soporte**: cdsanabriafc@gmail.com

---

## 🎉 **¡LISTO PARA PUBLICAR!**

Una vez completados estos pasos, la app CDSANABRIACF estará disponible en Google Play Store para que todos los miembros del club puedan descargarla y mantenerse conectados.

**¡La app incluye todas las funcionalidades actualizadas y se sincronizará automáticamente con la página web!** 🚀
