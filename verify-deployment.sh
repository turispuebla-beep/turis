#!/bin/bash

echo "🔍 Verificando despliegue en Railway..."

# Obtener URL del proyecto (reemplazar con la URL real)
RAILWAY_URL="https://tu-proyecto.railway.app"

echo "📡 Probando health check..."
curl -s "${RAILWAY_URL}/api/health" | jq .

echo "📊 Probando obtener socios..."
curl -s "${RAILWAY_URL}/api/members" | jq .

echo "🏆 Probando obtener equipos..."
curl -s "${RAILWAY_URL}/api/equipos" | jq .

echo "🔐 Probando login administrador..."
curl -s -X POST "${RAILWAY_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"amco@gmx.es","password":"533712"}' | jq .

echo "✅ Verificación completada"
