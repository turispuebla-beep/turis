import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Alert
} from '@mui/material';
import { Member } from '../../types/team';

interface MemberFormProps {
    member?: Member;
    teamId: string;
    onSubmit: (memberData: Partial<Member>) => void;
    onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, teamId, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: member?.name || '',
        surname: member?.surname || '',
        dni: member?.dni || '',
        phone: member?.phone || '',
        email: member?.email || '',
        address: member?.address || '',
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

        const memberData: Partial<Member> = {
            ...formData,
            teamId,
            status: 'pending',
            registrationDate: new Date().toISOString()
        };

        onSubmit(memberData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Typography variant="h6" gutterBottom>
                {member ? 'Editar Socio' : 'Nuevo Socio'}
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
                    <TextField
                        fullWidth
                        label="Dirección"
                        name="address"
                        value={formData.address}
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
                            {member ? 'Guardar Cambios' : 'Registrar Socio'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MemberForm;