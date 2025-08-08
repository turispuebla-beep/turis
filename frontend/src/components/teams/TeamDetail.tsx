import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    BarChart,
    Share as ShareIcon,
    Download as DownloadIcon,
    TrendingUp
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { sharedTeamService } from '../../services/sharedTeamService';
import { Team, Player, Match, TeamEvent } from '../../types/team';
import { PlayerList } from '../players/PlayerList';
import { MatchList } from '../matches/MatchList';
import { EventList } from '../events/EventList';
import { TeamStats } from '../stats/TeamStats';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`team-tabpanel-${index}`}
            aria-labelledby={`team-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export function TeamDetail() {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { hasPermission, canManageTeam } = usePermissions();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [events, setEvents] = useState<TeamEvent[]>([]);

    useEffect(() => {
        loadTeamData();
    }, [teamId]);

    const loadTeamData = async () => {
        if (!teamId) return;

        try {
            setLoading(true);
            setError(null);

            const [teamData, playersData, matchesData, eventsData] = await Promise.all([
                sharedTeamService.getTeamById(teamId),
                sharedTeamService.getTeamPlayers(teamId),
                sharedTeamService.getTeamMatches(teamId),
                sharedTeamService.getTeamEvents(teamId)
            ]);

            setTeam(teamData);
            setPlayers(playersData);
            setMatches(matchesData);
            setEvents(eventsData);
        } catch (err) {
            setError('Error al cargar los datos del equipo');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleDeleteTeam = async () => {
        if (!teamId) return;

        try {
            await sharedTeamService.deleteTeam(teamId);
            navigate('/teams');
        } catch (err) {
            setError('Error al eliminar el equipo');
            console.error(err);
        }
        setDeleteDialogOpen(false);
    };

    const handleExportTeam = async (format: 'pdf' | 'excel') => {
        if (!teamId) return;

        try {
            const blob = await sharedTeamService.exportTeamData(teamId, format);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `equipo_${team?.name}_${format}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(`Error al exportar el equipo en formato ${format}`);
            console.error(err);
        }
    };

    const handleShare = async () => {
        if (!team) return;

        try {
            await navigator.share({
                title: team.name,
                text: `Mira los detalles del equipo ${team.name}`,
                url: window.location.href
            });
        } catch (err) {
            console.error('Error al compartir:', err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !team) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error || 'No se encontró el equipo'}
            </Alert>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    {team.name}
                </Typography>
                <Box>
                    <Button
                        startIcon={<ShareIcon />}
                        onClick={handleShare}
                        sx={{ mr: 1 }}
                    >
                        Compartir
                    </Button>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => handleExportTeam('pdf')}
                        sx={{ mr: 1 }}
                    >
                        Exportar PDF
                    </Button>
                    <Button
                        startIcon={<BarChart />}
                        onClick={() => navigate(`/teams/${teamId}/stats`)}
                        sx={{ mr: 1 }}
                    >
                        Estadísticas
                    </Button>
                    <Button
                        startIcon={<TrendingUp />}
                        onClick={() => navigate(`/teams/${teamId}/predictions`)}
                        sx={{ mr: 1 }}
                    >
                        Predicciones
                    </Button>
                    {isAuthenticated && canManageTeam(teamId!) && (
                        <>
                            <Button
                                startIcon={<EditIcon />}
                                onClick={() => navigate(`/teams/${teamId}/edit`)}
                                sx={{ mr: 1 }}
                            >
                                Editar
                            </Button>
                            <Button
                                startIcon={<DeleteIcon />}
                                color="error"
                                onClick={() => setDeleteDialogOpen(true)}
                            >
                                Eliminar
                            </Button>
                        </>
                    )}
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="team tabs">
                    <Tab label="Jugadores" id="team-tab-0" />
                    <Tab label="Partidos" id="team-tab-1" />
                    <Tab label="Eventos" id="team-tab-2" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <PlayerList
                    players={players}
                    teamId={teamId}
                    onPlayerUpdated={loadTeamData}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <MatchList
                    matches={matches}
                    teamId={teamId}
                    onMatchUpdated={loadTeamData}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <EventList
                    events={events}
                    teamId={teamId}
                    onEventUpdated={loadTeamData}
                />
            </TabPanel>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>¿Eliminar equipo?</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar el equipo {team.name}? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteTeam} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}