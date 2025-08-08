import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    Paper,
    Chip,
    Stack,
    IconButton,
    AppBar,
    Toolbar
} from '@mui/material';
import { ArrowBack, Share } from '@mui/icons-material';
import { News } from '../../types/news';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// TODO: Implementar el servicio de noticias
const mockNews: News = {
    id: '1',
    title: 'Bienvenidos a TURISTEAM',
    content: '¡Bienvenidos a nuestra nueva plataforma! Aquí encontrarás todas las actualizaciones y noticias importantes.',
    publishDate: new Date(),
    category: 'ANNOUNCEMENTS',
    tags: ['bienvenida', 'nuevo'],
    isImportant: true
};

export const NewsDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Implementar la carga real de la noticia
        setTimeout(() => {
            setNews(mockNews);
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleShare = () => {
        if (news) {
            navigator.share({
                title: news.title,
                text: news.content,
                url: window.location.href
            }).catch((error) => console.log('Error sharing:', error));
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!news) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    Noticia no encontrada
                </Typography>
            </Container>
        );
    }

    return (
        <Box>
            <AppBar position="sticky" color="default" elevation={0}>
                <Toolbar>
                    <IconButton edge="start" onClick={() => navigate(-1)}>
                        <ArrowBack />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton onClick={handleShare}>
                        <Share />
                    </IconButton>
                </Toolbar>
            </AppBar>
            
            <Container maxWidth="md" sx={{ py: 4 }}>
                {news.imageUrl && (
                    <Paper 
                        sx={{ 
                            height: 300, 
                            mb: 3, 
                            backgroundImage: `url(${news.imageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} 
                    />
                )}

                <Typography variant="h4" component="h1" gutterBottom>
                    {news.title}
                </Typography>

                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {format(new Date(news.publishDate), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                </Typography>

                {news.author && (
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Por: {news.author}
                    </Typography>
                )}

                <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    <Chip 
                        label={news.category} 
                        color="primary" 
                    />
                    {news.isImportant && (
                        <Chip 
                            label="Importante" 
                            color="error" 
                        />
                    )}
                </Stack>

                <Typography variant="body1" paragraph>
                    {news.content}
                </Typography>

                {news.tags.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                        {news.tags.map((tag) => (
                            <Chip 
                                key={tag} 
                                label={tag} 
                                variant="outlined" 
                                size="small" 
                            />
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
};