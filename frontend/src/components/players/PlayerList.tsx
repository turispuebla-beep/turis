import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Button,
    CircularProgress,
    IconButton,
    Fab,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    SportsSoccer,
    EmojiEvents
} from '@mui/icons-material';
import { Player, PlayerPosition } from '../../types/team';
import { getTeamPlayers, removePlayer } from '../../services/teamService';
import { useAuth } from '../../hooks/useAuth';

interface PlayerListProps {
    teamId: string;
}

export function PlayerList({ teamId }: PlayerListProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        loadPlayers();
    }, [teamId]);

    const loadPlayers = async () => {
        try {
            const data = await getTeamPlayers(teamId);
            setPlayers(data);
        } catch (error) {
            console.error('Error al cargar jugadores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlayer = async (playerId: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este jugador?')) return;

        try {
            await removePlayer(teamId, playerId);
            loadPlayers();
        } catch (error) {
            console.error('Error al eliminar jugador:', error);
        }
    };

    const getPositionColor = (position: PlayerPosition) => {
        switch (position) {
            case 'GOALKEEPER':
                return 'warning';
            case 'DEFENDER':
                return 'error';
            case 'MIDFIELDER':
                return 'info';
            case 'FORWARD':
                return 'success';
            default:
                return 'default';
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
                    Jugadores
                </Typography>
                {isAuthenticated && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/teams/${teamId}/players/new`)}
                    >
                        Nuevo Jugador
                    </Button>
                )}
            </Box>

            <List>
                {players.map((player) => (
                    <Card key={player.id} sx={{ mb: 2 }}>
                        <CardContent>
                            <ListItem disablePadding>
                                <ListItemAvatar>
                                    <Avatar
                                        src={player.imageUrl}
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="h6">
                                                {player.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                #{player.number}
                                            </Typography>
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Chip
                                                label={player.position}
                                                color={getPositionColor(player.position)}
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            <Box display="flex" gap={2} mt={1}>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <SportsSoccer fontSize="small" />
                                                    <Typography variant="body2">
                                                        {player.stats.goals} goles
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <EmojiEvents fontSize="small" />
                                                    <Typography variant="body2">
                                                        {player.stats.assists} asistencias
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    }
                                />
                                {isAuthenticated && (
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => navigate(`/teams/${teamId}/players/${player.id}/edit`)}
                                            sx={{ mr: 1 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            color="error"
                                            onClick={() => handleDeletePlayer(player.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                )}
                            </ListItem>
                        </CardContent>
                    </Card>
                ))}
            </List>

            {isAuthenticated && (
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={() => navigate(`/teams/${teamId}/players/new`)}
                >
                    <AddIcon />
                </Fab>
            )}
        </Container>
    );
}