import React, { useState } from 'react';
import { Box, Container, Typography, Link, Dialog, DialogTitle, DialogContent } from '@mui/material';

const Footer: React.FC = () => {
    const [openPrivacy, setOpenPrivacy] = useState(false);

    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            © {new Date().getFullYear()} TURISTEAM
                        </Typography>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => setOpenPrivacy(true)}
                            sx={{ mr: 2 }}
                        >
                            Política de Protección de Datos
                        </Link>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Contacto del Club
                        </Typography>
                    </Box>
                </Box>

                <Dialog
                    open={openPrivacy}
                    onClose={() => setOpenPrivacy(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Política de Protección de Datos</DialogTitle>
                    <DialogContent>
                        <Typography>
                            [Aquí irá el contenido de la política de protección de datos]
                        </Typography>
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
};

export default Footer;