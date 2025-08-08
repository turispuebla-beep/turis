import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useParams } from 'react-router-dom';
import { sharedTeamService } from '../../services/sharedTeamService';
import { sharedMatchService } from '../../services/sharedMatchService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface TimeRange {
    label: string;
    startDate: Date;
    endDate: Date;
}

const TIME_RANGES: TimeRange[] = [
    {
        label: 'Último mes',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    },
    {
        label: 'Últimos 3 meses',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        endDate: new Date()
    },
    {
        label: 'Últimos 6 meses',
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        endDate: new Date()
    },
    {
        label: 'Último año',
        startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        endDate: new Date()
    }
];

export function TeamStats() {
    const { teamId } = useParams<{ teamId: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRange, setSelectedRange] = useState<TimeRange>(TIME_RANGES[0]);
    const [teamStats, setTeamStats] = useState<any>(null);
    const [playerStats, setPlayerStats] = useState<any[]>([]);
    const [performance, setPerformance] = useState<any>(null);

    useEffect(() => {
        loadStats();
    }, [teamId, selectedRange]);

    const loadStats = async () => {
        if (!teamId) return;

        try {
            setLoading(true);
            setError(null);

            const [stats, players, perf] = await Promise.all([
                sharedTeamService.getTeamStats(teamId),
                sharedMatchService.getPlayerStats(teamId, {
                    startDate: selectedRange.startDate,
                    endDate: selectedRange.endDate
                }),
                sharedMatchService.getTeamPerformance(teamId, {
                    startDate: selectedRange.startDate,
                    endDate: selectedRange.endDate
                })
            ]);

            setTeamStats(stats);
            setPlayerStats(players);
            setPerformance(perf);
        } catch (err) {
            setError('Error al cargar las estadísticas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !teamStats || !performance) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error || 'No se pudieron cargar las estadísticas'}
            </Alert>
        );
    }

    const resultsPieData = [
        { name: 'Victorias', value: performance.wins },
        { name: 'Empates', value: performance.draws },
        { name: 'Derrotas', value: performance.losses }
    ];

    const formData = performance.form.map((result: string, index: number) => ({
        match: `Partido ${index + 1}`,
        resultado: result === 'W' ? 3 : result === 'D' ? 1 : 0
    }));

    const topScorers = playerStats
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 5)
        .map(player => ({
            name: player.name,
            goles: player.goals
        }));

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Estadísticas del Equipo
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Período</InputLabel>
                    <Select
                        value={selectedRange.label}
                        label="Período"
                        onChange={(e) => {
                            const range = TIME_RANGES.find(r => r.label === e.target.value);
                            if (range) setSelectedRange(range);
                        }}
                    >
                        {TIME_RANGES.map(range => (
                            <MenuItem key={range.label} value={range.label}>
                                {range.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {/* Tarjetas de resumen */}
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Partidos Jugados
                            </Typography>
                            <Typography variant="h5">
                                {performance.matches}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Goles a Favor
                            </Typography>
                            <Typography variant="h5">
                                {performance.goalsFor}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Goles en Contra
                            </Typography>
                            <Typography variant="h5">
                                {performance.goalsAgainst}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Porterías a Cero
                            </Typography>
                            <Typography variant="h5">
                                {performance.cleanSheets}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico de resultados */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Distribución de Resultados
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={resultsPieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {resultsPieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico de forma */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Forma Reciente
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={formData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="match" />
                                    <YAxis domain={[0, 3]} ticks={[0, 1, 3]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="resultado"
                                        stroke="#8884d8"
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico de goleadores */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Máximos Goleadores
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={topScorers}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="goles" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}