import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Alert,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Block as BlockIcon,
    History as HistoryIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';
import { teamIdService } from '../../services/teamIdService';
import { CATEGORY_CONFIGS, TeamCategory } from '../../types/teamCategories';
import { AdminGuard } from './AdminGuard';

export function TeamIdManager() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [formData, setFormData] = useState({
        teamName: '',
        category: '',
        adminEmail: ''
    });
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        loadTeams();
        loadStats();
    }, []);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const teams = await teamIdService.getAllTeamIds();
            setTeams(teams);
        } catch (err) {
            setError('Error cargando equipos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const stats = await teamIdService.getIdStats();
            setStats(stats);
        } catch (err) {
            console.error('Error cargando estadísticas:', err);
        }
    };

    const handleGenerateId = async () => {
        try {
            setError(null);
            const newTeam = await teamIdService.generateTeamId(formData);
            setTeams([...teams, newTeam]);
            setSuccess('ID de equipo generado correctamente');
            setOpenDialog(false);
            
            // Copiar al portapapeles la información importante
            const info = `
                Equipo: ${formData.teamName}
                ID: ${newTeam.id}
                URL: ${window.location.origin}/equipo/${newTeam.urlSegment}
                Código de acceso: ${newTeam.accessCode}
            `.trim();
            await navigator.clipboard.writeText(info);
            
        } catch (err) {
            setError('Error generando ID de equipo');
            console.error(err);
        }
    };

    const handleRevokeId = async (teamId: string) => {
        if (!window.confirm('¿Estás seguro de que deseas revocar este ID?')) return;

        try {
            await teamIdService.revokeTeamId(teamId, 'Revocado por administrador');
            await loadTeams();
            setSuccess('ID de equipo revocado correctamente');
        } catch (err) {
            setError('Error revocando ID de equipo');
            console.error(err);
        }
    };

    const handleViewHistory = async (teamId: string) => {
        try {
            const history = await teamIdService.getIdHistory(teamId);
            setSelectedTeam({ id: teamId, history });
            setOpenHistoryDialog(true);
        } catch (err) {
            setError('Error cargando historial');
            console.error(err);
        }
    };

    const handleGenerateNewAccessCode = async (teamId: string) => {
        try {
            const { accessCode, expiresAt } = await teamIdService.generateNewAccessCode(teamId);
            await loadTeams();
            setSuccess('Nuevo código de acceso generado');
            
            // Copiar al portapapeles
            await navigator.clipboard.writeText(accessCode);
        } catch (err) {
            setError('Error generando nuevo código de acceso');
            console.error(err);
        }
    };

    return (
        <AdminGuard>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Gestión de IDs de Equipo
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {/* Estadísticas */}
                {stats && (
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Total Equipos
                                        </Typography>
                                        <Typography variant="h4">
                                            {stats.total}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Equipos Activos
                                        </Typography>
                                        <Typography variant="h4" color="success.main">
                                            {stats.active}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Equipos Inactivos
                                        </Typography>
                                        <Typography variant="h4" color="error.main">
                                            {stats.inactive}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                <Box sx={{ mb: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Generar Nuevo ID
                    </Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Equipo</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>URL</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.map((team) => (
                            <TableRow key={team.id}>
                                <TableCell>{team.id}</TableCell>
                                <TableCell>{team.teamName}</TableCell>
                                <TableCell>{team.category}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2">
                                            {window.location.origin}/equipo/{team.urlSegment}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    `${window.location.origin}/equipo/${team.urlSegment}`
                                                );
                                                setSuccess('URL copiada al portapapeles');
                                            }}
                                        >
                                            <CopyIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={team.status}
                                        color={team.status === 'active' ? 'success' : 'error'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleViewHistory(team.id)}
                                        title="Ver historial"
                                    >
                                        <HistoryIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleGenerateNewAccessCode(team.id)}
                                        title="Generar nuevo código de acceso"
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleRevokeId(team.id)}
                                        title="Revocar ID"
                                        color="error"
                                    >
                                        <BlockIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Diálogo de nuevo ID */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Generar Nuevo ID de Equipo</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Nombre del equipo"
                            value={formData.teamName}
                            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                            margin="normal"
                            required
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={formData.category}
                                label="Categoría"
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {Object.entries(CATEGORY_CONFIGS).map(([key, config]) => (
                                    <MenuItem key={key} value={key}>
                                        {config.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Email del administrador"
                            type="email"
                            value={formData.adminEmail}
                            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                            margin="normal"
                            required
                            helperText="Este será el administrador secundario del equipo"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleGenerateId}
                            variant="contained"
                            disabled={!formData.teamName || !formData.category || !formData.adminEmail}
                        >
                            Generar ID
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Diálogo de historial */}
                <Dialog
                    open={openHistoryDialog}
                    onClose={() => setOpenHistoryDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Historial de Cambios</DialogTitle>
                    <DialogContent>
                        {selectedTeam?.history.map((entry: any, index: number) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">
                                    {new Date(entry.timestamp).toLocaleString()}
                                </Typography>
                                <Typography color="textSecondary">
                                    Acción: {entry.action}
                                </Typography>
                                <Typography color="textSecondary">
                                    Por: {entry.performedBy}
                                </Typography>
                                <Typography variant="body2">
                                    Detalles: {JSON.stringify(entry.details)}
                                </Typography>
                            </Box>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenHistoryDialog(false)}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminGuard>
    );
}