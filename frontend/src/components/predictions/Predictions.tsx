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
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import {
    TrendingUp,
    SportsSoccer,
    Person,
    Timeline,
    Assessment,
    Warning,
    CheckCircle,
    Error as ErrorIcon
} from '@mui/icons-material';
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
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { useParams } from 'react-router-dom';
import { sharedPredictionService } from '../../services/sharedPredictionService';
import { sharedTeamService } from '../../services/sharedTeamService';

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
            id={`prediction-tabpanel-${index}`}
            aria-labelledby={`prediction-tab-${index}`}
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function Predictions() {
    const { teamId } = useParams<{ teamId: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [seasonPrediction, setSeasonPrediction] = useState<any>(null);
    const [nextMatch, setNextMatch] = useState<any>(null);
    const [playerPredictions, setPlayerPredictions] = useState<any[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [injuryRisks, setInjuryRisks] = useState<any[]>([]);
    const [team, setTeam] = useState<any>(null);

    useEffect(() => {
        if (teamId) {
            loadPredictions();
        }
    }, [teamId]);

    const loadPredictions = async () => {
        if (!teamId) return;

        try {
            setLoading(true);
            setError(null);

            const [teamData, season, players] = await Promise.all([
                sharedTeamService.getTeamById(teamId),
                sharedPredictionService.predictSeason(teamId),
                sharedTeamService.getTeamPlayers(teamId)
            ]);

            setTeam(teamData);
            setSeasonPrediction(season);

            // Obtener predicciones para cada jugador
            const playerPreds = await Promise.all(
                players.map(player => sharedPredictionService.predictPlayer(player.id))
            );
            setPlayerPredictions(playerPreds);

            // Obtener riesgos de lesión
            const risks = await Promise.all(
                players.map(player => sharedPredictionService.getInjuryRisk(player.id))
            );
            setInjuryRisks(risks);

            // Obtener próximo partido si existe
            const matches = await sharedTeamService.getTeamMatches(teamId, {
                status: 'upcoming',
                limit: 1
            });
            if (matches.length > 0) {
                const prediction = await sharedPredictionService.predictMatch(matches[0].id);
                setNextMatch({ match: matches[0], prediction });
            }

        } catch (err) {
            setError('Error al cargar las predicciones');
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

    if (error || !seasonPrediction) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error || 'No se pudieron cargar las predicciones'}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Predicciones para {team.name}
            </Typography>

            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="prediction tabs">
                <Tab icon={<TrendingUp />} label="Temporada" id="prediction-tab-0" />
                <Tab icon={<SportsSoccer />} label="Próximo Partido" id="prediction-tab-1" />
                <Tab icon={<Person />} label="Jugadores" id="prediction-tab-2" />
                <Tab icon={<Timeline />} label="Tendencias" id="prediction-tab-3" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Posición Final Predicha
                                </Typography>
                                <Typography variant="h3" color="primary">
                                    {seasonPrediction.predictedPosition}º
                                </Typography>
                                <Typography color="textSecondary">
                                    {seasonPrediction.predictedPoints} puntos
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Predicciones por Métrica
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={seasonPrediction.predictions}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="metric" />
                                        <PolarRadiusAxis />
                                        <Radar
                                            name="Valor"
                                            dataKey="value"
                                            stroke="#8884d8"
                                            fill="#8884d8"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Tendencias
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={seasonPrediction.trends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="metric" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="current" name="Actual" fill="#8884d8" />
                                        <Bar dataKey="predicted" name="Predicho" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                {nextMatch ? (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Predicción del Próximo Partido
                                    </Typography>
                                    <Box display="flex" justifyContent="space-around" alignItems="center" my={3}>
                                        <Box textAlign="center">
                                            <Typography variant="h5">{nextMatch.match.homeTeam}</Typography>
                                            <Typography variant="h3" color="primary">
                                                {nextMatch.prediction.homeTeam.predictedGoals.toFixed(1)}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                {(nextMatch.prediction.homeTeam.winProbability * 100).toFixed(1)}% victoria
                                            </Typography>
                                        </Box>
                                        <Typography variant="h4">VS</Typography>
                                        <Box textAlign="center">
                                            <Typography variant="h5">{nextMatch.match.awayTeam}</Typography>
                                            <Typography variant="h3" color="primary">
                                                {nextMatch.prediction.awayTeam.predictedGoals.toFixed(1)}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                {(nextMatch.prediction.awayTeam.winProbability * 100).toFixed(1)}% victoria
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="subtitle1" textAlign="center" color="textSecondary">
                                        Probabilidad de empate: {(nextMatch.prediction.drawProbability * 100).toFixed(1)}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Factores Clave
                                    </Typography>
                                    <List>
                                        {nextMatch.prediction.factors.map((factor: any, index: number) => (
                                            <ListItem key={index}>
                                                <ListItemIcon>
                                                    <Assessment />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={factor.name}
                                                    secondary={factor.description}
                                                />
                                                <Chip
                                                    label={`${(factor.weight * 100).toFixed(1)}%`}
                                                    color={factor.weight > 0.5 ? "success" : "warning"}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Alert severity="info">
                        No hay próximos partidos programados
                    </Alert>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                    {playerPredictions.map((prediction, index) => (
                        <Grid item xs={12} md={6} key={prediction.playerId}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="h6">
                                            {team.players.find((p: any) => p.id === prediction.playerId)?.name}
                                        </Typography>
                                        <Box>
                                            {injuryRisks[index].overallRisk > 0.7 && (
                                                <Chip
                                                    icon={<Warning />}
                                                    label="Alto riesgo de lesión"
                                                    color="error"
                                                    sx={{ mr: 1 }}
                                                />
                                            )}
                                            <Button
                                                size="small"
                                                onClick={() => setSelectedPlayer(prediction.playerId)}
                                            >
                                                Ver detalles
                                            </Button>
                                        </Box>
                                    </Box>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <RadarChart data={prediction.predictions}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="metric" />
                                            <PolarRadiusAxis />
                                            <Radar
                                                name="Próximo Partido"
                                                dataKey="nextMatch"
                                                stroke="#8884d8"
                                                fill="#8884d8"
                                                fillOpacity={0.6}
                                            />
                                            <Radar
                                                name="Temporada"
                                                dataKey="season"
                                                stroke="#82ca9d"
                                                fill="#82ca9d"
                                                fillOpacity={0.6}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Tendencias del Equipo
                                </Typography>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={seasonPrediction.trends}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="metric" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="current"
                                            name="Actual"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="predicted"
                                            name="Predicho"
                                            stroke="#82ca9d"
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* Diálogo de detalles del jugador */}
            <Dialog
                open={!!selectedPlayer}
                onClose={() => setSelectedPlayer(null)}
                maxWidth="md"
                fullWidth
            >
                {selectedPlayer && (
                    <>
                        <DialogTitle>
                            Detalles de Predicción - {team.players.find((p: any) => p.id === selectedPlayer)?.name}
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Áreas de Mejora
                                    </Typography>
                                    <List>
                                        {playerPredictions
                                            .find(p => p.playerId === selectedPlayer)
                                            ?.improvement.map((area: any, index: number) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        {area.potential - area.current > 20 ? (
                                                            <CheckCircle color="success" />
                                                        ) : (
                                                            <ErrorIcon color="warning" />
                                                        )}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={area.area}
                                                        secondary={
                                                            <>
                                                                Actual: {area.current} | Potencial: {area.potential}
                                                                <br />
                                                                {area.recommendations.map((rec: string, i: number) => (
                                                                    <Typography
                                                                        key={i}
                                                                        variant="body2"
                                                                        color="textSecondary"
                                                                    >
                                                                        • {rec}
                                                                    </Typography>
                                                                ))}
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                    </List>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Riesgo de Lesión
                                    </Typography>
                                    {injuryRisks.find(r => r.playerId === selectedPlayer)?.factors.map((factor: any, index: number) => (
                                        <Box key={index} mb={2}>
                                            <Typography variant="subtitle1">
                                                {factor.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {factor.description}
                                            </Typography>
                                            <Box display="flex" alignItems="center" mt={1}>
                                                <Box
                                                    sx={{
                                                        width: `${factor.risk * 100}%`,
                                                        height: 8,
                                                        backgroundColor: factor.risk > 0.7 ? 'error.main' : 'warning.main',
                                                        borderRadius: 1
                                                    }}
                                                />
                                                <Typography variant="body2" ml={1}>
                                                    {(factor.risk * 100).toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedPlayer(null)}>
                                Cerrar
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}