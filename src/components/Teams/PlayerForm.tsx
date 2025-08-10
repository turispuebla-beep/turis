import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Checkbox,
    FormControlLabel,
    Divider,
    Alert
} from '@mui/material';
import { Player } from '../../types/team';

interface PlayerFormProps {
    player?: Player;
    onSubmit: (playerData: Partial<Player>) => void;
    onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: player?.name || '',
        surname: player?.surname || '',
        dni: player?.dni || '',
        phone: player?.phone || '',
        address: player?.address || '',
        birthDate: player?.birthDate || '',
        jerseyNumber: player?.jerseyNumber || '',
        photoConsent: player?.photoConsent || false,
        teamConsent: player?.teamConsent || false,
        isMinor: false,
        guardianInfo: player?.guardianInfo || [
            {
                name: '',
                dni: '',
                phone: '',
                address: '',
                email: ''
            }
        ]
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGuardianChange = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            guardianInfo: prev.guardianInfo.map((guardian, i) => 
                i === index ? { ...guardian, [field]: value } : guardian
            )
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name || !formData.surname || !formData.dni || !formData.phone || !formData.birthDate) {
            setError('Los campos nombre, apellidos, DNI, teléfono y fecha de nacimiento son obligatorios');
            return false;
        }

        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isMinor = age < 18;

        if (isMinor && (!formData.guardianInfo[0].name || !formData.guardianInfo[0].dni || 
            !formData.guardianInfo[0].phone || !formData.guardianInfo[0].email)) {
            setError('Para menores de edad, los datos del tutor son obligatorios');
            return false;
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();

        const playerData = {
            ...formData,
            guardianInfo: age < 18 ? formData.guardianInfo : undefined
        };

        onSubmit(playerData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Typography variant="h6" gutterBottom>
                {player ? 'Editar Jugador' : 'Añadir Nuevo Jugador'}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Apellidos"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="DNI"
                        name="dni"
                        value={formData.dni}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Teléfono"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Dirección"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        label="Fecha de Nacimiento"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Número de Camiseta"
                        name="jerseyNumber"
                        type="number"
                        value={formData.jerseyNumber}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.photoConsent}
                                onChange={handleChange}
                                name="photoConsent"
                            />
                        }
                        label="Consentimiento para fotos"
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.teamConsent}
                                onChange={handleChange}
                                name="teamConsent"
                            />
                        }
                        label="Consentimiento para pertenecer al equipo"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                        Información del Tutor (para menores de edad)
                    </Typography>
                </Grid>

                {formData.guardianInfo.map((guardian, index) => (
                    <React.Fragment key={index}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombre del Tutor"
                                value={guardian.name}
                                onChange={(e) => handleGuardianChange(index, 'name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="DNI del Tutor"
                                value={guardian.dni}
                                onChange={(e) => handleGuardianChange(index, 'dni', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Teléfono del Tutor"
                                value={guardian.phone}
                                onChange={(e) => handleGuardianChange(index, 'phone', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email del Tutor"
                                type="email"
                                value={guardian.email}
                                onChange={(e) => handleGuardianChange(index, 'email', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dirección del Tutor"
                                value={guardian.address}
                                onChange={(e) => handleGuardianChange(index, 'address', e.target.value)}
                            />
                        </Grid>
                    </React.Fragment>
                ))}

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
                            {player ? 'Guardar Cambios' : 'Añadir Jugador'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PlayerForm;