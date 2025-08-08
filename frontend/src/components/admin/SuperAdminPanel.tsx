import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Tabs,
    Tab,
    TextField,
    Switch,
    FormControlLabel
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Refresh as RefreshIcon,
    Block as BlockIcon,
    History as HistoryIcon,
    SupervisorAccount as SupervisorAccountIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { AdminGuard } from './AdminGuard';
import { useRealtime } from '../../hooks/useRealtime';
import { sharedRealtimeService } from '../../services/sharedRealtimeService';
import { SUPER_ADMIN_EMAIL } from '../../types/auth';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export function SuperAdminPanel() {
    const [tabValue, setTabValue] = useState(0);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        action: () => void;
    }>({
        open: false,
        title: '',
        message: '',
        action: () => {}
    });
    const [historyDialog, setHistoryDialog] = useState<{
        open: boolean;
        title: string;
        data: any[];
    }>({
        open: false,
        title: '',
        data: []
    });

    const { isConnected, lastChange, broadcastChange } = useRealtime({
        onChange: (change) => {
            // Actualizar la interfaz cuando hay cambios
            loadData();
        }
    });

    const [data, setData] = useState({
        teams: [],
        users: [],
        admins: [],
        changes: [],
        settings: {}
    });

    const loadData = async () => {
        try {
            // Cargar todos los datos necesarios
            const [teams, users, admins, changes, settings] = await Promise.all([
                fetch('/api/teams').then(r => r.json()),
                fetch('/api/users').then(r => r.json()),
                fetch('/api/admins').then(r => r.json()),
                sharedRealtimeService.getChangeHistory(),
                fetch('/api/settings').then(r => r.json())
            ]);

            setData({ teams, users, admins, changes, settings });
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = (item: any, type: string) => {
        setConfirmDialog({
            open: true,
            title: `Eliminar ${type}`,
            message: `¿Estás seguro de que deseas eliminar este ${type}? Esta acción no se puede deshacer.`,
            action: async () => {
                try {
                    await fetch(`/api/${type}s/${item.id}`, { method: 'DELETE' });
                    await broadcastChange({
                        type: `${type}_update` as any,
                        entityId: item.id,
                        changes: { deleted: true }
                    });
                    loadData();
                } catch (error) {
                    console.error(`Error eliminando ${type}:`, error);
                }
                setConfirmDialog({ ...confirmDialog, open: false });
            }
        });
    };

    const handleViewHistory = async (item: any, type: string) => {
        try {
            const history = await sharedRealtimeService.getChangeHistory({
                entityId: item.id,
                types: [`${type}_update`]
            });
            setHistoryDialog({
                open: true,
                title: `Historial de cambios - ${type}`,
                data: history
            });
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    };

    return (
        <AdminGuard>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Panel de Control - Administrador Principal
                </Typography>

                {!isConnected && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Sin conexión en tiempo real. Los cambios se sincronizarán cuando se restablezca la conexión.
                    </Alert>
                )}

                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
                    <Tab icon={<SupervisorAccountIcon />} label="Equipos y Usuarios" />
                    <Tab icon={<SecurityIcon />} label="Permisos y Roles" />
                    <Tab icon={<HistoryIcon />} label="Historial de Cambios" />
                    <Tab icon={<SettingsIcon />} label="Configuración" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Equipos
                                    </Typography>
                                    <List>
                                        {data.teams.map((team: any) => (
                                            <ListItem key={team.id}>
                                                <ListItemText
                                                    primary={team.name}
                                                    secondary={`${team.players?.length || 0} jugadores`}
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        onClick={() => handleViewHistory(team, 'team')}
                                                    >
                                                        <HistoryIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => handleDelete(team, 'team')}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Usuarios
                                    </Typography>
                                    <List>
                                        {data.users.map((user: any) => (
                                            <ListItem key={user.id}>
                                                <ListItemText
                                                    primary={user.email}
                                                    secondary={`Rol: ${user.role}`}
                                                />
                                                <ListItemSecondaryAction>
                                                    {user.email !== SUPER_ADMIN_EMAIL && (
                                                        <>
                                                            <IconButton
                                                                onClick={() => handleViewHistory(user, 'user')}
                                                            >
                                                                <HistoryIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => handleDelete(user, 'user')}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </>
                                                    )}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Administradores Secundarios
                            </Typography>
                            <List>
                                {data.admins.map((admin: any) => (
                                    <ListItem key={admin.id}>
                                        <ListItemText
                                            primary={admin.email}
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        Equipo: {admin.teamName}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Permisos: {admin.permissions.join(', ')}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                onClick={() => handleViewHistory(admin, 'admin')}
                                            >
                                                <HistoryIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDelete(admin, 'admin')}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Últimos Cambios
                            </Typography>
                            <List>
                                {data.changes.map((change: any) => (
                                    <ListItem key={change.id}>
                                        <ListItemText
                                            primary={
                                                <Typography>
                                                    {change.type.replace('_', ' ')} - {new Date(change.timestamp).toLocaleString()}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box>
                                                    <Typography variant="body2">
                                                        Por: {change.author.name} ({change.author.role})
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Plataforma: {change.deviceInfo.platform}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    setConfirmDialog({
                                                        open: true,
                                                        title: 'Revertir Cambio',
                                                        message: '¿Estás seguro de que deseas revertir este cambio?',
                                                        action: async () => {
                                                            await sharedRealtimeService.revertChange(change.id);
                                                            loadData();
                                                            setConfirmDialog({ ...confirmDialog, open: false });
                                                        }
                                                    });
                                                }}
                                            >
                                                Revertir
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </TabPanel>

                <TabPanel value={tabValue} index={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Configuración Global
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.settings.maintenanceMode}
                                                onChange={async (e) => {
                                                    await fetch('/api/settings/maintenance', {
                                                        method: 'PUT',
                                                        body: JSON.stringify({
                                                            enabled: e.target.checked
                                                        })
                                                    });
                                                    loadData();
                                                }}
                                            />
                                        }
                                        label="Modo Mantenimiento"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.settings.allowNewRegistrations}
                                                onChange={async (e) => {
                                                    await fetch('/api/settings/registrations', {
                                                        method: 'PUT',
                                                        body: JSON.stringify({
                                                            enabled: e.target.checked
                                                        })
                                                    });
                                                    loadData();
                                                }}
                                            />
                                        }
                                        label="Permitir Nuevos Registros"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            setConfirmDialog({
                                                open: true,
                                                title: 'Forzar Sincronización',
                                                message: '¿Estás seguro de que deseas forzar una sincronización completa?',
                                                action: async () => {
                                                    await sharedRealtimeService.forceSyncNow();
                                                    loadData();
                                                    setConfirmDialog({ ...confirmDialog, open: false });
                                                }
                                            });
                                        }}
                                    >
                                        Forzar Sincronización
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </TabPanel>

                {/* Diálogo de confirmación */}
                <Dialog
                    open={confirmDialog.open}
                    onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                >
                    <DialogTitle>{confirmDialog.title}</DialogTitle>
                    <DialogContent>
                        <Typography>{confirmDialog.message}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
                            Cancelar
                        </Button>
                        <Button onClick={confirmDialog.action} color="error">
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Diálogo de historial */}
                <Dialog
                    open={historyDialog.open}
                    onClose={() => setHistoryDialog({ ...historyDialog, open: false })}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>{historyDialog.title}</DialogTitle>
                    <DialogContent>
                        <List>
                            {historyDialog.data.map((item: any) => (
                                <ListItem key={item.id}>
                                    <ListItemText
                                        primary={new Date(item.timestamp).toLocaleString()}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2">
                                                    Cambios: {JSON.stringify(item.changes)}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Por: {item.author.name}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setHistoryDialog({ ...historyDialog, open: false })}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminGuard>
    );
}