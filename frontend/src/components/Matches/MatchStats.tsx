import React, { useState, useEffect } from 'react';
import {
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface GeneralStats {
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
}

interface PlayerStats {
    name: string;
    surname: string;
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    minutesPlayed: number;
}

interface MatchStatsProps {
    teamId: string;
    onClose: () => void;
}

const MatchStats: React.FC<MatchStatsProps> = ({ teamId, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [generalStats, setGeneralStats] = useState<GeneralStats | null>(null);
    const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchStats();
    }, [teamId]);

    const fetchStats = async () => {
        try {
            const response = await fetch(`/api/teams/${teamId}/matches/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setGeneralStats(data.data.general);
                setPlayerStats(data.data.players);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    const resultChartData = generalStats ? [
        { name: 'Victorias', value: generalStats.wins },
        { name: 'Empates', value: generalStats.draws },
        { name: 'Derrotas', value: generalStats.losses }
    ] : [];

    const playerGoalsData = playerStats
        .filter(player => player.goals > 0)
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10)
        .map(player => ({
            name: `${player.name} ${player.surname}`,
            goles: player.goals,
            asistencias: player.assists
        }));

    return (
        <>
            <DialogTitle>Estadísticas</DialogTitle>
            <DialogContent>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="General" />
                    <Tab label="Jugadores" />
                </Tabs>

                {tabValue === 0 && generalStats && (
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Resumen General
                                    </Typography>
                                    <Typography>
                                        Partidos jugados: {generalStats.totalMatches}
                                    </Typography>
                                    <Typography>
                                        Goles a favor: {generalStats.goalsFor}
                                    </Typography>
                                    <Typography>
                                        Goles en contra: {generalStats.goalsAgainst}
                                    </Typography>
                                    <Typography>
                                        Diferencia de goles: {generalStats.goalsFor - generalStats.goalsAgainst}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, height: '300px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Resultados
                                    </Typography>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={resultChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#2196f3" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, height: '400px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Goles y Asistencias
                                    </Typography>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={playerGoalsData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="goles" fill="#2196f3" />
                                            <Bar dataKey="asistencias" fill="#4caf50" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {tabValue === 1 && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Jugador/a</TableCell>
                                    <TableCell align="right">PJ</TableCell>
                                    <TableCell align="right">Goles</TableCell>
                                    <TableCell align="right">Asist.</TableCell>
                                    <TableCell align="right">TA</TableCell>
                                    <TableCell align="right">TR</TableCell>
                                    <TableCell align="right">Min.</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {playerStats.map((player) => (
                                    <TableRow key={`${player.name}-${player.surname}`}>
                                        <TableCell>
                                            {player.name} {player.surname}
                                        </TableCell>
                                        <TableCell align="right">{player.matches}</TableCell>
                                        <TableCell align="right">{player.goals}</TableCell>
                                        <TableCell align="right">{player.assists}</TableCell>
                                        <TableCell align="right">{player.yellowCards}</TableCell>
                                        <TableCell align="right">{player.redCards}</TableCell>
                                        <TableCell align="right">{player.minutesPlayed}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </>
    );
};

export default MatchStats;