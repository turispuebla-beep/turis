import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Bienvenido a TURISTEAM
                </Typography>
                {!isAuthenticated && (
                    <Typography variant="body1">
                        Por favor, inicia sesión para acceder al sistema.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default Home;