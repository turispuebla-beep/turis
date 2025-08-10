import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Alert,
    FormControlLabel,
    Checkbox,
    InputAdornment
} from '@mui/material';
import { TeamEvent } from '../../types/team';

interface EventFormProps {
    event?: TeamEvent;
    teamId: string;
    onSubmit: (eventData: Partial<TeamEvent>) => void;
    onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, teamId, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: event?.title || '',
        description: event?.description || '',
        date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
        price: event?.price?.toString() || '',
        minParticipants: event?.minParticipants?.toString() || '',
        maxParticipants: event?.maxParticipants?.toString() || '',
        requirePhotoConsent: event?.requirePhotoConsent || false,
        image: event?.image || ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar campos obligatorios
        if (!formData.title.trim() || !formData.description.trim() || !formData.date) {
            setError('Título, descripción y fecha son obligatorios');
            return;
        }

        // Validar números
        const price = parseFloat(formData.price);
        const minParticipants = parseInt(formData.minParticipants);
        const maxParticipants = parseInt(formData.maxParticipants);

        if (isNaN(minParticipants) || isNaN(maxParticipants) || minParticipants > maxParticipants) {
            setError('El número mínimo de participantes debe ser menor o igual al máximo');
            return;
        }

        const eventData: Partial<TeamEvent> = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            price: isNaN(price) ? undefined : price,
            minParticipants,
            maxParticipants,
            requirePhotoConsent: formData.requirePhotoConsent,
            image: formData.image || undefined,
            teamId,
            participants: []
        };

        onSubmit(eventData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Typography variant="h6" gutterBottom>
                {event ? 'Editar Evento' : 'Nuevo Evento'}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Título del Evento"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Descripción"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Fecha del Evento"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Precio"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Mínimo de Participantes"
                        name="minParticipants"
                        type="number"
                        value={formData.minParticipants}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Máximo de Participantes"
                        name="maxParticipants"
                        type="number"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="URL de la Imagen"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        helperText="Añade una URL de imagen para el evento"
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.requirePhotoConsent}
                                onChange={handleChange}
                                name="requirePhotoConsent"
                            />
                        }
                        label="Requiere consentimiento para fotos"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {event ? 'Guardar Cambios' : 'Crear Evento'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default EventForm;