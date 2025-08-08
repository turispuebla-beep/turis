import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import {
    Download as DownloadIcon,
    TrendingUp as TrendingUpIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import { sharedStatsService } from '../../services/sharedStatsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
            id={`stats-tabpanel-${index}`}
            aria-labelledby={`stats-tab-${index}`}
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

export function GlobalStats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [globalStats, setGlobalStats] = useState<any>(null);
    const [teamRankings, setTeamRankings] = useState<any[]>([]);
    const [playerRankings, setPlayerRankings] = useState<any[]>([]);
    const [trends, setTrends] = useState<any>(null);
    const [startDate, setStartDate] = useState<Date>(
        new Date(new Date().setMonth(new Date().getMonth() - 3))
    );
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportFormat, setReportFormat] = useState<'pdf' | 'excel'>('pdf');
    const [interval, setInterval] = useState<'day' | 'week' | 'month'>('week');

    useEffect(() => {
        loadStats();
    }, [startDate, endDate, interval]);

    const loadStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const [stats, teams, players, trendsData] = await Promise.all([
                sharedStatsService.getGlobalStats(),
                sharedStatsService.getTeamRankings({
                    startDate,
                    endDate
                }),
                sharedStatsService.getPlayerRankings({
                    startDate,
                    endDate,
                    sortBy: 'goals'
                }),
                sharedStatsService.getTrends({
                    startDate,
                    endDate,
                    interval
                })
            ]);

            setGlobalStats(stats);
            setTeamRankings(teams);
            setPlayerRankings(players);
            setTrends(trendsData);
        } catch (err) {
            setError('Error al cargar las estadísticas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            const blob = await sharedStatsService.generateReport({
                startDate,
                endDate,
                includeTeams: true,
                includePlayers: true,
                includeMatches: true,
                includeEvents: true,
                format: reportFormat
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_global_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.${reportFormat}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError('Error al generar el reporte');
            console.error(err);
        }
        setReportDialogOpen(false);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error || !globalStats || !trends) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error || 'No se pudieron cargar las estadísticas'}
            </Alert>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Estadísticas Globales
                </Typography>
                <Box display="flex" gap={2}>
                    <DatePicker
                        label="Fecha inicio"
                        value={startDate}
                        onChange={(date) => date && setStartDate(date)}
                    />
                    <DatePicker
                        label="Fecha fin"
                        value={endDate}
                        onChange={(date) => date && setEndDate(date)}
                    />
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Intervalo</InputLabel>
                        <Select
                            value={interval}
                            label="Intervalo"
                            onChange={(e) => setInterval(e.target.value as typeof interval)}
                        >
                            <MenuItem value="day">Diario</MenuItem>
                            <MenuItem value="week">Semanal</MenuItem>
                            <MenuItem value="month">Mensual</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => setReportDialogOpen(true)}
                    >
                        Generar Reporte
                    </Button>
                </Box>
            </Box>

            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="stats tabs">
                <Tab label="Resumen" id="stats-tab-0" />
                <Tab label="Equipos" id="stats-tab-1" />
                <Tab label="Jugadores" id="stats-tab-2" />
                <Tab label="Tendencias" id="stats-tab-3" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    {/* Tarjetas de resumen */}
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Equipos Activos
                                </Typography>
                                <Typography variant="h5">
                                    {globalStats.teams.active}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Jugadores Activos
                                </Typography>
                                <Typography variant="h5">
                                    {globalStats.players.active}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Partidos Jugados
                                </Typography>
                                <Typography variant="h5">
                                    {globalStats.matches.completed}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Promedio Goles/Partido
                                </Typography>
                                <Typography variant="h5">
                                    {globalStats.matches.averageGoalsPerMatch.toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Distribución de jugadores por posición */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Jugadores por Posición
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={Object.entries(globalStats.players.byPosition).map(([key, value]) => ({
                                                name: key,
                                                value
                                            }))}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {Object.entries(globalStats.players.byPosition).map((entry, index) => (
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

                    {/* Eventos por tipo */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Eventos por Tipo
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={Object.entries(globalStats.events.byType).map(([key, value]) => ({
                                        tipo: key,
                                        cantidad: value
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="tipo" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="cantidad" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Clasificación de Equipos
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={teamRankings.slice(0, 10)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="teamName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="points" name="Puntos" fill="#8884d8" />
                                <Bar dataKey="goalsFor" name="Goles a Favor" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Máximos Goleadores
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={playerRankings.slice(0, 10)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="playerName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="goals" name="Goles" fill="#8884d8" />
                                <Bar dataKey="assists" name="Asistencias" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Tendencias
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={trends.timestamps.map((timestamp: string, index: number) => ({
                                fecha: new Date(timestamp).toLocaleDateString(),
                                ...trends.metrics.reduce((acc: any, metric: any) => ({
                                    ...acc,
                                    [metric.name]: metric.data[index]
                                }), {})
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fecha" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {trends.metrics.map((metric: any, index: number) => (
                                    <Line
                                        key={metric.name}
                                        type="monotone"
                                        dataKey={metric.name}
                                        stroke={COLORS[index % COLORS.length]}
                                        activeDot={{ r: 8 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </TabPanel>

            {/* Diálogo de generación de reporte */}
            <Dialog
                open={reportDialogOpen}
                onClose={() => setReportDialogOpen(false)}
            >
                <DialogTitle>Generar Reporte</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Formato</InputLabel>
                        <Select
                            value={reportFormat}
                            label="Formato"
                            onChange={(e) => setReportFormat(e.target.value as 'pdf' | 'excel')}
                        >
                            <MenuItem value="pdf">PDF</MenuItem>
                            <MenuItem value="excel">Excel</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReportDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleGenerateReport} variant="contained">
                        Generar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}