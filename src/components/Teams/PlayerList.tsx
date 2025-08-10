import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Dialog,
    Typography,
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Player } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';
import PlayerForm from './PlayerForm';

interface PlayerListProps {
    players: Player[];
    permissions: TeamPermissions;
    onAddPlayer: (player: Partial<Player>) => void;
    onEditPlayer: (playerId: string, playerData: Partial<Player>) => void;
    onDeletePlayer: (playerId: string) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
    players,
    permissions,
    onAddPlayer,
    onEditPlayer,
    onDeletePlayer
}) => {
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);

    const handleAddClick = () => {
        setSelectedPlayer(null);
        setIsCreateMode(true);
        setIsDialogOpen(true);
    };

    const handleEditClick = (player: Player) => {
        setSelectedPlayer(player);
        setIsCreateMode(false);
        setIsDialogOpen(true);
    };

    const handleSubmit = (playerData: Partial<Player>) => {
        if (isCreateMode) {
            onAddPlayer(playerData);
        } else if (selectedPlayer) {
            onEditPlayer(selectedPlayer.id, playerData);
        }
        setIsDialogOpen(false);
    };

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Jugadores</Typography>
                {permissions.canManagePlayers && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddClick}
                    >
                        Añadir Jugador
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Edad</TableCell>
                            <TableCell>Dorsal</TableCell>
                            <TableCell>Teléfono</TableCell>
                            {permissions.canManagePlayers && <TableCell>Acciones</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell>{player.name}</TableCell>
                                <TableCell>{player.surname}</TableCell>
                                <TableCell>{calculateAge(player.birthDate)}</TableCell>
                                <TableCell>{player.jerseyNumber}</TableCell>
                                <TableCell>{player.phone}</TableCell>
                                {permissions.canManagePlayers && (
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEditClick(player)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => onDeletePlayer(player.id)}
                                            size="small"
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <PlayerForm
                    player={selectedPlayer || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </Dialog>
        </>
    );
};

export default PlayerList;