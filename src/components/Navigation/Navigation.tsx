import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component={RouterLink} 
                    to="/"
                    sx={{ 
                        flexGrow: 1, 
                        textDecoration: 'none', 
                        color: 'inherit' 
                    }}
                >
                    TURISTEAM
                </Typography>
                
                {isAuthenticated && (
                    <Box sx={{ display: 'flex' }}>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/teams"
                        >
                            Equipos
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/coach"
                        >
                            Entrenador
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/members"
                        >
                            Socios
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/calendar"
                        >
                            Calendario
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/events"
                        >
                            Eventos
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/media"
                        >
                            Fotos/Videos
                        </Button>
                        <Button 
                            color="inherit" 
                            component={RouterLink} 
                            to="/documents"
                        >
                            Documentos
                        </Button>
                        {isAdmin && (
                            <Button 
                                color="inherit" 
                                component={RouterLink} 
                                to="/admin"
                            >
                                Admin
                            </Button>
                        )}
                        <Button 
                            color="inherit" 
                            onClick={handleLogout}
                        >
                            Salir
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navigation;