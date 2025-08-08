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
    IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { Player, PlayerPosition } from '../../types/team';
import { addPlayer, updatePlayer } from '../../services/teamService';

export function PlayerForm() {
    const { teamId, playerId } = useParams<{ teamId: string; playerId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<Player>>({
        name: '',
        position: 'MIDFIELDER',
        number: undefined,
        imageUrl: '',
        stats: {
            gamesPlayed: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0
        }
    });

    useEffect(() => {
        if (playerId) {
            // TODO: Implementar carga de jugador existente
        }
    }, [playerId]);

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

    const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            stats: {
                ...prev.stats!,
                [name]: parseInt(value) || 0
            }
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
        if (!teamId) return;

        setError('');
        setLoading(true);

        try {
            if (playerId) {
                await updatePlayer(teamId, playerId, formData);
            } else {
                await addPlayer(teamId, formData);
            }
            navigate(`/teams/${teamId}`);
        } catch (error) {
            console.error('Error al guardar jugador:', error);
            setError('Error al guardar los datos del jugador');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {playerId ? 'Editar Jugador' : 'Nuevo Jugador'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Box>
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
                                </Box>
                                {formData.imageUrl && (
                                    <Box
                                        component="img"
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            objectFit: 'cover',
                                            borderRadius: 1
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                            <TextField
                                fullWidth
                                label="Nombre completo"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Número"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                InputProps={{ inputProps: { min: 1, max: 99 } }}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Posición</InputLabel>
                                <Select
                                    name="position"
                                    value={formData.position}
                                    onChange={handleSelectChange}
                                    required
                                >
                                    <MenuItem value="GOALKEEPER">Portero</MenuItem>
                                    <MenuItem value="DEFENDER">Defensa</MenuItem>
                                    <MenuItem value="MIDFIELDER">Centrocampista</MenuItem>
                                    <MenuItem value="FORWARD">Delantero</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Estadísticas
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Partidos jugados"
                                        name="gamesPlayed"
                                        value={formData.stats?.gamesPlayed}
                                        onChange={handleStatsChange}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Goles"
                                        name="goals"
                                        value={formData.stats?.goals}
                                        onChange={handleStatsChange}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Asistencias"
                                        name="assists"
                                        value={formData.stats?.assists}
                                        onChange={handleStatsChange}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Tarjetas amarillas"
                                        name="yellowCards"
                                        value={formData.stats?.yellowCards}
                                        onChange={handleStatsChange}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Tarjetas rojas"
                                        name="redCards"
                                        value={formData.stats?.redCards}
                                        onChange={handleStatsChange}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                            </Grid>
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