import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { News } from '../../types/news';
import { NewsCard } from './NewsCard';
import { useNavigate } from 'react-router-dom';

// TODO: Implementar el servicio de noticias
const mockNews: News[] = [
    {
        id: '1',
        title: 'Bienvenidos a TURISTEAM',
        content: '¡Bienvenidos a nuestra nueva plataforma! Aquí encontrarás todas las actualizaciones y noticias importantes.',
        publishDate: new Date(),
        category: 'ANNOUNCEMENTS',
        tags: ['bienvenida', 'nuevo'],
        isImportant: true
    }
];

export const NewsList = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // TODO: Implementar la carga real de noticias
        setTimeout(() => {
            setNews(mockNews);
            setLoading(false);
        }, 1000);
    }, []);

    const handleNewsClick = (news: News) => {
        navigate(`/news/${news.id}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Noticias
            </Typography>
            {news.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No hay noticias disponibles.
                </Typography>
            ) : (
                news.map((item) => (
                    <NewsCard 
                        key={item.id} 
                        news={item} 
                        onClick={handleNewsClick} 
                    />
                ))
            )}
        </Container>
    );
};