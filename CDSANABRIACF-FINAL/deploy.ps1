# PowerShell Script para Despliegue Automático CDSANABRIACF v2.0.0

Write-Host "🚀 === DESPLIEGUE AUTOMÁTICO CDSANABRIACF v2.0.0 ===" -ForegroundColor Cyan

# Función para mostrar mensajes
function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "index.html")) {
    Write-Error "No se encuentra index.html. Asegúrate de estar en CDSANABRIACF-FINAL/"
    exit 1
}

Write-Success "Directorio correcto detectado"

# Verificar archivos necesarios
$requiredFiles = @("index.html", "admin-panel.html", "database.js", "package.json", "netlify.toml", "railway.json")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success "✅ $file encontrado"
    } else {
        Write-Error "❌ $file no encontrado"
        exit 1
    }
}

# Verificar Git
try {
    git --version | Out-Null
    Write-Success "Git está instalado"
} catch {
    Write-Error "Git no está instalado"
    exit 1
}

# Verificar estado de Git
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning "Hay cambios sin commitear"
    git add .
    git commit -m "Auto-deploy: $(Get-Date)"
    Write-Success "Cambios commiteados"
}

# Push a GitHub
Write-Info "Subiendo cambios a GitHub..."
try {
    git push origin master
    Write-Success "Cambios subidos a GitHub"
} catch {
    Write-Error "Error al subir a GitHub"
    exit 1
}

# Información de despliegue
Write-Host ""
Write-Info "=== INFORMACIÓN DE DESPLIEGUE ==="
Write-Host ""
Write-Info "📱 FRONTEND (Netlify):"
Write-Host "   - URL: https://cdsanabriacf.netlify.app"
Write-Host "   - Directorio: CDSANABRIACF-FINAL"
Write-Host "   - Configuración: netlify.toml"
Write-Host ""
Write-Info "🚂 BACKEND (Railway):"
Write-Host "   - URL: https://turis-production.up.railway.app"
Write-Host "   - Archivo principal: server.js"
Write-Host "   - Configuración: railway.json"
Write-Host ""
Write-Info "🔑 CREDENCIALES ADMIN:"
Write-Host "   - Email: amco@gmx.es"
Write-Host "   - Password: 533712"
Write-Host ""

# Verificar despliegue
Write-Info "Verificando despliegue..."

# Verificar Netlify
try {
    $netlifyResponse = Invoke-WebRequest -Uri "https://cdsanabriacf.netlify.app" -Method Head -TimeoutSec 10
    if ($netlifyResponse.StatusCode -eq 200) {
        Write-Success "✅ Netlify está funcionando"
    } else {
        Write-Warning "⚠️  Netlify puede estar en proceso de despliegue"
    }
} catch {
    Write-Warning "⚠️  Netlify puede estar en proceso de despliegue"
}

# Verificar Railway
try {
    $railwayResponse = Invoke-WebRequest -Uri "https://turis-production.up.railway.app/health" -Method Head -TimeoutSec 10
    if ($railwayResponse.StatusCode -eq 200) {
        Write-Success "✅ Railway está funcionando"
    } else {
        Write-Warning "⚠️  Railway puede estar en proceso de despliegue"
    }
} catch {
    Write-Warning "⚠️  Railway puede estar en proceso de despliegue"
}

Write-Host ""
Write-Success "🎉 DESPLIEGUE COMPLETADO"
Write-Host ""
Write-Info "📋 PRÓXIMOS PASOS:"
Write-Host "   1. Esperar 2-3 minutos para que se complete el despliegue"
Write-Host "   2. Verificar que las URLs funcionan correctamente"
Write-Host "   3. Probar el login de administrador"
Write-Host "   4. Verificar la sincronización de datos"
Write-Host ""
Write-Info "🔗 ENLACES IMPORTANTES:"
Write-Host "   - Aplicación: https://cdsanabriacf.netlify.app"
Write-Host "   - Panel Admin: https://cdsanabriacf.netlify.app/admin-panel.html"
Write-Host "   - API Backend: https://turis-production.up.railway.app/api"
Write-Host ""
Write-Success "⚽ ¡CDSANABRIACF está listo para usar! ⚽"
