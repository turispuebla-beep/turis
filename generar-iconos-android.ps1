# Script para generar iconos de Android con el logo de CDSANABRIACF
# Autor: Asistente IA
# Fecha: Diciembre 2024

Write-Host "🏆 Generando iconos de Android para CDSANABRIACF..." -ForegroundColor Green

# Verificar que existe el logo
$LogoFile = "logo-cdsanabriacf.jpeg"
if (-not (Test-Path $LogoFile)) {
    Write-Host "❌ No se encontró el logo: $LogoFile" -ForegroundColor Red
    Write-Host "Por favor, asegúrate de que el archivo logo-cdsanabriacf.jpeg esté en el directorio actual" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Logo encontrado: $LogoFile" -ForegroundColor Green

# Crear directorio temporal para procesar
$TempDir = "temp_icons"
if (Test-Path $TempDir) {
    Remove-Item $TempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $TempDir | Out-Null

Write-Host "📁 Directorio temporal creado: $TempDir" -ForegroundColor Cyan

# Copiar el logo al directorio temporal
Copy-Item $LogoFile "$TempDir\logo_original.jpeg"

Write-Host "🔄 Procesando logo para Android..." -ForegroundColor Yellow

# Crear un script HTML para redimensionar el logo
$HtmlScript = @"
<!DOCTYPE html>
<html>
<head>
    <title>Generador de Iconos Android</title>
</head>
<body>
    <canvas id="canvas" style="display:none;"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        const sizes = [
            { name: 'mdpi', size: 48 },
            { name: 'hdpi', size: 72 },
            { name: 'xhdpi', size: 96 },
            { name: 'xxhdpi', size: 144 },
            { name: 'xxxhdpi', size: 192 }
        ];
        
        const img = new Image();
        img.onload = function() {
            sizes.forEach(s => {
                canvas.width = s.size;
                canvas.height = s.size;
                
                // Limpiar canvas
                ctx.clearRect(0, 0, s.size, s.size);
                
                // Crear fondo circular
                ctx.beginPath();
                ctx.arc(s.size/2, s.size/2, s.size/2, 0, 2 * Math.PI);
                ctx.fillStyle = '#1e3a8a';
                ctx.fill();
                
                // Dibujar imagen centrada
                const scale = Math.min(s.size / img.width, s.size / img.height) * 0.8;
                const newWidth = img.width * scale;
                const newHeight = img.height * scale;
                const x = (s.size - newWidth) / 2;
                const y = (s.size - newHeight) / 2;
                
                ctx.drawImage(img, x, y, newWidth, newHeight);
                
                // Convertir a blob y descargar
                canvas.toBlob(function(blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ic_launcher_' + s.name + '.png';
                    a.click();
                    URL.revokeObjectURL(url);
                }, 'image/png');
            });
        };
        img.src = 'logo_original.jpeg';
    </script>
</body>
</html>
"@

# Guardar el script HTML
$HtmlScript | Out-File "$TempDir\generar_iconos.html" -Encoding UTF8

Write-Host "🌐 Abriendo generador de iconos..." -ForegroundColor Cyan
Start-Process "$TempDir\generar_iconos.html"

Write-Host ""
Write-Host "📋 Instrucciones:" -ForegroundColor Yellow
Write-Host "1. Se abrirá una página web que generará los iconos automáticamente" -ForegroundColor White
Write-Host "2. Los archivos se descargarán automáticamente" -ForegroundColor White
Write-Host "3. Copia los archivos descargados a las carpetas correspondientes:" -ForegroundColor White
Write-Host "   - ic_launcher_mdpi.png → app\src\main\res\mipmap-mdpi\" -ForegroundColor Cyan
Write-Host "   - ic_launcher_hdpi.png → app\src\main\res\mipmap-hdpi\" -ForegroundColor Cyan
Write-Host "   - ic_launcher_xhdpi.png → app\src\main\res\mipmap-xhdpi\" -ForegroundColor Cyan
Write-Host "   - ic_launcher_xxhdpi.png → app\src\main\res\mipmap-xxhdpi\" -ForegroundColor Cyan
Write-Host "   - ic_launcher_xxxhdpi.png → app\src\main\res\mipmap-xxxhdpi\" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Después ejecuta: .\gradlew assembleRelease" -ForegroundColor Green
Write-Host "5. El nuevo APK tendrá el logo del club como icono" -ForegroundColor Green

Write-Host ""
Write-Host "🏆 ¡Proceso iniciado!" -ForegroundColor Green
