import React, { useState } from 'react';
import {
    Box,
    ImageList,
    ImageListItem,
    IconButton,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Grid,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { TeamMedia } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';

interface PhotoGalleryProps {
    media: TeamMedia[];
    teamId: string;
    permissions: TeamPermissions;
    onAddPhoto: (photoData: Partial<TeamMedia>) => void;
    onDeletePhoto: (photoId: string) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    media,
    teamId,
    permissions,
    onAddPhoto,
    onDeletePhoto
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [error, setError] = useState('');

    const photos = media.filter(item => item.type === 'photo');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                setError('La imagen no debe superar los 5MB');
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = () => {
        if (!selectedImage) {
            setError('Por favor selecciona una imagen');
            return;
        }

        // Aquí simularemos la subida de la imagen
        // En una implementación real, subiríamos el archivo a un servidor
        const photoData: Partial<TeamMedia> = {
            type: 'photo',
            url: previewUrl, // En realidad, esto sería la URL devuelta por el servidor
            description,
            uploadDate: new Date().toISOString(),
            teamId
        };

        onAddPhoto(photoData);
        handleClose();
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedImage(null);
        setDescription('');
        setPreviewUrl('');
        setError('');
    };

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Galería de Fotos</Typography>
                {permissions.canManagePhotos && (
                    <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Añadir Foto
                    </Button>
                )}
            </Box>

            <ImageList cols={3} gap={8}>
                {photos.map((item) => (
                    <ImageListItem key={item.id}>
                        <img
                            src={item.url}
                            alt={item.description || 'Foto del equipo'}
                            loading="lazy"
                            style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {permissions.canManagePhotos && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    borderRadius: '0 0 0 8px'
                                }}
                            >
                                <Tooltip title="Eliminar foto">
                                    <IconButton
                                        size="small"
                                        onClick={() => onDeletePhoto(item.id)}
                                        sx={{ color: 'white' }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                        {item.description && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                                    p: 1
                                }}
                            >
                                <Typography variant="caption" sx={{ color: 'white' }}>
                                    {item.description}
                                </Typography>
                            </Box>
                        )}
                    </ImageListItem>
                ))}
            </ImageList>

            <Dialog
                open={isDialogOpen}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Añadir Nueva Foto</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                            >
                                Seleccionar Imagen
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </Button>
                        </Grid>
                        {previewUrl && (
                            <Grid item xs={12}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descripción"
                                multiline
                                rows={2}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Typography color="error">{error}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!selectedImage}
                    >
                        Subir Foto
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PhotoGallery;