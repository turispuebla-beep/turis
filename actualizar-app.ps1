# 🚀 Script de Actualización Automática para CDSANABRIACF
# Este script automatiza el proceso de actualización de la APK

param(
    [string]$VersionCode = "",
    [string]$VersionName = ""
)

Write-Host "🏆 CDSANABRIACF - Actualización Automática" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# 1. Verificar si se proporcionaron versiones
if ([string]::IsNullOrEmpty($VersionCode) -or [string]::IsNullOrEmpty($VersionName)) {
    Write-Host "❌ Error: Debes proporcionar versionCode y versionName" -ForegroundColor Red
    Write-Host "Uso: .\actualizar-app.ps1 -VersionCode 2 -VersionName '1.0.1'" -ForegroundColor Yellow
    exit 1
}

Write-Host "📱 Actualizando APK CDSANABRIACF..." -ForegroundColor Cyan
Write-Host "Versión Code: $VersionCode" -ForegroundColor White
Write-Host "Versión Name: $VersionName" -ForegroundColor White

# 2. Sincronizar archivos web
Write-Host "🔄 Sincronizando archivos web..." -ForegroundColor Yellow
try {
    Copy-Item "CDSANABRIACF-FINAL\index.html" "app\src\main\assets\index.html" -Force
    Copy-Item "CDSANABRIACF-FINAL\admin-panel.html" "app\src\main\assets\admin-panel.html" -Force
    Copy-Item "CDSANABRIACF-FINAL\members-access.html" "app\src\main\assets\members-access.html" -Force
    Copy-Item "CDSANABRIACF-FINAL\friends-access.html" "app\src\main\assets\friends-access.html" -Force
    Write-Host "✅ Archivos web sincronizados" -ForegroundColor Green
} catch {
    Write-Host "❌ Error sincronizando archivos web: $_" -ForegroundColor Red
    exit 1
}

# 3. Actualizar versiones en build.gradle.kts
Write-Host "📝 Actualizando versiones en build.gradle.kts..." -ForegroundColor Yellow
try {
    $buildGradlePath = "app\build.gradle.kts"
    $content = Get-Content $buildGradlePath -Raw
    
    # Actualizar versionCode
    $content = $content -replace 'versionCode = \d+', "versionCode = $VersionCode"
    
    # Actualizar versionName
    $content = $content -replace 'versionName = "[^"]*"', "versionName = `"$VersionName`""
    
    Set-Content $buildGradlePath $content -Encoding UTF8
    Write-Host "✅ Versiones actualizadas en build.gradle.kts" -ForegroundColor Green
} catch {
    Write-Host "❌ Error actualizando versiones: $_" -ForegroundColor Red
    exit 1
}

# 4. Limpiar proyecto
Write-Host "🧹 Limpiando proyecto..." -ForegroundColor Yellow
try {
    .\gradlew clean
    Write-Host "✅ Proyecto limpiado" -ForegroundColor Green
} catch {
    Write-Host "❌ Error limpiando proyecto: $_" -ForegroundColor Red
    exit 1
}

# 5. Compilar APK de release
Write-Host "🔨 Compilando APK de release..." -ForegroundColor Yellow
try {
    .\gradlew assembleRelease
    Write-Host "✅ APK compilada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error compilando APK: $_" -ForegroundColor Red
    exit 1
}

# 6. Crear copia con nombre descriptivo
Write-Host "📦 Creando APK final..." -ForegroundColor Yellow
try {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $newApkName = "CDSANABRIACF-v$VersionName-$timestamp.apk"
    Copy-Item "app\build\outputs\apk\release\app-release.apk" $newApkName
    Write-Host "✅ APK creada: $newApkName" -ForegroundColor Green
} catch {
    Write-Host "❌ Error creando APK final: $_" -ForegroundColor Red
    exit 1
}

# 7. Mostrar resumen
Write-Host ""
Write-Host "🎉 ¡Actualización completada exitosamente!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "📱 APK generada: $newApkName" -ForegroundColor Cyan
Write-Host "📊 Tamaño: $((Get-Item $newApkName).Length / 1MB) MB" -ForegroundColor White
Write-Host "🔄 Versión: $VersionName (Code: $VersionCode)" -ForegroundColor White
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Subir $newApkName a Google Play Console" -ForegroundColor White
Write-Host "2. Completar información de la versión" -ForegroundColor White
Write-Host "3. Enviar para revisión" -ForegroundColor White
Write-Host "4. Los usuarios recibirán actualización automática" -ForegroundColor White
Write-Host ""
Write-Host "🚀 ¡La app está lista para ser publicada!" -ForegroundColor Green
