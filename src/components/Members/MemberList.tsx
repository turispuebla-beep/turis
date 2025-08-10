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
    Chip,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Member } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';
import MemberForm from './MemberForm';

interface MemberListProps {
    members: Member[];
    teamId: string;
    permissions: TeamPermissions;
    onAddMember: (memberData: Partial<Member>) => void;
    onEditMember: (memberId: string, memberData: Partial<Member>) => void;
    onDeleteMember: (memberId: string) => void;
    onUpdateStatus: (memberId: string, status: 'active' | 'inactive') => void;
}

const MemberList: React.FC<MemberListProps> = ({
    members,
    teamId,
    permissions,
    onAddMember,
    onEditMember,
    onDeleteMember,
    onUpdateStatus
}) => {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddClick = () => {
        setSelectedMember(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (member: Member) => {
        setSelectedMember(member);
        setIsDialogOpen(true);
    };

    const handleSubmit = (memberData: Partial<Member>) => {
        if (selectedMember) {
            onEditMember(selectedMember.id, memberData);
        } else {
            onAddMember(memberData);
        }
        setIsDialogOpen(false);
    };

    const getStatusChip = (status: Member['status']) => {
        switch (status) {
            case 'pending':
                return <Chip label="Pendiente" color="warning" size="small" />;
            case 'active':
                return <Chip label="Activo" color="success" size="small" />;
            case 'inactive':
                return <Chip label="Inactivo" color="error" size="small" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Socios</Typography>
                {permissions.canManageMembers && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddClick}
                    >
                        Añadir Socio
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nº Socio</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellidos</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Fecha Registro</TableCell>
                            {permissions.canManageMembers && <TableCell>Acciones</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.memberNumber}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.surname}</TableCell>
                                <TableCell>{member.phone}</TableCell>
                                <TableCell>{getStatusChip(member.status)}</TableCell>
                                <TableCell>{formatDate(member.registrationDate)}</TableCell>
                                {permissions.canManageMembers && (
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {member.status === 'pending' && (
                                                <>
                                                    <Tooltip title="Aprobar">
                                                        <IconButton
                                                            onClick={() => onUpdateStatus(member.id, 'active')}
                                                            size="small"
                                                            color="success"
                                                        >
                                                            <CheckCircleIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Rechazar">
                                                        <IconButton
                                                            onClick={() => onUpdateStatus(member.id, 'inactive')}
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <CancelIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    onClick={() => handleEditClick(member)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Eliminar">
                                                <IconButton
                                                    onClick={() => onDeleteMember(member.id)}
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
                <MemberForm
                    member={selectedMember || undefined}
                    teamId={teamId}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                />
            </Dialog>
        </>
    );
};

export default MemberList;