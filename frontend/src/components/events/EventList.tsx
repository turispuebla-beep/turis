import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Button,
    Box,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Event as EventIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { TeamEvent } from '../../types/team';
import { usePermissions } from '../../hooks/usePermissions';
import { eventService } from '../../services/eventService';

interface EventListProps {
    events: TeamEvent[];
    teamId: string;
    onEventUpdated: () => void;
}

export function EventList({ events, teamId, onEventUpdated }: EventListProps) {
    const navigate = useNavigate();
    const { hasPermission } = usePermissions();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TeamEvent | null>(null);
    const [error, setError] = useState<string | null>(null);

    const canManageEvents = hasPermission('create_event');

    const getEventTypeIcon = (type: string) => {
        switch (type) {
            case 'training':
                return <EventIcon />;
            case 'meeting':
                return <GroupIcon />;
            default:
                return <EventIcon />;
        }
    };

    const getEventStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (status) {
            case 'scheduled':
                return 'info';
            case 'in_progress':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleDeleteClick = (event: TeamEvent) => {
        setSelectedEvent(event);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEvent) return;

        try {
            await eventService.deleteEvent(selectedEvent.id);
            setDeleteDialogOpen(false);
            setSelectedEvent(null);
            onEventUpdated();
        } catch (err) {
            setError('Error al eliminar el evento. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Eventos</Typography>
                {canManageEvents && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/teams/${teamId}/events/new`)}
                    >
                        Nuevo Evento
                    </Button>
                )}
            </Box>

            <List>
                {events.map(event => (
                    <ListItem key={event.id}>
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                    {getEventTypeIcon(event.type)}
                                    <Typography>{event.title}</Typography>
                                </Box>
                            }
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        {new Date(event.date).toLocaleDateString()} - {event.location}
                                    </Typography>
                                    <br />
                                    <Chip
                                        size="small"
                                        label={event.status}
                                        color={getEventStatusColor(event.status)}
                                        sx={{ mt: 1 }}
                                    />
                                    {event.mandatory && (
                                        <Chip
                                            size="small"
                                            label="Obligatorio"
                                            color="error"
                                            sx={{ ml: 1, mt: 1 }}
                                        />
                                    )}
                                </>
                            }
                        />
                        {canManageEvents && (
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => navigate(`/teams/${teamId}/events/${event.id}/edit`)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => handleDeleteClick(event)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                ))}
            </List>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que quieres eliminar el evento "{selectedEvent?.title}"?
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}