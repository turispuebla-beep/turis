import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Event as EventIcon,
    LocationOn as LocationIcon,
    Group as GroupIcon,
    Photo as PhotoIcon,
    VideoCall as VideoIcon
} from '@mui/icons-material';
import { usePermissions } from '../../hooks/usePermissions';
import { TeamEvent } from '../../types/team';

interface TeamEventListProps {
    teamId: string;
}

export function TeamEventList({ teamId }: TeamEventListProps) {
    const [events, setEvents] = useState<TeamEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { canManageTeamEvents } = usePermissions();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        type: 'entrenamiento' as const,
    });

    useEffect(() => {
        loadTeamEvents();
    }, [teamId]);

    const loadTeamEvents = async () => {
        try {
            // Aquí cargaríamos los eventos específicos del equipo
            const response = await fetch(`/api/teams/${teamId}/events`);
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError('Error cargando eventos del equipo');
        }
    };

    const handleCreateEvent = async () => {
        try {
            const response = await fetch(`/api/teams/${teamId}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    teamId
                })
            });

            if (response.ok) {
                setSuccess('Evento creado correctamente');
                loadTeamEvents();
                setOpenDialog(false);
            } else {
                setError('Error creando el evento');
            }
        } catch (err) {
            setError('Error en la creación del evento');
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) return;

        try {
            const response = await fetch(`/api/teams/${teamId}/events/${eventId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSuccess('Evento eliminado correctamente');
                loadTeamEvents();
            } else {
                setError('Error eliminando el evento');
            }
        } catch (err) {
            setError('Error en la eliminación del evento');
        }
    };

    const getEventTypeColor = (type: string) => {
        const colors = {
            entrenamiento: 'primary',
            reunion: 'secondary',
            social: 'success',
            otro: 'default'
        };
        return colors[type as keyof typeof colors];
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">
                    Eventos del Equipo
                </Typography>
                {canManageTeamEvents(teamId) && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Nuevo Evento
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={2}>
                {events.map((event) => (
                    <Grid item xs={12} md={6} key={event.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">
                                        {event.title}
                                    </Typography>
                                    <Chip
                                        label={event.type}
                                        color={getEventTypeColor(event.type)}
                                        size="small"
                                    />
                                </Box>

                                <Typography color="textSecondary" gutterBottom>
                                    <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    {new Date(event.date).toLocaleDateString()}
                                </Typography>

                                <Typography gutterBottom>
                                    <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    {event.location}
                                </Typography>

                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {event.description}
                                </Typography>

                                {event.attendance && (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                            Asistencia:
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip
                                                label={`Confirmados: ${event.attendance.filter(a => a.status === 'confirmado').length}`}
                                                color="success"
                                                size="small"
                                            />
                                            <Chip
                                                label={`Pendientes: ${event.attendance.filter(a => a.status === 'pendiente').length}`}
                                                color="warning"
                                                size="small"
                                            />
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {event.photos && event.photos.length > 0 && (
                                        <IconButton size="small">
                                            <PhotoIcon />
                                        </IconButton>
                                    )}
                                    {event.videos && event.videos.length > 0 && (
                                        <IconButton size="small">
                                            <VideoIcon />
                                        </IconButton>
                                    )}
                                </Box>

                                {canManageTeamEvents(teamId) && (
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setFormData({
                                                    title: event.title,
                                                    description: event.description,
                                                    date: event.date,
                                                    location: event.location,
                                                    type: event.type
                                                });
                                                setOpenDialog(true);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteEvent(event.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {selectedEvent ? 'Editar Evento' : 'Nuevo Evento'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Título"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        fullWidth
                        label="Fecha"
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        margin="normal"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Ubicación"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo de evento</InputLabel>
                        <Select
                            value={formData.type}
                            label="Tipo de evento"
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                        >
                            <MenuItem value="entrenamiento">Entrenamiento</MenuItem>
                            <MenuItem value="reunion">Reunión</MenuItem>
                            <MenuItem value="social">Evento Social</MenuItem>
                            <MenuItem value="otro">Otro</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateEvent}
                    >
                        {selectedEvent ? 'Guardar Cambios' : 'Crear Evento'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}