import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { teamIdService } from '../../services/teamIdService';

interface TeamInfo {
    name: string;
    category: string;
    url: string;
}

export function RegisterWithTeamId() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        teamId: '',
        userType: '',
        name: '',
        surname: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);

    // Verificar ID del equipo
    const handleVerifyTeamId = async () => {
        try {
            setError(null);
            const result = await teamIdService.verifyTeamId(formData.teamId);
            if (result.valid && result.teamInfo) {
                setTeamInfo(result.teamInfo);
            } else {
                setError('ID de equipo no válido');
                setTeamInfo(null);
            }
        } catch (err) {
            setError('Error verificando ID de equipo');
            setTeamInfo(null);
        }
    };

    // Cuando el usuario escribe el ID
    const handleTeamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, teamId: value }));
        if (value.length >= 6) { // Verificar cuando tenga suficientes caracteres
            handleVerifyTeamId();
        } else {
            setTeamInfo(null);
        }
    };

    // Registrar usuario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (!formData.userType) {
            setError('Por favor selecciona tu tipo de usuario');
            return;
        }

        try {
            const response = await fetch('/api/auth/register-team-member', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    teamId: formData.teamId,
                    userType: formData.userType,
                    name: formData.name,
                    surname: formData.surname
                })
            });

            if (response.ok) {
                navigate('/login', { 
                    state: { 
                        message: 'Registro exitoso. Por favor inicia sesión.' 
                    } 
                });
            } else {
                const data = await response.json();
                setError(data.message || 'Error en el registro');
            }
        } catch (err) {
            setError('Error en el registro');
        }
    };

    return (
        <Box sx={{ 
            maxWidth: 600, 
            mx: 'auto', 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2 
        }}>
            <Typography variant="h4" gutterBottom>
                Registro en Equipo
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            1. Identifica tu equipo
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="ID del Equipo"
                            value={formData.teamId}
                            onChange={handleTeamIdChange}
                            margin="normal"
                            required
                            helperText="Introduce el ID proporcionado por tu equipo"
                        />

                        {teamInfo && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                Equipo encontrado: {teamInfo.name} ({teamInfo.category})
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {teamInfo && (
                    <>
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    2. Información Personal
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    margin="normal"
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Apellidos"
                                    value={formData.surname}
                                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                    margin="normal"
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    margin="normal"
                                    required
                                />

                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Tipo de Usuario</InputLabel>
                                    <Select
                                        value={formData.userType}
                                        label="Tipo de Usuario"
                                        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                    >
                                        <MenuItem value="socio">Socio</MenuItem>
                                        <MenuItem value="amigo">Amigo del Club</MenuItem>
                                        <MenuItem value="familiar">Familiar de Jugador</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    3. Credenciales
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    margin="normal"
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Confirmar Contraseña"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    margin="normal"
                                    required
                                />
                            </CardContent>
                        </Card>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                        >
                            Registrarse
                        </Button>
                    </>
                )}
            </form>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                ¿Ya tienes una cuenta? 
                <Button color="primary" onClick={() => navigate('/login')}>
                    Iniciar Sesión
                </Button>
            </Typography>
        </Box>
    );
}