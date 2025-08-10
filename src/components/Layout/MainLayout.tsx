import React from 'react';
import { Box, Container } from '@mui/material';
import Navigation from '../Navigation/Navigation';
import Footer from '../Common/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Container component="main" sx={{ flex: 1, py: 3 }}>
                {children}
            </Container>
            <Footer />
        </Box>
    );
};

export default MainLayout;