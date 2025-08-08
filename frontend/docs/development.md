# Guía de Desarrollo

Esta guía proporciona información detallada sobre el desarrollo de la aplicación web TURISTEAM.

## Configuración del entorno de desarrollo

### Requisitos

- Node.js 18 o superior
- npm 8 o superior
- VS Code (recomendado)
- Extensiones recomendadas para VS Code:
  - ESLint
  - Prettier
  - TypeScript + Plugin
  - Material Icon Theme
  - GitLens

### Extensiones VS Code

```json
{
    "recommendations": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-typescript-next",
        "pkief.material-icon-theme",
        "eamodio.gitlens"
    ]
}
```

### Configuración de VS Code

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Arquitectura

La aplicación sigue una arquitectura basada en componentes con las siguientes capas:

1. **Presentación** (`src/components/`)
   - Componentes de UI
   - Manejo de eventos de usuario
   - Renderizado de datos

2. **Lógica de negocio** (`src/services/`)
   - Comunicación con el backend
   - Transformación de datos
   - Validaciones

3. **Estado** (`src/hooks/`, `src/context/`)
   - Gestión del estado global
   - Estado de autenticación
   - Caché de datos

4. **Routing** (`src/router/`)
   - Definición de rutas
   - Protección de rutas
   - Navegación

## Convenciones de código

### Nombrado

- **Componentes**: PascalCase (ej. `TeamList.tsx`)
- **Hooks**: camelCase con prefijo "use" (ej. `useAuth.ts`)
- **Servicios**: camelCase con sufijo "Service" (ej. `teamService.ts`)
- **Tipos**: PascalCase (ej. `Team.ts`)
- **Constantes**: UPPER_SNAKE_CASE (ej. `MAX_ITEMS`)

### Estructura de componentes

```typescript
// Imports
import React from 'react';
import { Props } from './types';

// Tipos
interface ComponentProps {
    prop1: string;
    prop2: number;
}

// Componente
export function Component({ prop1, prop2 }: ComponentProps) {
    // Estado
    const [state, setState] = useState();

    // Efectos
    useEffect(() => {
        // ...
    }, []);

    // Handlers
    const handleEvent = () => {
        // ...
    };

    // Render
    return (
        <div>
            {/* ... */}
        </div>
    );
}
```

### Manejo de errores

```typescript
try {
    await someAsyncOperation();
} catch (error) {
    if (error instanceof ApiError) {
        // Manejar error específico
    } else {
        // Error genérico
        console.error('Error inesperado:', error);
    }
}
```

## Estado global

Utilizamos Zustand para el estado global. Ejemplo de store:

```typescript
import create from 'zustand';

interface Store {
    data: any[];
    loading: boolean;
    error: string | null;
    fetch: () => Promise<void>;
}

export const useStore = create<Store>((set) => ({
    data: [],
    loading: false,
    error: null,
    fetch: async () => {
        set({ loading: true });
        try {
            const data = await fetchData();
            set({ data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}));
```

## Servicios API

Los servicios siguen este patrón:

```typescript
import api from './api';

export const someService = {
    async getAll() {
        const response = await api.get('/endpoint');
        return response.data;
    },

    async getById(id: string) {
        const response = await api.get(`/endpoint/${id}`);
        return response.data;
    },

    async create(data: any) {
        const response = await api.post('/endpoint', data);
        return response.data;
    },

    async update(id: string, data: any) {
        const response = await api.put(`/endpoint/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        await api.delete(`/endpoint/${id}`);
    }
};
```

## Pruebas

### Pruebas de componentes

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
    it('renderiza correctamente', () => {
        render(<Component />);
        expect(screen.getByText('texto')).toBeInTheDocument();
    });

    it('maneja eventos', () => {
        const onClickMock = jest.fn();
        render(<Component onClick={onClickMock} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClickMock).toHaveBeenCalled();
    });
});
```

### Pruebas de hooks

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
    it('maneja el estado correctamente', () => {
        const { result } = renderHook(() => useCustomHook());
        act(() => {
            result.current.someFunction();
        });
        expect(result.current.value).toBe(expectedValue);
    });
});
```

## Optimización

### Memoización

```typescript
// Componentes
const MemoizedComponent = React.memo(Component);

// Callbacks
const callback = useCallback(() => {
    // ...
}, [dependency]);

// Valores calculados
const value = useMemo(() => {
    return expensiveCalculation(prop);
}, [prop]);
```

### Code splitting

```typescript
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <LazyComponent />
        </Suspense>
    );
}
```

## Seguridad

### Autenticación

- Usar tokens JWT
- Almacenar tokens en localStorage/sessionStorage
- Renovar tokens automáticamente
- Manejar expiración de sesiones

### Validación de datos

```typescript
// Validar entrada de usuario
function validateInput(data: unknown): data is ValidData {
    return (
        typeof data === 'object' &&
        data !== null &&
        'property' in data &&
        typeof data.property === 'string'
    );
}
```

### Sanitización

```typescript
function sanitizeHtml(html: string): string {
    // Usar DOMPurify o similar
    return DOMPurify.sanitize(html);
}
```

## Accesibilidad

- Usar roles ARIA apropiados
- Asegurar navegación por teclado
- Mantener contraste adecuado
- Proporcionar textos alternativos

```typescript
// Ejemplo de componente accesible
function AccessibleButton({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            role="button"
            aria-label="descripción"
            tabIndex={0}
        >
            {children}
        </button>
    );
}
```

## Internacionalización

Usamos `react-intl` para la internacionalización:

```typescript
import { FormattedMessage } from 'react-intl';

function Component() {
    return (
        <FormattedMessage
            id="component.title"
            defaultMessage="Título"
        />
    );
}
```

## Despliegue

### Proceso de build

1. Verificar tipos:
   ```bash
   tsc --noEmit
   ```

2. Ejecutar pruebas:
   ```bash
   npm test
   ```

3. Construir:
   ```bash
   npm run build
   ```

### Variables de entorno

Crear diferentes archivos para cada entorno:

- `.env.development`
- `.env.staging`
- `.env.production`

### CI/CD

Ejemplo de workflow de GitHub Actions:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run build
```

## Monitoreo

- Usar React DevTools
- Implementar logging
- Monitorear rendimiento
- Trackear errores con Sentry

## Recursos

- [React Docs](https://reactjs.org/docs/getting-started.html)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Material-UI Docs](https://mui.com/getting-started/installation/)
- [React Router Docs](https://reactrouter.com/docs/en/v6)