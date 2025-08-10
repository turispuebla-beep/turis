import React, { useState } from 'react';
import {
    Box,
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
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Friend } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';
import FriendForm from './FriendForm';

interface FriendListProps {
    friends: Friend[];
    teamId: string;
    permissions: TeamPermissions;
    onAddFriend: (friendData: Partial<Friend>) => void;
    onEditFriend: (friendId: string, friendData: Partial<Friend>) => void;
    onDeleteFriend: (friendId: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({
    friends,
    teamId,
    permissions,
    onAddFriend,
    onEditFriend,
    onDeleteFriend
}) => {
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddClick = () => {
        setSelectedFriend(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (friend: Friend) => {
        setSelectedFriend(friend);
        setIsDialogOpen(true);
    };

    const handleSubmit = (friendData: Partial<Friend>) => {
        if (selectedFriend) {
            onEditFriend(selectedFriend.id, friendData);
        } else {
            onAddFriend(friendData);
        }
        setIsDialogOpen(false);
    };

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Amigos del Club</Typography>
                {permissions.canManageFriends && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddClick}
                    >
                        Añadir Amigo
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Email</TableCell>
                            {permissions.canManageFriends && <TableCell>Acciones</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {friends.map((friend) => (
                            <TableRow key={friend.id}>
                                <TableCell>{friend.name}</TableCell>
                                <TableCell>{friend.surname}</TableCell>
                                <TableCell>{friend.phone}</TableCell>
                                <TableCell>{friend.email}</TableCell>
                                {permissions.canManageFriends && (
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    onClick={() => handleEditClick(friend)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    onClick={() => onDeleteFriend(friend.id)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
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
                <FriendForm
                    friend={selectedFriend || undefined}
                    teamId={teamId}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </Dialog>
        </>
    );
};

export default FriendList;