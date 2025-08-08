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
    IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Team } from '../../types/team';
import { createTeam, updateTeam, getTeamById } from '../../services/teamService';

export function TeamForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<Team>>({
        name: '',
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (id) loadTeam(id);
    }, [id]);

    const loadTeam = async (teamId: string) => {
        try {
            const data = await getTeamById(teamId);
            setFormData({
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl
            });
        } catch (error) {
            console.error('Error al cargar equipo:', error);
            setError('Error al cargar los datos del equipo');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Implementar subida de imágenes
        console.log('Subir imagen:', file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (id) {
                await updateTeam(id, formData);
            } else {
                await createTeam(formData);
            }
            navigate('/teams');
        } catch (error) {
            console.error('Error al guardar equipo:', error);
            setError('Error al guardar los datos del equipo');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {id ? 'Editar Equipo' : 'Nuevo Equipo'}
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
                                required
                                fullWidth
                                label="Nombre del equipo"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
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
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center">
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="image-upload">
                                    <IconButton color="primary" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                </label>
                                <Typography variant="body2" color="text.secondary">
                                    {formData.imageUrl ? 'Cambiar imagen' : 'Subir imagen'}
                                </Typography>
                            </Box>
                            {formData.imageUrl && (
                                <Box mt={2}>
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                </Box>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/teams')}
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