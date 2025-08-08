# 📱 Instalación de CDSANABRIACF Mobile App

## 🚀 Guía de Instalación Completa

### 📋 Requisitos Previos

#### Para Windows:
- **Node.js** (versión 16 o superior)
- **Java Development Kit (JDK)** 11 o superior
- **Android Studio** con Android SDK
- **React Native CLI**

#### Para macOS:
- **Node.js** (versión 16 o superior)
- **Xcode** (para desarrollo iOS)
- **Android Studio** (para desarrollo Android)
- **React Native CLI**

### 🔧 Instalación de Herramientas

#### 1. Instalar Node.js
```bash
# Descargar desde: https://nodejs.org/
# Verificar instalación
node --version
npm --version
```

#### 2. Instalar React Native CLI
```bash
npm install -g react-native-cli
```

#### 3. Instalar Android Studio (Windows/macOS)
```bash
# Descargar desde: https://developer.android.com/studio
# Instalar Android SDK
# Configurar variables de entorno ANDROID_HOME
```

#### 4. Instalar Xcode (solo macOS)
```bash
# Descargar desde App Store
# Instalar Command Line Tools
xcode-select --install
```

### 📱 Configuración del Proyecto

#### 1. Clonar el Proyecto
```bash
cd mobile-app
```

#### 2. Instalar Dependencias
```bash
npm install
```

#### 3. Configurar Metro Bundler
```bash
# Crear archivo metro.config.js si no existe
npx react-native start --reset-cache
```

### 🏃‍♂️ Ejecutar la Aplicación

#### Para Android:
```bash
# Asegurarse de tener un emulador Android ejecutándose
# O un dispositivo Android conectado con USB Debugging activado

npx react-native run-android
```

#### Para iOS (solo macOS):
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### 🔧 Configuración Adicional

#### Configurar Variables de Entorno (Windows)
```bash
# Agregar al PATH del sistema:
# C:\Users\[Usuario]\AppData\Local\Android\Sdk\platform-tools
# C:\Users\[Usuario]\AppData\Local\Android\Sdk\tools

# Variables de entorno:
ANDROID_HOME=C:\Users\[Usuario]\AppData\Local\Android\Sdk
```

#### Configurar Variables de Entorno (macOS/Linux)
```bash
# Agregar al ~/.bash_profile o ~/.zshrc:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 📱 Generar APK de Release

#### 1. Configurar Keystore
```bash
# Generar keystore (solo una vez)
keytool -genkeypair -v -storetype PKCS12 -keystore cdsanabriacf-release-key.keystore -alias cdsanabriacf-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Configurar gradle.properties
```bash
# Agregar en android/gradle.properties:
MYAPP_RELEASE_STORE_FILE=cdsanabriacf-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=cdsanabriacf-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

#### 3. Generar APK
```bash
cd android
./gradlew assembleRelease
```

### 🐛 Solución de Problemas Comunes

#### Error: "Metro bundler not found"
```bash
npm install
npx react-native start --reset-cache
```

#### Error: "Android SDK not found"
```bash
# Verificar ANDROID_HOME en variables de entorno
# Asegurarse de que Android Studio esté instalado correctamente
```

#### Error: "Build failed"
```bash
# Limpiar cache
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### Error: "Pod install failed" (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### 📊 Verificación de Instalación

#### Comandos de Verificación
```bash
# Verificar React Native
npx react-native --version

# Verificar Android
adb devices

# Verificar iOS (solo macOS)
xcrun simctl list devices
```

### 🔄 Actualizaciones

#### Actualizar Dependencias
```bash
npm update
npx react-native upgrade
```

#### Limpiar Cache
```bash
# Limpiar cache de Metro
npx react-native start --reset-cache

# Limpiar cache de npm
npm cache clean --force

# Limpiar build de Android
cd android && ./gradlew clean && cd ..
```

### 📱 Características de la App

#### ✅ Funcionalidades Implementadas
- **Pantalla de Inicio** con reloj en tiempo real
- **Sistema de Autenticación** (registro/login)
- **Navegación por Tabs** para usuarios autenticados
- **Pantalla de Equipos** con información de jugadores
- **Calendario de Eventos** del club
- **Sistema de Notificaciones** con filtros
- **Perfil de Usuario** con gestión de cuenta

#### 🎨 Diseño
- **Colores CDSANABRIACF**: Rojo (#dc2626) y Azul (#3b82f6)
- **Gradientes atractivos** en headers
- **Iconos Material Design**
- **Interfaz responsive** para diferentes tamaños

### 📞 Soporte

#### Contacto para Problemas
- **Email**: club@cdsanabriacf.com
- **Versión**: 1.1.0
- **Plataformas**: Android (API 21+) e iOS (11+)

#### Logs de Debug
```bash
# Ver logs de Android
adb logcat

# Ver logs de iOS
xcrun simctl spawn booted log stream --predicate 'process == "CDSANABRIACF"'
```

---

**⚽ CDSANABRIACF Mobile App - Instalación Completa**

*Sistema móvil completo para gestión del club deportivo*
