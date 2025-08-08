import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Alert,
    Grid,
    FormHelperText
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

interface NotificationFormProps {
    onSuccess?: () => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({ onSuccess }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        target: '',
        category: '',
        teamId: user?.teamId || '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const targetOptions = user?.role === 'admin' 
        ? [
            { value: 'all', label: 'Todos los usuarios' },
            { value: 'all_players', label: 'Todos los jugadores/as' },
            { value: 'category_players', label: 'Jugadores/as por categoría' },
            { value: 'all_members', label: 'Todos los socios/as' },
            { value: 'team_members', label: 'Socios/as de un equipo' },
            { value: 'team_all', label: 'Todos los usuarios de un equipo' }
        ]
        : [
            { value: 'team_members', label: 'Socios/as de mi equipo' },
            { value: 'team_all', label: 'Todos los usuarios de mi equipo' }
        ];

    const categoryOptions = [
        { value: 'prebenjamin', label: 'Pre-benjamín' },
        { value: 'benjamin', label: 'Benjamín' },
        { value: 'alevin', label: 'Alevín' },
        { value: 'infantil', label: 'Infantil' },
        { value: 'aficionado', label: 'Aficionado' }
    ];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
        setError(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/notifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al enviar la notificación');
            }

            setSuccess(true);
            setFormData({
                title: '',
                body: '',
                target: '',
                category: '',
                teamId: user?.teamId || '',
                imageUrl: ''
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const showCategorySelect = formData.target === 'category_players';
    const showTeamSelect = ['team_members', 'team_all'].includes(formData.target) && user?.role === 'admin';

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Enviar Notificación
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Notificación enviada correctamente
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Título"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Mensaje"
                            name="body"
                            value={formData.body}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Destinatarios</InputLabel>
                            <Select
                                name="target"
                                value={formData.target}
                                onChange={handleInputChange}
                                label="Destinatarios"
                            >
                                {targetOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                Seleccione a quién enviar la notificación
                            </FormHelperText>
                        </FormControl>
                    </Grid>

                    {showCategorySelect && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Categoría</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    label="Categoría"
                                >
                                    {categoryOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    {showTeamSelect && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Equipo</InputLabel>
                                <Select
                                    name="teamId"
                                    value={formData.teamId}
                                    onChange={handleInputChange}
                                    label="Equipo"
                                >
                                    {/* Aquí deberías cargar la lista de equipos */}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="URL de imagen (opcional)"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            helperText="URL de una imagen para mostrar en la notificación"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Enviando...' : 'Enviar Notificación'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default NotificationForm;