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
    SelectChangeEvent,
    Autocomplete,
    Chip
} from '@mui/material';
import { Event, EventType, EventStatus, Player } from '../../types/team';
import { createEvent, updateEvent, getTeamPlayers } from '../../services/teamService';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { es } from 'date-fns/locale';

export function EventForm() {
    const { teamId, eventId } = useParams<{ teamId: string; eventId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [formData, setFormData] = useState<Partial<Event>>({
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        location: '',
        type: 'TRAINING',
        status: 'UPCOMING',
        attendees: []
    });

    useEffect(() => {
        if (teamId) {
            loadPlayers();
        }
        if (eventId) {
            // TODO: Implementar carga de evento existente
        }
    }, [teamId, eventId]);

    const loadPlayers = async () => {
        if (!teamId) return;
        try {
            const data = await getTeamPlayers(teamId);
            setPlayers(data);
        } catch (error) {
            console.error('Error al cargar jugadores:', error);
            setError('Error al cargar la lista de jugadores');
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

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                startDate: date,
                endDate: prev.endDate && date > prev.endDate ? date : prev.endDate
            }));
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                endDate: date
            }));
        }
    };

    const handleAttendeesChange = (event: any, newValue: Player[]) => {
        setFormData(prev => ({
            ...prev,
            attendees: newValue.map(player => player.id)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamId) return;

        setError('');
        setLoading(true);

        try {
            if (eventId) {
                await updateEvent(teamId, eventId, formData);
            } else {
                await createEvent(teamId, formData);
            }
            navigate(`/teams/${teamId}`);
        } catch (error) {
            console.error('Error al guardar evento:', error);
            setError('Error al guardar los datos del evento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {eventId ? 'Editar Evento' : 'Nuevo Evento'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Título"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Lugar"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DateTimePicker
                                    label="Fecha y hora de inicio"
                                    value={formData.startDate}
                                    onChange={handleStartDateChange}
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DateTimePicker
                                    label="Fecha y hora de fin"
                                    value={formData.endDate}
                                    onChange={handleEndDateChange}
                                    minDateTime={formData.startDate}
                                    sx={{ width: '100%' }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <MenuItem value="TRAINING">Entrenamiento</MenuItem>
                                    <MenuItem value="MATCH">Partido</MenuItem>
                                    <MenuItem value="MEETING">Reunión</MenuItem>
                                    <MenuItem value="SOCIAL">Social</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <MenuItem value="UPCOMING">Próximo</MenuItem>
                                    <MenuItem value="IN_PROGRESS">En Progreso</MenuItem>
                                    <MenuItem value="COMPLETED">Completado</MenuItem>
                                    <MenuItem value="CANCELLED">Cancelado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                multiple
                                options={players}
                                getOptionLabel={(player) => player.name}
                                value={players.filter(player => formData.attendees?.includes(player.id))}
                                onChange={handleAttendeesChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Asistentes"
                                        placeholder="Seleccionar jugadores"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((player, index) => (
                                        <Chip
                                            label={player.name}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                            />
                        </Grid>

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