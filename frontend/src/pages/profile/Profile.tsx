import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Avatar,
    Button,
    TextField,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    PhotoCamera,
    Notifications,
    Security,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export function Profile() {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        matchReminders: true,
        eventReminders: true,
        newsUpdates: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (setting: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: e.target.checked
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // TODO: Implementar subida de imagen de perfil
        console.log('Subir imagen:', file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // TODO: Implementar actualización de perfil
            console.log('Actualizar perfil:', formData);
            setEditMode(false);
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            setError('Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            // TODO: Implementar eliminación de cuenta
            console.log('Eliminar cuenta');
            logout();
        } catch (error) {
            console.error('Error al eliminar cuenta:', error);
            setError('Error al eliminar la cuenta');
        }
    };

    if (!user) {
        return (
            <Container>
                <Typography color="error">
                    Usuario no encontrado
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" component="h1">
                        Perfil
                    </Typography>
                    <Button
                        startIcon={editMode ? null : <EditIcon />}
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? 'Cancelar' : 'Editar'}
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        {/* Información básica */}
                        <Grid item xs={12} md={4}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar
                                    src={user.imageUrl}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                />
                                {editMode && (
                                    <Box>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="profile-image-upload"
                                            type="file"
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="profile-image-upload">
                                            <IconButton
                                                color="primary"
                                                component="span"
                                                aria-label="cambiar foto de perfil"
                                            >
                                                <PhotoCamera />
                                            </IconButton>
                                        </label>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        type="email"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Cambio de contraseña */}
                        {editMode && (
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Cambiar contraseña
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Contraseña actual"
                                            name="currentPassword"
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Nueva contraseña"
                                            name="newPassword"
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Confirmar nueva contraseña"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}

                        {/* Notificaciones */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Notificaciones
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Notificaciones por email"
                                        secondary="Recibir actualizaciones por correo electrónico"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={handleNotificationChange('emailNotifications')}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Notificaciones push"
                                        secondary="Recibir notificaciones en el navegador"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={notificationSettings.pushNotifications}
                                            onChange={handleNotificationChange('pushNotifications')}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Recordatorios de partidos"
                                        secondary="Recibir recordatorios antes de los partidos"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={notificationSettings.matchReminders}
                                            onChange={handleNotificationChange('matchReminders')}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Recordatorios de eventos"
                                        secondary="Recibir recordatorios antes de los eventos"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={notificationSettings.eventReminders}
                                            onChange={handleNotificationChange('eventReminders')}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Actualizaciones de noticias"
                                        secondary="Recibir notificaciones de nuevas noticias"
                                    />
                                    <ListItemSecondaryAction>
                                        <Switch
                                            edge="end"
                                            checked={notificationSettings.newsUpdates}
                                            onChange={handleNotificationChange('newsUpdates')}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                        </Grid>

                        {/* Botones de acción */}
                        {editMode && (
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Button
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleDeleteAccount}
                                    >
                                        Eliminar cuenta
                                    </Button>
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            onClick={() => setEditMode(false)}
                                            sx={{ mr: 1 }}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading}
                                        >
                                            {loading ? 'Guardando...' : 'Guardar cambios'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}