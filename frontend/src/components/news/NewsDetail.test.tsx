import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NewsDetail } from './NewsDetail';
import { getNewsById } from '../../services/newsService';
import { useAuth } from '../../hooks/useAuth';

// Mock de los hooks y servicios
vi.mock('../../services/newsService');
vi.mock('../../hooks/useAuth');

const mockNews = {
    id: '1',
    title: 'Noticia de prueba',
    content: 'Contenido de la noticia de prueba',
    imageUrl: 'https://example.com/image.jpg',
    publishDate: new Date(),
    author: 'Autor Test',
    category: 'GENERAL',
    tags: ['test', 'prueba'],
    isImportant: true
};

describe('NewsDetail', () => {
    beforeEach(() => {
        (getNewsById as jest.Mock).mockResolvedValue(mockNews);
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza los detalles de la noticia correctamente', async () => {
        render(
            <MemoryRouter initialEntries={['/news/1']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(mockNews.title)).toBeInTheDocument();
            expect(screen.getByText(mockNews.content)).toBeInTheDocument();
            expect(screen.getByText(`Por: ${mockNews.author}`)).toBeInTheDocument();
            expect(screen.getByText(mockNews.category)).toBeInTheDocument();
            mockNews.tags.forEach(tag => {
                expect(screen.getByText(tag)).toBeInTheDocument();
            });
        });
    });

    it('muestra un indicador de carga mientras se obtienen los datos', () => {
        (getNewsById as jest.Mock).mockImplementation(() => new Promise(() => {}));

        render(
            <MemoryRouter initialEntries={['/news/1']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetail />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('muestra un mensaje de error cuando la noticia no se encuentra', async () => {
        (getNewsById as jest.Mock).mockRejectedValue(new Error('Noticia no encontrada'));

        render(
            <MemoryRouter initialEntries={['/news/1']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Noticia no encontrada')).toBeInTheDocument();
        });
    });

    it('maneja la funcionalidad de compartir', async () => {
        const mockShare = vi.fn();
        Object.defineProperty(window, 'navigator', {
            value: { share: mockShare },
            writable: true
        });

        render(
            <MemoryRouter initialEntries={['/news/1']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            const shareButton = screen.getByRole('button', { name: /compartir/i });
            fireEvent.click(shareButton);
        });

        expect(mockShare).toHaveBeenCalledWith({
            title: mockNews.title,
            text: mockNews.content,
            url: expect.any(String)
        });
    });

    it('navega hacia atrás al hacer clic en el botón de retroceso', async () => {
        const mockNavigate = vi.fn();
        vi.mock('react-router-dom', () => ({
            ...vi.importActual('react-router-dom'),
            useNavigate: () => mockNavigate
        }));

        render(
            <MemoryRouter initialEntries={['/news/1']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            const backButton = screen.getByRole('button', { name: /volver/i });
            fireEvent.click(backButton);
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    it('muestra la imagen de la noticia cuando está disponible', async () => {
        render(
            <MemoryRouter initialEntries={['/news/1']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetail />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            const image = screen.getByRole('img');
            expect(image).toHaveAttribute('src', mockNews.imageUrl);
            expect(image).toHaveAttribute('alt', mockNews.title);
        });
    });
});