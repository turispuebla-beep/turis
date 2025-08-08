import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TeamList } from './TeamList';
import { getTeams } from '../../services/teamService';
import { useAuth } from '../../hooks/useAuth';

// Mock de los hooks y servicios
vi.mock('../../services/teamService');
vi.mock('../../hooks/useAuth');

const mockTeams = [
    {
        id: '1',
        name: 'Equipo Test 1',
        description: 'Descripción del equipo 1',
        players: [],
        matches: [],
        events: [],
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '2',
        name: 'Equipo Test 2',
        description: 'Descripción del equipo 2',
        players: [],
        matches: [],
        events: [],
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

describe('TeamList', () => {
    beforeEach(() => {
        (getTeams as jest.Mock).mockResolvedValue(mockTeams);
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza la lista de equipos correctamente', async () => {
        render(
            <MemoryRouter>
                <TeamList />
            </MemoryRouter>
        );

        // Verificar que se muestra el título
        expect(screen.getByText('Equipos')).toBeInTheDocument();

        // Esperar a que se carguen los equipos
        await waitFor(() => {
            expect(screen.getByText('Equipo Test 1')).toBeInTheDocument();
            expect(screen.getByText('Equipo Test 2')).toBeInTheDocument();
        });
    });

    it('muestra el botón de nuevo equipo solo cuando el usuario está autenticado', () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

        render(
            <MemoryRouter>
                <TeamList />
            </MemoryRouter>
        );

        expect(screen.getByText('Nuevo Equipo')).toBeInTheDocument();
    });

    it('no muestra el botón de nuevo equipo cuando el usuario no está autenticado', () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

        render(
            <MemoryRouter>
                <TeamList />
            </MemoryRouter>
        );

        expect(screen.queryByText('Nuevo Equipo')).not.toBeInTheDocument();
    });

    it('muestra un mensaje de carga mientras se obtienen los datos', () => {
        (getTeams as jest.Mock).mockImplementation(() => new Promise(() => {}));

        render(
            <MemoryRouter>
                <TeamList />
            </MemoryRouter>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('navega a la página de detalle al hacer clic en un equipo', async () => {
        const mockNavigate = vi.fn();
        vi.mock('react-router-dom', () => ({
            ...vi.importActual('react-router-dom'),
            useNavigate: () => mockNavigate
        }));

        render(
            <MemoryRouter>
                <TeamList />
            </MemoryRouter>
        );

        await waitFor(() => {
            const firstTeam = screen.getByText('Equipo Test 1');
            fireEvent.click(firstTeam);
            expect(mockNavigate).toHaveBeenCalledWith('/teams/1');
        });
    });
});