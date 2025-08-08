# TURISTEAM Web Frontend

Este es el frontend web de la aplicación TURISTEAM, una plataforma para la gestión de equipos deportivos. La aplicación está construida con React, TypeScript y Material-UI, y se integra con una aplicación Android y un backend Node.js.

## Características

- 📰 Gestión de noticias y actualizaciones
- 👥 Gestión de equipos y jugadores
- ⚽ Seguimiento de partidos y eventos
- 📊 Estadísticas y análisis
- 🔍 Búsqueda global
- 👤 Perfiles de usuario
- 🔔 Notificaciones push
- 🎨 Diseño responsive y moderno

## Requisitos previos

- Node.js 18 o superior
- npm 8 o superior
- Un navegador moderno con soporte para ES6+

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/turisteam.git
   cd turisteam/frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_VAPID_PUBLIC_KEY=tu-clave-publica-vapid
   ```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Previsualiza la versión de producción
- `npm run lint` - Ejecuta el linter
- `npm run lint:fix` - Corrige automáticamente los problemas de linting
- `npm test` - Ejecuta las pruebas
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:coverage` - Genera un reporte de cobertura de pruebas

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── auth/       # Componentes de autenticación
│   │   ├── layout/     # Componentes de layout
│   │   ├── news/       # Componentes de noticias
│   │   ├── teams/      # Componentes de equipos
│   │   ├── matches/    # Componentes de partidos
│   │   ├── events/     # Componentes de eventos
│   │   ├── players/    # Componentes de jugadores
│   │   ├── stats/      # Componentes de estadísticas
│   │   └── search/     # Componentes de búsqueda
│   ├── pages/          # Páginas principales
│   ├── services/       # Servicios de API
│   ├── hooks/          # Hooks personalizados
│   ├── types/          # Definiciones de tipos
│   ├── context/        # Contextos de React
│   └── theme/          # Configuración del tema
├── public/             # Archivos estáticos
└── tests/              # Pruebas
```

## Tecnologías principales

- [React](https://reactjs.org/) - Biblioteca de UI
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Material-UI](https://mui.com/) - Biblioteca de componentes
- [React Router](https://reactrouter.com/) - Enrutamiento
- [Zustand](https://zustand-demo.pmnd.rs/) - Gestión de estado
- [Axios](https://axios-http.com/) - Cliente HTTP
- [date-fns](https://date-fns.org/) - Utilidades de fechas
- [Recharts](https://recharts.org/) - Gráficos
- [Jest](https://jestjs.io/) - Framework de pruebas
- [React Testing Library](https://testing-library.com/) - Utilidades de prueba

## Integración con el backend

La aplicación se comunica con el backend a través de una API REST. Los endpoints principales están definidos en `src/services/` y siguen esta estructura:

- `authService.ts` - Autenticación y gestión de usuarios
- `newsService.ts` - Gestión de noticias
- `teamService.ts` - Gestión de equipos y jugadores
- `matchService.ts` - Gestión de partidos
- `eventService.ts` - Gestión de eventos

## Notificaciones push

La aplicación utiliza el Service Worker API para recibir notificaciones push. La configuración se encuentra en:

- `public/sw.js` - Service Worker
- `src/services/notificationService.ts` - Gestión de suscripciones

## Estilo y temas

El tema de la aplicación está configurado en `src/theme.ts` y utiliza la paleta de colores de Material-UI. Para personalizar el tema:

1. Modifica `src/theme.ts`
2. Los componentes utilizan el sistema de estilos de Material-UI
3. Los estilos específicos de componentes se definen usando el hook `makeStyles`

## Pruebas

Las pruebas están escritas usando Jest y React Testing Library. Para ejecutar las pruebas:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## Despliegue

Para desplegar la aplicación:

1. Compila el proyecto:
   ```bash
   npm run build
   ```

2. Los archivos de producción estarán en la carpeta `dist/`

3. Despliega los archivos en tu servidor web

## Contribuir

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.