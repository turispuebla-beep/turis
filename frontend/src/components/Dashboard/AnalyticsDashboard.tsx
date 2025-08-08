import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Alert
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

interface AnalyticsData {
    userStats: {
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
        usersByRole: {
            admin: number;
            teamAdmin: number;
            player: number;
            member: number;
        };
    };
    teamStats: {
        totalTeams: number;
        playersByCategory: {
            category: string;
            count: number;
        }[];
        membersByTeam: {
            team: string;
            count: number;
        }[];
    };
    activityStats: {
        eventsCreated: number;
        matchesRecorded: number;
        mediaUploaded: number;
        notificationsSent: number;
    };
    engagementData: {
        date: string;
        logins: number;
        actions: number;
    }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AnalyticsData | null>(null);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar datos analíticos');
            }

            const analyticsData = await response.json();
            setData(analyticsData.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!data) return null;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Panel de Analíticas
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small">
                        <InputLabel>Periodo</InputLabel>
                        <Select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            label="Periodo"
                        >
                            <MenuItem value="7d">Última semana</MenuItem>
                            <MenuItem value="30d">Último mes</MenuItem>
                            <MenuItem value="90d">Últimos 3 meses</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        onClick={fetchAnalytics}
                    >
                        Actualizar
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {/* Resumen de Usuarios */}
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Usuarios Totales
                            </Typography>
                            <Typography variant="h4">
                                {data.userStats.totalUsers}
                            </Typography>
                            <Typography color="textSecondary">
                                {data.userStats.newUsers} nuevos en este periodo
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Usuarios Activos
                            </Typography>
                            <Typography variant="h4">
                                {data.userStats.activeUsers}
                            </Typography>
                            <Typography color="textSecondary">
                                {((data.userStats.activeUsers / data.userStats.totalUsers) * 100).toFixed(1)}% del total
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Equipos Activos
                            </Typography>
                            <Typography variant="h4">
                                {data.teamStats.totalTeams}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Actividad
                            </Typography>
                            <Typography variant="h4">
                                {data.activityStats.eventsCreated + data.activityStats.matchesRecorded}
                            </Typography>
                            <Typography color="textSecondary">
                                eventos y partidos
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Gráfico de Usuarios por Rol */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: 300 }}>
                        <Typography variant="h6" gutterBottom>
                            Usuarios por Rol
                        </Typography>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Administradores', value: data.userStats.usersByRole.admin },
                                        { name: 'Admin. Equipo', value: data.userStats.usersByRole.teamAdmin },
                                        { name: 'Jugadores/as', value: data.userStats.usersByRole.player },
                                        { name: 'Socios/as', value: data.userStats.usersByRole.member }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {COLORS.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Gráfico de Jugadores por Categoría */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: 300 }}>
                        <Typography variant="h6" gutterBottom>
                            Jugadores/as por Categoría
                        </Typography>
                        <ResponsiveContainer>
                            <BarChart data={data.teamStats.playersByCategory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Gráfico de Engagement */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Actividad Diaria
                        </Typography>
                        <ResponsiveContainer>
                            <LineChart data={data.engagementData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="logins" stroke="#8884d8" name="Inicios de sesión" />
                                <Line type="monotone" dataKey="actions" stroke="#82ca9d" name="Acciones" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Estadísticas de Actividad */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Eventos Creados
                                    </Typography>
                                    <Typography variant="h4">
                                        {data.activityStats.eventsCreated}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Partidos Registrados
                                    </Typography>
                                    <Typography variant="h4">
                                        {data.activityStats.matchesRecorded}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Archivos Subidos
                                    </Typography>
                                    <Typography variant="h4">
                                        {data.activityStats.mediaUploaded}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Notificaciones Enviadas
                                    </Typography>
                                    <Typography variant="h4">
                                        {data.activityStats.notificationsSent}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsDashboard;