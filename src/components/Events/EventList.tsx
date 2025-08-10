import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Button,
    Dialog,
    IconButton,
    Chip,
    Tooltip,
    LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { TeamEvent, Member } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';
import EventForm from './EventForm';

interface EventListProps {
    events: TeamEvent[];
    teamId: string;
    permissions: TeamPermissions;
    onAddEvent: (eventData: Partial<TeamEvent>) => void;
    onEditEvent: (eventId: string, eventData: Partial<TeamEvent>) => void;
    onDeleteEvent: (eventId: string) => void;
    onAddParticipant: (eventId: string, member: Member) => void;
}

const EventList: React.FC<EventListProps> = ({
    events,
    teamId,
    permissions,
    onAddEvent,
    onEditEvent,
    onDeleteEvent,
    onAddParticipant
}) => {
    const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddClick = () => {
        setSelectedEvent(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (event: TeamEvent) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleSubmit = (eventData: Partial<TeamEvent>) => {
        if (selectedEvent) {
            onEditEvent(selectedEvent.id, eventData);
        } else {
            onAddEvent(eventData);
        }
        setIsDialogOpen(false);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getParticipationProgress = (event: TeamEvent) => {
        const current = event.participants.length;
        const max = event.maxParticipants;
        const percentage = (current / max) * 100;
        
        return {
            current,
            max,
            percentage,
            isFull: current >= max,
            hasMinimum: current >= event.minParticipants
        };
    };

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Eventos</Typography>
                {permissions.canManageEvents && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddClick}
                    >
                        Crear Evento
                    </Button>
                )}
            </Box>

            <Grid container spacing={3}>
                {events.map((event) => {
                    const participation = getParticipationProgress(event);
                    
                    return (
                        <Grid item xs={12} md={6} key={event.id}>
                            <Card>
                                {event.image && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={event.image}
                                        alt={event.title}
                                    />
                                )}
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="h6" gutterBottom>
                                            {event.title}
                                        </Typography>
                                        {permissions.canManageEvents && (
                                            <Box>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEditClick(event)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => onDeleteEvent(event.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        )}
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {formatDate(event.date)}
                                    </Typography>

                                    <Typography variant="body1" paragraph>
                                        {event.description}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        {event.price && (
                                            <Chip 
                                                label={`${event.price}€`}
                                                color="primary"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                        {event.requirePhotoConsent && (
                                            <Chip 
                                                label="Requiere consentimiento foto"
                                                color="info"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" gutterBottom>
                                            Participantes: {participation.current} / {participation.max}
                                        </Typography>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={participation.percentage}
                                            color={participation.hasMinimum ? "success" : "warning"}
                                            sx={{ mb: 1 }}
                                        />
                                        {!participation.isFull && (
                                            <Button
                                                startIcon={<PersonAddIcon />}
                                                variant="outlined"
                                                size="small"
                                                onClick={() => {/* Implementar lógica de inscripción */}}
                                                fullWidth
                                            >
                                                Inscribirse
                                            </Button>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <EventForm
                    event={selectedEvent || undefined}
                    teamId={teamId}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </Dialog>
        </>
    );
};

export default EventList;