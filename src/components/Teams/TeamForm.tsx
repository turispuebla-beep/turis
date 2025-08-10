import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Alert,
    Divider
} from '@mui/material';
import { Team, TeamCategory, TeamAdmin } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';

interface TeamFormProps {
    team?: Team;
    permissions: TeamPermissions;
    onSubmit: (teamData: Partial<Team>) => void;
    onCancel: () => void;
}

const categoryOptions: { value: TeamCategory; label: string }[] = [
    { value: 'prebenjamin', label: 'Prebenjamín' },
    { value: 'benjamin', label: 'Benjamín' },
    { value: 'alevin', label: 'Alevín' },
    { value: 'infantil', label: 'Infantil' },
    { value: 'aficionado', label: 'Aficionado' }
];

const TeamForm: React.FC<TeamFormProps> = ({ team, permissions, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: team?.name || '',
        category: team?.category || 'prebenjamin',
        admin: team?.admin || {
            name: '',
            email: '',
            phone: ''
        },
        coach: team?.coach || {
            name: '',
            phone: '',
            email: ''
        },
        contactInfo: team?.contactInfo || {
            email: '',
            phone: '',
            address: ''
        }
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name?.includes('.')) {
            const [section, field] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section as keyof typeof prev],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name as string]: value
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('El nombre del equipo es obligatorio');
            return;
        }

        if (permissions.canAssignAdmin && !formData.admin.email) {
            setError('El email del administrador es obligatorio');
            return;
        }

        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Typography variant="h6" gutterBottom>
                {team ? 'Editar Equipo' : 'Crear Nuevo Equipo'}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Nombre del Equipo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            name="category"
                            value={formData.category}
                            label="Categoría"
                            onChange={handleChange}
                        >
                            {categoryOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {permissions.canAssignAdmin && (
                    <>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>
                                Administrador del Equipo
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Nombre del Administrador"
                                name="admin.name"
                                value={formData.admin.name}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Email del Administrador"
                                name="admin.email"
                                type="email"
                                value={formData.admin.email}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Teléfono del Administrador"
                                name="admin.phone"
                                value={formData.admin.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                    </>
                )}

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                        Información del Entrenador
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Nombre del Entrenador"
                        name="coach.name"
                        value={formData.coach.name}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Teléfono del Entrenador"
                        name="coach.phone"
                        value={formData.coach.phone}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email del Entrenador"
                        name="coach.email"
                        type="email"
                        value={formData.coach.email}
                        onChange={handleChange}
                    />
                </Grid>

                {permissions.canManageContactInfo && (
                    <>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>
                                Información de Contacto del Equipo
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Email de Contacto"
                                name="contactInfo.email"
                                type="email"
                                value={formData.contactInfo.email}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Teléfono de Contacto"
                                name="contactInfo.phone"
                                value={formData.contactInfo.phone}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dirección"
                                name="contactInfo.address"
                                value={formData.contactInfo.address}
                                onChange={handleChange}
                            />
                        </Grid>
                    </>
                )}

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
                            {team ? 'Guardar Cambios' : 'Crear Equipo'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeamForm;