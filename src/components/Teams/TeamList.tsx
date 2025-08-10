import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    Button,
    Chip
} from '@mui/material';
import { Team, TeamCategory } from '../../types/team';
import { useAuth } from '../../context/AuthContext';

interface TeamListProps {
    teams: Team[];
    onTeamSelect: (team: Team) => void;
}

const categoryLabels: Record<TeamCategory, string> = {
    prebenjamin: 'Prebenjamín',
    benjamin: 'Benjamín',
    alevin: 'Alevín',
    infantil: 'Infantil',
    aficionado: 'Aficionado'
};

const TeamList: React.FC<TeamListProps> = ({ teams, onTeamSelect }) => {
    const { isAdmin, user } = useAuth();

    const canEditTeam = (teamId: string) => {
        return isAdmin || user?.teamId === teamId;
    };

    return (
        <Grid container spacing={3}>
            {teams.map((team) => (
                <Grid item xs={12} sm={6} md={4} key={team.id}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image={team.logo || '/default-team-logo.png'}
                            alt={team.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {team.name}
                            </Typography>
                            <Chip 
                                label={categoryLabels[team.category]} 
                                color="primary" 
                                size="small" 
                                sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Jugadores: {team.players.length}
                            </Typography>
                            {team.coach && (
                                <Typography variant="body2" color="text.secondary">
                                    Entrenador: {team.coach.name}
                                </Typography>
                            )}
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => onTeamSelect(team)}
                                    fullWidth
                                    disabled={!canEditTeam(team.id)}
                                >
                                    {canEditTeam(team.id) ? 'Gestionar Equipo' : 'Ver Detalles'}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default TeamList;