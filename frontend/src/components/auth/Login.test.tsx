import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../../pages/auth/Login';
import { loginUser } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

// Mock de los hooks y servicios
vi.mock('../../services/authService');
vi.mock('../../hooks/useAuth');

describe('Login', () => {
    const mockLogin = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
        vi.mock('react-router-dom', () => ({
            ...vi.importActual('react-router-dom'),
            useNavigate: () => mockNavigate
        }));
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza el formulario de login correctamente', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
        expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
        expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
    });

    it('maneja el envío del formulario correctamente', async () => {
        const mockUserData = {
            user: {
                id: '1',
                email: 'test@example.com',
                name: 'Test User'
            },
            token: 'mock-token'
        };

        (loginUser as jest.Mock).mockResolvedValue(mockUserData);

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockLogin).toHaveBeenCalledWith(mockUserData.user, mockUserData.token);
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('muestra un mensaje de error cuando falla el login', async () => {
        (loginUser as jest.Mock).mockRejectedValue(new Error('Error de autenticación'));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'password123' }
        });

        fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

        await waitFor(() => {
            expect(screen.getByText('Error al iniciar sesión. Por favor, verifica tus credenciales.')).toBeInTheDocument();
        });
    });

    it('deshabilita el botón de envío durante el proceso de login', async () => {
        (loginUser as jest.Mock).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 1000)));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

        fireEvent.change(screen.getByLabelText('Correo electrónico'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByLabelText('Contraseña'), {
            target: { value: 'password123' }
        });

        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    });

    it('valida los campos requeridos', async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

        await waitFor(() => {
            expect(loginUser).not.toHaveBeenCalled();
        });

        expect(screen.getByLabelText('Correo electrónico')).toBeInvalid();
        expect(screen.getByLabelText('Contraseña')).toBeInvalid();
    });
});