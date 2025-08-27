# 🏆 Configurar Icono Distintivo CDSANABRIACF en Android Studio

## 📋 Pasos para crear el icono con el logo del Sanabria

### 1. Abrir el proyecto en Android Studio
- ✅ Proyecto ya abierto: `CDSANABRIACF`

### 2. Navegar a los iconos
1. En el panel izquierdo, expande `app`
2. Expande `res`
3. Expande `mipmap-hdpi`
4. Click derecho en `ic_launcher.png`

### 3. Crear nuevo icono
1. Selecciona "New" → "Image Asset"
2. En la ventana "Configure Image Asset":

**Configuración:**
- **Asset Type**: `Launcher Icons`
- **Name**: `ic_launcher`
- **Foreground Layer**:
  - **Asset Type**: `Image`
  - **Path**: Busca `logo-cdsanabriacf.jpeg` en tu proyecto
  - **Trim**: ❌ Desmarcar
  - **Resize**: `70%`
- **Background Layer**:
  - **Background Color**: `#1e3a8a` (azul del club)
- **Legacy**: ✅ Marcar "Generate legacy launcher icon"

### 4. Generar icono
1. Click en "Next"
2. Revisar preview del icono
3. Click en "Finish"

### 5. Generar APK
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Esperar a que termine la compilación
3. El APK se generará en: `app/build/outputs/apk/debug/`

## 🎯 Resultado
- ✅ Icono distintivo con el logo del Sanabria
- ✅ Fondo azul del club
- ✅ APK listo para instalar
- ✅ Identidad visual única del club

## 📱 Instalación
1. Copiar el APK generado al escritorio
2. Instalar en el móvil/tablet
3. El icono mostrará el logo del Sanabria

¡El APK tendrá el icono distintivo del Club Deportivo Sanabriacf! 🚀⚽
