#!/bin/bash

# Actualizar el sistema
sudo apt update
sudo apt upgrade -y

# Instalar dependencias necesarias
sudo apt install -y curl git nginx certbot python3-certbot-nginx build-essential

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear directorios necesarios
sudo mkdir -p /var/www/futbol-web
sudo chown -R $USER:$USER /var/www/futbol-web

# Clonar el repositorio
git clone https://github.com/tu-usuario/futbol-web.git /var/www/futbol-web

# Configurar el backend
cd /var/www/futbol-web/backend
npm ci
npm run build

# Configurar el frontend
cd /var/www/futbol-web/frontend
npm ci
npm run build

# Crear directorio para uploads
sudo mkdir -p /var/www/futbol-web/backend/uploads
sudo chown -R www-data:www-data /var/www/futbol-web/backend/uploads
sudo chmod 755 /var/www/futbol-web/backend/uploads

# Copiar configuración de Nginx
sudo cp /var/www/futbol-web/nginx.conf /etc/nginx/sites-available/futbol-web
sudo ln -s /etc/nginx/sites-available/futbol-web /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Configurar certificado SSL (reemplazar con el dominio real)
# sudo certbot --nginx -d futbol-web.example.com

# Iniciar la aplicación con PM2
cd /var/www/futbol-web
pm2 start ecosystem.config.js
pm2 save

# Configurar PM2 para iniciar con el sistema
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Reiniciar Nginx
sudo systemctl restart nginx

# Mostrar estado
echo "Configuración completada. Estado de los servicios:"
systemctl status nginx
pm2 status

echo "
Pasos adicionales necesarios:
1. Configurar las variables de entorno en /var/www/futbol-web/backend/.env
2. Actualizar el dominio en la configuración de Nginx
3. Ejecutar certbot para configurar SSL con el dominio real
4. Configurar el firewall (si es necesario)
"