import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent
} from '@mui/material';
import { Match, MatchStatus, Team } from '../../types/team';
import { createMatch, updateMatch } from '../../services/teamService';
import { getTeams } from '../../services/teamService';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { es } from 'date-fns/locale';

export function MatchForm() {
    const { teamId, matchId } = useParams<{ teamId: string; matchId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);
    const [formData, setFormData] = useState<Partial<Match>>({
        homeTeamId: teamId || '',
        awayTeamId: '',
        date: new Date(),
        venue: '',
        status: 'SCHEDULED',
        homeScore: 0,
        awayScore: 0
    });

    useEffect(() => {
        loadTeams();
        if (matchId) {
            // TODO: Implementar carga de partido existente
        }
    }, [matchId]);

    const loadTeams = async () => {
        try {
            const data = await getTeams();
            setTeams(data);
        } catch (error) {
            console.error('Error al cargar equipos:', error);
            setError('Error al cargar la lista de equipos');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                date
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (matchId) {
                await updateMatch(matchId, formData);
            } else {
                await createMatch(formData);
            }
            navigate(`/teams/${teamId}`);
        } catch (error) {
            console.error('Error al guardar partido:', error);
            setError('Error al guardar los datos del partido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {matchId ? 'Editar Partido' : 'Nuevo Partido'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Equipo Local</InputLabel>
                                <Select
                                    name="homeTeamId"
                                    value={formData.homeTeamId}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    {teams.map((team) => (
                                        <MenuItem key={team.id} value={team.id}>
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Equipo Visitante</InputLabel>
                                <Select
                                    name="awayTeamId"
                                    value={formData.awayTeamId}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    {teams
                                        .filter(team => team.id !== formData.homeTeamId)
                                        .map((team) => (
                                            <MenuItem key={team.id} value={team.id}>
                                                {team.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DateTimePicker
                                    label="Fecha y hora"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Lugar"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <MenuItem value="SCHEDULED">Programado</MenuItem>
                                    <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
                                    <MenuItem value="COMPLETED">Completado</MenuItem>
                                    <MenuItem value="CANCELLED">Cancelado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {formData.status === 'COMPLETED' && (
                            <>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Goles Local"
                                        name="homeScore"
                                        value={formData.homeScore}
                                        onChange={handleChange}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Goles Visitante"
                                        name="awayScore"
                                        value={formData.awayScore}
                                        onChange={handleChange}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/teams/${teamId}`)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}