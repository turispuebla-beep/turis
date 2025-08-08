# Guía de Desarrollo

## Entorno de Desarrollo

### Requisitos

- Node.js 18.x o superior
- MongoDB 4.4 o superior
- Git
- IDE con soporte TypeScript (recomendado: VS Code)

### Extensiones Recomendadas VS Code

- ESLint
- Prettier
- TypeScript + JavaScript
- MongoDB for VS Code
- Thunder Client (para pruebas API)

## Configuración Inicial

1. Clonar repositorio:
   ```bash
   git clone https://github.com/tu-usuario/futbol-web.git
   cd futbol-web
   ```

2. Instalar dependencias:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   # Backend
   cd ../backend
   cp .env.example .env
   ```

4. Iniciar servicios:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

## Estructura del Proyecto

### Backend

```
backend/
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── middleware/     # Middleware Express
│   ├── models/         # Modelos Mongoose
│   ├── routes/         # Rutas API
│   ├── services/       # Servicios reutilizables
│   ├── utils/          # Utilidades
│   ├── config/         # Configuración
│   ├── types/          # Tipos TypeScript
│   └── app.ts          # Aplicación Express
├── tests/
│   ├── integration/    # Pruebas de integración
│   ├── unit/          # Pruebas unitarias
│   └── fixtures/       # Datos de prueba
└── uploads/           # Archivos subidos
```

### Frontend

```
frontend/
├── src/
│   ├── components/    # Componentes React
│   ├── pages/         # Páginas/Rutas
│   ├── context/       # Contextos React
│   ├── hooks/         # Hooks personalizados
│   ├── services/      # Servicios API
│   ├── types/         # Tipos TypeScript
│   ├── utils/         # Utilidades
│   ├── assets/        # Recursos estáticos
│   └── styles/        # Estilos globales
└── public/           # Archivos públicos
```

## Flujo de Trabajo

1. Crear rama para nueva característica:
   ```bash
   git checkout -b feature/nombre-caracteristica
   ```

2. Desarrollo con TDD:
   - Escribir pruebas primero
   - Implementar funcionalidad
   - Refactorizar si es necesario

3. Ejecutar pruebas:
   ```bash
   # Backend
   npm test
   npm run lint

   # Frontend
   npm run test
   npm run lint
   ```

4. Commit y push:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push origin feature/nombre-caracteristica
   ```

5. Crear Pull Request

## Convenciones

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Cambios de estilo
- `refactor`: Refactorización
- `test`: Añadir/modificar pruebas
- `chore`: Tareas de mantenimiento

### Código

- Usar TypeScript strict mode
- Documentar funciones y tipos complejos
- Mantener componentes pequeños y reutilizables
- Seguir principios SOLID
- Usar interfaces para modelos/DTOs

### Pruebas

- Pruebas unitarias para utilidades y servicios
- Pruebas de integración para API
- Snapshots para componentes UI
- Mocks para servicios externos
- Cobertura mínima: 80%

## Base de Datos

### Índices MongoDB

```javascript
// Usuarios
db.users.createIndex({ "email": 1 }, { unique: true })

// Equipos
db.teams.createIndex({ "category": 1 })

// Jugadores
db.players.createIndex({ "dni": 1 }, { unique: true })
db.players.createIndex({ "teamId": 1 })

// Socios
db.members.createIndex({ "dni": 1 }, { unique: true })
db.members.createIndex({ "teamId": 1 })
db.members.createIndex({ "status": 1 })
db.members.createIndex({ "memberNumber": 1 })

// Eventos
db.events.createIndex({ "teamId": 1 })
db.events.createIndex({ "date": 1 })

// Medios
db.media.createIndex({ "teamId": 1 })
db.media.createIndex({ "type": 1 })
```

### Respaldos

Script de backup diario:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
mongodump --db futbol_web --out /backup/mongo/$DATE
find /backup/mongo -type d -mtime +7 -exec rm -rf {} +
```

## CI/CD

### GitHub Actions

- Pruebas en cada PR
- Lint en cada push
- Deploy automático en main
- Notificaciones en Slack

### Monitoreo

- PM2 para logs y métricas
- Nginx access/error logs
- MongoDB performance metrics

## Seguridad

- Validar inputs con express-validator
- Sanitizar HTML en frontend
- Limitar tamaño de uploads
- Validar tipos MIME
- Usar prepared statements
- Implementar rate limiting
- Mantener dependencias actualizadas

## Optimización

### Backend

- Usar índices en MongoDB
- Implementar caché
- Paginar resultados grandes
- Comprimir respuestas
- Usar streams para archivos

### Frontend

- Lazy loading de rutas
- Optimizar imágenes
- Minimizar bundle size
- Usar React.memo
- Implementar virtualización

## Resolución de Problemas

### Logs

- Backend: `/var/log/futbol-web/`
- Nginx: `/var/log/nginx/`
- PM2: `pm2 logs`
- MongoDB: `/var/log/mongodb/`

### Comandos Útiles

```bash
# Reiniciar servicios
pm2 restart futbol-api
sudo systemctl restart nginx

# Verificar estado
pm2 status
sudo systemctl status nginx
sudo systemctl status mongodb

# Limpiar caché
npm cache clean --force
rm -rf node_modules
npm install

# Verificar espacio
df -h
du -sh uploads/

# Logs en tiempo real
tail -f /var/log/futbol-web/error.log
```