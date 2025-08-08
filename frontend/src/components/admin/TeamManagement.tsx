import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stepper,
    Step,
    StepLabel,
    Card,
    CardContent,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material';
import {
    Add as AddIcon,
    ContentCopy as CopyIcon
} from '@mui/icons-material';
import { usePermissions } from '../../hooks/usePermissions';
import { sharedTeamService } from '../../services/sharedTeamService';
import { accessCodeService } from '../../services/accessCodeService';
import { AdminGuard } from './AdminGuard';
import type { Team } from '../../types/team';
import type { AccessCode } from '../../services/accessCodeService';

const steps = ['Información del equipo', 'Generar código de acceso', 'Resumen'];

export function TeamManagement() {
    const [activeStep, setActiveStep] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [teamData, setTeamData] = useState<Partial<Team>>({
        name: '',
        category: '',
        city: '',
        stadium: '',
        description: ''
    });
    const [accessCode, setAccessCode] = useState<AccessCode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    return (
        <AdminGuard action="crear y gestionar equipos">
            <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        Gestión de Equipos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Crear Nuevo Equipo
                    </Button>
                </Box>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Crear Nuevo Equipo
                    </DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {success}
                            </Alert>
                        )}

                        {activeStep === 0 && (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre del equipo"
                                    value={teamData.name}
                                    onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                                    margin="normal"
                                    required
                                />
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Categoría</InputLabel>
                                    <Select
                                        value={teamData.category}
                                        label="Categoría"
                                        onChange={(e) => setTeamData({ ...teamData, category: e.target.value })}
                                    >
                                        <MenuItem value="Senior">Senior</MenuItem>
                                        <MenuItem value="Juvenil">Juvenil</MenuItem>
                                        <MenuItem value="Cadete">Cadete</MenuItem>
                                        <MenuItem value="Infantil">Infantil</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    label="Ciudad"
                                    value={teamData.city}
                                    onChange={(e) => setTeamData({ ...teamData, city: e.target.value })}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Estadio"
                                    value={teamData.stadium}
                                    onChange={(e) => setTeamData({ ...teamData, stadium: e.target.value })}
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    value={teamData.description}
                                    onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
                                    margin="normal"
                                    multiline
                                    rows={4}
                                />
                            </Box>
                        )}

                        {activeStep === 1 && (
                            <Box sx={{ mt: 2 }}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    Se ha generado un código de acceso para el administrador del equipo.
                                    Este código:
                                    <ul>
                                        <li>Es válido por 7 días</li>
                                        <li>Solo puede usarse una vez</li>
                                        <li>Otorga permisos de administrador del equipo</li>
                                    </ul>
                                </Alert>
                                {accessCode && (
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Código de acceso:
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Typography variant="h4" component="div" fontFamily="monospace">
                                                    {accessCode.code}
                                                </Typography>
                                                <Button
                                                    startIcon={<CopyIcon />}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(accessCode.code);
                                                        setSuccess('Código copiado al portapapeles');
                                                        setTimeout(() => setSuccess(null), 3000);
                                                    }}
                                                    variant="outlined"
                                                >
                                                    Copiar
                                                </Button>
                                            </Box>
                                            <Typography color="textSecondary" sx={{ mt: 2 }}>
                                                Expira el: {new Date(accessCode.expiresAt).toLocaleDateString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                        )}

                        {activeStep === 2 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Resumen de la creación
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Equipo creado:
                                        </Typography>
                                        <Typography>
                                            Nombre: {teamData.name}<br />
                                            Categoría: {teamData.category}<br />
                                            Ciudad: {teamData.city}<br />
                                            Estadio: {teamData.stadium}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Código de acceso generado:
                                        </Typography>
                                        <Typography>
                                            Código: {accessCode?.code}<br />
                                            Rol: Administrador de equipo<br />
                                            Expira: {accessCode?.expiresAt ? new Date(accessCode.expiresAt).toLocaleDateString() : ''}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    Asegúrate de proporcionar el código de acceso al nuevo administrador del equipo.
                                    Una vez cerrada esta ventana, no podrás ver el código nuevamente.
                                </Alert>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>
                            Cerrar
                        </Button>
                        {activeStep === 0 && (
                            <Button
                                variant="contained"
                                onClick={async () => {
                                    try {
                                        setError(null);
                                        
                                        // Crear el equipo
                                        const newTeam = await sharedTeamService.createTeam(teamData as Omit<Team, 'id'>);
                                        
                                        // Generar código de acceso para el administrador secundario
                                        const code = await accessCodeService.generateCode({
                                            teamId: newTeam.id,
                                            role: 'team_admin',
                                            expiresIn: 7, // 7 días
                                            maxUses: 1
                                        });

                                        setAccessCode(code);
                                        setActiveStep(1);
                                    } catch (err) {
                                        setError(err instanceof Error ? err.message : 'Error al crear el equipo');
                                    }
                                }}
                                disabled={!teamData.name || !teamData.category || !teamData.city || !teamData.stadium}
                            >
                                Crear Equipo
                            </Button>
                        )}
                        {activeStep === 1 && (
                            <Button
                                variant="contained"
                                onClick={() => setActiveStep(2)}
                            >
                                Siguiente
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminGuard>
    );
}