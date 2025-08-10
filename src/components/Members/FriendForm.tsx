import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Alert
} from '@mui/material';
import { Friend } from '../../types/team';

interface FriendFormProps {
    friend?: Friend;
    teamId: string;
    onSubmit: (friendData: Partial<Friend>) => void;
    onCancel: () => void;
}

const FriendForm: React.FC<FriendFormProps> = ({ friend, teamId, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: friend?.name || '',
        surname: friend?.surname || '',
        dni: friend?.dni || '',
        phone: friend?.phone || '',
        email: friend?.email || ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar campos obligatorios
        if (!formData.name.trim() || !formData.surname.trim() || !formData.phone.trim()) {
            setError('Nombre, apellidos y teléfono son obligatorios');
            return;
        }

        const friendData: Partial<Friend> = {
            ...formData,
            teamId
        };

        onSubmit(friendData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Typography variant="h6" gutterBottom>
                {friend ? 'Editar Amigo del Club' : 'Nuevo Amigo del Club'}
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
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
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
                            {friend ? 'Guardar Cambios' : 'Registrar Amigo'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FriendForm;