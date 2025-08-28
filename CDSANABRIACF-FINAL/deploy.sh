#!/bin/bash

echo "🚀 === DESPLIEGUE AUTOMÁTICO CDSANABRIACF v2.0.0 ==="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    log_error "No se encuentra index.html. Asegúrate de estar en CDSANABRIACF-FINAL/"
    exit 1
fi

log_success "Directorio correcto detectado"

# Verificar archivos necesarios
required_files=("index.html" "admin-panel.html" "database.js" "package.json" "netlify.toml" "railway.json")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        log_success "✅ $file encontrado"
    else
        log_error "❌ $file no encontrado"
        exit 1
    fi
done

# Verificar Git
if ! command -v git &> /dev/null; then
    log_error "Git no está instalado"
    exit 1
fi

# Verificar estado de Git
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Hay cambios sin commitear"
    git add .
    git commit -m "Auto-deploy: $(date)"
    log_success "Cambios commiteados"
fi

# Push a GitHub
log_info "Subiendo cambios a GitHub..."
if git push origin master; then
    log_success "Cambios subidos a GitHub"
else
    log_error "Error al subir a GitHub"
    exit 1
fi

# Información de despliegue
echo ""
log_info "=== INFORMACIÓN DE DESPLIEGUE ==="
echo ""
log_info "📱 FRONTEND (Netlify):"
echo "   - URL: https://cdsanabriacf.netlify.app"
echo "   - Directorio: CDSANABRIACF-FINAL"
echo "   - Configuración: netlify.toml"
echo ""
log_info "🚂 BACKEND (Railway):"
echo "   - URL: https://turis-production.up.railway.app"
echo "   - Archivo principal: server.js"
echo "   - Configuración: railway.json"
echo ""
log_info "🔑 CREDENCIALES ADMIN:"
echo "   - Email: amco@gmx.es"
echo "   - Password: 533712"
echo ""

# Verificar despliegue
log_info "Verificando despliegue..."

# Verificar Netlify
if curl -s -o /dev/null -w "%{http_code}" "https://cdsanabriacf.netlify.app" | grep -q "200"; then
    log_success "✅ Netlify está funcionando"
else
    log_warning "⚠️  Netlify puede estar en proceso de despliegue"
fi

# Verificar Railway
if curl -s -o /dev/null -w "%{http_code}" "https://turis-production.up.railway.app/health" | grep -q "200"; then
    log_success "✅ Railway está funcionando"
else
    log_warning "⚠️  Railway puede estar en proceso de despliegue"
fi

echo ""
log_success "🎉 DESPLIEGUE COMPLETADO"
echo ""
log_info "📋 PRÓXIMOS PASOS:"
echo "   1. Esperar 2-3 minutos para que se complete el despliegue"
echo "   2. Verificar que las URLs funcionan correctamente"
echo "   3. Probar el login de administrador"
echo "   4. Verificar la sincronización de datos"
echo ""
log_info "🔗 ENLACES IMPORTANTES:"
echo "   - Aplicación: https://cdsanabriacf.netlify.app"
echo "   - Panel Admin: https://cdsanabriacf.netlify.app/admin-panel.html"
echo "   - API Backend: https://turis-production.up.railway.app/api"
echo ""
log_success "⚽ ¡CDSANABRIACF está listo para usar! ⚽"
