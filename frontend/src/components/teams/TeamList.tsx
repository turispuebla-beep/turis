import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Box,
    CircularProgress,
    Fab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Team } from '../../types/team';
import { getTeams } from '../../services/teamService';
import { useAuth } from '../../hooks/useAuth';

export function TeamList() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await getTeams();
            setTeams(data);
        } catch (error) {
            console.error('Error al cargar equipos:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Equipos
                </Typography>
                {isAuthenticated && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/teams/new')}
                    >
                        Nuevo Equipo
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {teams.map((team) => (
                    <Grid item xs={12} sm={6} md={4} key={team.id}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/teams/${team.id}`)}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={team.imageUrl || '/placeholder-team.jpg'}
                                alt={team.name}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {team.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {team.description || 'Sin descripción'}
                                </Typography>
                                <Box mt={2}>
                                    <Typography variant="body2">
                                        Jugadores: {team.players?.length || 0}
                                    </Typography>
                                    <Typography variant="body2">
                                        Próximo partido: {team.matches?.length ? 'Sí' : 'No programado'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {isAuthenticated && (
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => navigate('/teams/new')}
                >
                    <AddIcon />
                </Fab>
            )}
        </Container>
    );
}