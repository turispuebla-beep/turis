import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Link,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

interface TeamShopProps {
    teamId: string;
}

export function TeamShop({ teamId }: TeamShopProps) {
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const [shopUrl, setShopUrl] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newShopUrl, setNewShopUrl] = useState('');
    const [products, setProducts] = useState<any[]>([]);

    const canEditShop = hasPermission('manage_team_shop');

    useEffect(() => {
        // Cargar datos de la tienda
        loadShopData();
    }, [teamId]);

    const loadShopData = async () => {
        try {
            // Cargar URL de la tienda y productos
            // TODO: Implementar llamada a la API
        } catch (error) {
            console.error('Error loading shop data:', error);
        }
    };

    const handleSaveShopUrl = async () => {
        try {
            // Guardar nueva URL
            // TODO: Implementar llamada a la API
            setShopUrl(newShopUrl);
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error saving shop URL:', error);
        }
    };

    return (
        <Box>
            {/* Tienda Externa */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Tienda Oficial del Equipo</Typography>
                        {canEditShop && (
                            <Button 
                                variant="outlined" 
                                onClick={() => setIsEditDialogOpen(true)}
                            >
                                Editar Enlace
                            </Button>
                        )}
                    </Box>
                    {shopUrl ? (
                        <Box mt={2}>
                            <Typography gutterBottom>
                                Visita nuestra tienda oficial para ver todos los productos
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                component={Link}
                                href={shopUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visitar Tienda
                            </Button>
                        </Box>
                    ) : (
                        <Typography color="textSecondary" mt={2}>
                            No hay tienda externa configurada
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {/* Productos Destacados */}
            <Typography variant="h6" gutterBottom>
                Productos Destacados
            </Typography>
            <Grid container spacing={2}>
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography color="textSecondary">
                                    {product.price.toFixed(2)}€
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Añadir al Carrito
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Diálogo para editar URL */}
            <Dialog 
                open={isEditDialogOpen} 
                onClose={() => setIsEditDialogOpen(false)}
                fullWidth
            >
                <DialogTitle>Editar Enlace de la Tienda</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="URL de la tienda"
                        value={newShopUrl}
                        onChange={(e) => setNewShopUrl(e.target.value)}
                        margin="normal"
                        placeholder="https://..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSaveShopUrl} 
                        variant="contained"
                        color="primary"
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}