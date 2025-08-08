import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Switch,
    Button,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Schedule as ScheduleIcon,
    Block as BlockIcon
} from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { notificationPermissionService } from '../../services/notificationPermissionService';
import type { NotificationPermission, NotificationPreferences } from '../../types/notification';
import { usePermissions } from '../../hooks/usePermissions';

interface NotificationPermissionsProps {
    teamId: string;
    userId: string;
    userRole: string;
}

export function NotificationPermissions({ teamId, userId, userRole }: NotificationPermissionsProps) {
    const { isSuperAdmin } = usePermissions();
    const [permissions, setPermissions] = useState<NotificationPreferences | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [openRestrictions, setOpenRestrictions] = useState(false);

    useEffect(() => {
        loadPermissions();
    }, [teamId, userId]);

    const loadPermissions = async () => {
        try {
            setLoading(true);
            setError(null);
            const userPermissions = await notificationPermissionService.getUserPermissions(
                teamId,
                userId
            );
            setPermissions(userPermissions);
        } catch (err) {
            setError('Error al cargar los permisos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = async (
        type: string,
        scope: string,
        checked: boolean
    ) => {
        if (!permissions) return;

        try {
            const updatedPermissions = permissions.permissions.map(permission => {
                if (permission.type === type) {
                    return {
                        ...permission,
                        scope: checked
                            ? [...permission.scope, scope]
                            : permission.scope.filter(s => s !== scope)
                    };
                }
                return permission;
            });

            const updated = await notificationPermissionService.updateUserPermissions(
                teamId,
                userId,
                updatedPermissions
            );

            setPermissions(updated);
            setSuccess('Permisos actualizados correctamente');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Error al actualizar los permisos');
            console.error(err);
        }
    };

    const handleApprovalRequirementChange = async (
        type: string,
        requireApproval: boolean
    ) => {
        if (!permissions) return;

        try {
            const updatedPermissions = permissions.permissions.map(permission => {
                if (permission.type === type) {
                    return {
                        ...permission,
                        requireApproval
                    };
                }
                return permission;
            });

            const updated = await notificationPermissionService.updateUserPermissions(
                teamId,
                userId,
                updatedPermissions
            );

            setPermissions(updated);
            setSuccess('Requisitos de aprobación actualizados');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Error al actualizar los requisitos de aprobación');
            console.error(err);
        }
    };

    const handleUpdateRestrictions = async (restrictions: NotificationPreferences['restrictions']) => {
        try {
            const updated = await notificationPermissionService.updateNotificationRestrictions(
                teamId,
                userId,
                restrictions
            );
            setPermissions(updated);
            setSuccess('Restricciones actualizadas correctamente');
            setOpenRestrictions(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Error al actualizar las restricciones');
            console.error(err);
        }
    };

    if (loading) {
        return <Typography>Cargando permisos...</Typography>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!permissions) {
        return <Alert severity="info">No hay permisos configurados</Alert>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Permisos de Notificaciones
            </Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tipos de Notificaciones
                            </Typography>
                            <List>
                                {permissions.permissions.map((permission) => (
                                    <ListItem key={permission.type} divider>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <NotificationsIcon />
                                                    <Typography>
                                                        {permission.type.replace(/_/g, ' ')}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={permission.scope.includes('all_team')}
                                                                onChange={(e) =>
                                                                    handlePermissionChange(
                                                                        permission.type,
                                                                        'all_team',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label="Todo el equipo"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={permission.scope.includes('players_only')}
                                                                onChange={(e) =>
                                                                    handlePermissionChange(
                                                                        permission.type,
                                                                        'players_only',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label="Solo jugadores"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={permission.scope.includes('staff_only')}
                                                                onChange={(e) =>
                                                                    handlePermissionChange(
                                                                        permission.type,
                                                                        'staff_only',
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                        }
                                                        label="Solo staff"
                                                    />
                                                </FormGroup>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={permission.requireApproval}
                                                        onChange={(e) =>
                                                            handleApprovalRequirementChange(
                                                                permission.type,
                                                                e.target.checked
                                                            )
                                                        }
                                                        disabled={!isSuperAdmin()}
                                                    />
                                                }
                                                label="Requiere aprobación"
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Restricciones
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<ScheduleIcon />}
                                    onClick={() => setOpenRestrictions(true)}
                                >
                                    Configurar
                                </Button>
                            </Box>

                            {permissions.restrictions && (
                                <>
                                    {permissions.restrictions.quietHours && (
                                        <Box mb={2}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Horario silencioso:
                                            </Typography>
                                            <Chip
                                                icon={<BlockIcon />}
                                                label={`${permissions.restrictions.quietHours.start} - ${permissions.restrictions.quietHours.end}`}
                                            />
                                        </Box>
                                    )}

                                    {permissions.restrictions.maxNotifications && (
                                        <Box>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Límites diarios:
                                            </Typography>
                                            <Typography>
                                                {permissions.restrictions.maxNotifications.daily} notificaciones/día
                                            </Typography>
                                            <Typography>
                                                {permissions.restrictions.maxNotifications.weekly} notificaciones/semana
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog
                open={openRestrictions}
                onClose={() => setOpenRestrictions(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Configurar Restricciones</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Horario silencioso
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TimePicker
                                    label="Inicio"
                                    value={permissions.restrictions?.quietHours?.start || null}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            handleUpdateRestrictions({
                                                ...permissions.restrictions,
                                                quietHours: {
                                                    ...permissions.restrictions?.quietHours,
                                                    start: newValue.toString()
                                                }
                                            });
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TimePicker
                                    label="Fin"
                                    value={permissions.restrictions?.quietHours?.end || null}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            handleUpdateRestrictions({
                                                ...permissions.restrictions,
                                                quietHours: {
                                                    ...permissions.restrictions?.quietHours,
                                                    end: newValue.toString()
                                                }
                                            });
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                            Límites de notificaciones
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    type="number"
                                    label="Máximo diario"
                                    value={permissions.restrictions?.maxNotifications?.daily || ''}
                                    onChange={(e) =>
                                        handleUpdateRestrictions({
                                            ...permissions.restrictions,
                                            maxNotifications: {
                                                ...permissions.restrictions?.maxNotifications,
                                                daily: parseInt(e.target.value)
                                            }
                                        })
                                    }
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    type="number"
                                    label="Máximo semanal"
                                    value={permissions.restrictions?.maxNotifications?.weekly || ''}
                                    onChange={(e) =>
                                        handleUpdateRestrictions({
                                            ...permissions.restrictions,
                                            maxNotifications: {
                                                ...permissions.restrictions?.maxNotifications,
                                                weekly: parseInt(e.target.value)
                                            }
                                        })
                                    }
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRestrictions(false)}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}