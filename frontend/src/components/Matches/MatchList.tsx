import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography,
    Button,
    Box
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Match } from '../../types/team';
import { usePermissions } from '../../hooks/usePermissions';

interface MatchListProps {
    matches: Match[];
    teamId: string;
    onMatchUpdated: () => void;
}

export function MatchList({ matches, teamId, onMatchUpdated }: MatchListProps) {
    const navigate = useNavigate();
    const { hasPermission } = usePermissions();

    const canManageMatches = hasPermission('create_match');

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Partidos</Typography>
                {canManageMatches && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/teams/${teamId}/matches/new`)}
                    >
                        Nuevo Partido
                    </Button>
                )}
            </Box>

            <List>
                {matches.map(match => (
                    <ListItem key={match.id}>
                        <ListItemText
                            primary={`${match.homeTeam} vs ${match.awayTeam}`}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        {new Date(match.date).toLocaleDateString()}
                                    </Typography>
                                    {' - '}
                                    {match.status === 'completed' ? (
                                        `${match.homeScore} - ${match.awayScore}`
                                    ) : (
                                        match.status
                                    )}
                                </>
                            }
                        />
                        {canManageMatches && (
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => navigate(`/teams/${teamId}/matches/${match.id}/edit`)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => {
                                        // Implementar eliminación
                                        onMatchUpdated();
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}