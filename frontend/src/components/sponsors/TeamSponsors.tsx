import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Link,
    Divider,
    useTheme,
    useMediaQuery,
    Container,
    Paper
} from '@mui/material';
import { motion } from 'framer-motion';

interface Sponsor {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl?: string;
    description?: string;
    isMainSponsor: boolean;
}

interface TeamSponsorsProps {
    teamId: string;
}

export function TeamSponsors({ teamId }: TeamSponsorsProps) {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        loadSponsors();
    }, [teamId]);

    const loadSponsors = async () => {
        try {
            // TODO: Implementar llamada a la API
        } catch (error) {
            console.error('Error loading sponsors:', error);
        }
    };

    const mainSponsors = sponsors.filter(s => s.isMainSponsor);
    const regularSponsors = sponsors.filter(s => !s.isMainSponsor);

    return (
        <Container maxWidth="lg">
            {/* Patrocinadores Principales */}
            {mainSponsors.length > 0 && (
                <Box sx={{ mb: 6 }}>
                    <Typography 
                        variant="h4" 
                        align="center" 
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            mb: 4
                        }}
                    >
                        Patrocinadores Principales
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {mainSponsors.map((sponsor, index) => (
                            <Grid item xs={12} md={4} key={sponsor.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                transition: 'transform 0.3s ease-in-out'
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                backgroundColor: theme.palette.primary.main,
                                                color: 'white',
                                                px: 2,
                                                py: 0.5,
                                                borderBottomLeftRadius: 8
                                            }}
                                        >
                                            Principal
                                        </Box>
                                        <CardMedia
                                            component="img"
                                            height={200}
                                            image={sponsor.logoUrl}
                                            alt={sponsor.name}
                                            sx={{
                                                objectFit: 'contain',
                                                p: 3,
                                                backgroundColor: 'white'
                                            }}
                                        />
                                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                            <Typography variant="h6" gutterBottom>
                                                {sponsor.name}
                                            </Typography>
                                            {sponsor.description && (
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    {sponsor.description}
                                                </Typography>
                                            )}
                                            {sponsor.websiteUrl && (
                                                <Link
                                                    href={sponsor.websiteUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        display: 'inline-block',
                                                        mt: 'auto',
                                                        px: 3,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        backgroundColor: theme.palette.primary.main,
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.primary.dark
                                                        }
                                                    }}
                                                >
                                                    Visitar Web
                                                </Link>
                                            )}
                                        </CardContent>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Colaboradores */}
            {regularSponsors.length > 0 && (
                <Box sx={{ py: 4, backgroundColor: 'grey.50', borderRadius: 4 }}>
                    <Typography 
                        variant="h5" 
                        align="center" 
                        gutterBottom
                        sx={{ mb: 4 }}
                    >
                        Colaboradores
                    </Typography>
                    <Grid 
                        container 
                        spacing={3} 
                        justifyContent="center"
                        sx={{ px: isMobile ? 2 : 4 }}
                    >
                        {regularSponsors.map((sponsor, index) => (
                            <Grid item xs={6} sm={4} md={3} key={sponsor.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                            '&:hover': {
                                                elevation: 3,
                                                transform: 'scale(1.05)',
                                                transition: 'all 0.3s ease-in-out'
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={sponsor.logoUrl}
                                            alt={sponsor.name}
                                            sx={{
                                                height: 80,
                                                objectFit: 'contain',
                                                filter: 'grayscale(100%)',
                                                '&:hover': {
                                                    filter: 'grayscale(0%)',
                                                    transition: 'filter 0.3s ease-in-out'
                                                }
                                            }}
                                        />
                                        {sponsor.websiteUrl && (
                                            <Link
                                                href={sponsor.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    mt: 1,
                                                    textAlign: 'center',
                                                    color: theme.palette.text.secondary,
                                                    textDecoration: 'none',
                                                    '&:hover': {
                                                        color: theme.palette.primary.main
                                                    }
                                                }}
                                            >
                                                {sponsor.name}
                                            </Link>
                                        )}
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
}