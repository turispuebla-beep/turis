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
    Tooltip,
    Tabs,
    Tab,
    Card,
    CardMedia,
    CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { TeamMedia } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';

interface MediaGalleryProps {
    media: TeamMedia[];
    teamId: string;
    permissions: TeamPermissions;
    onAddMedia: (mediaData: Partial<TeamMedia>) => void;
    onDeleteMedia: (mediaId: string) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
    media,
    teamId,
    permissions,
    onAddMedia,
    onDeleteMedia
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [error, setError] = useState('');
    const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
    const [activeTab, setActiveTab] = useState(0);

    const photos = media.filter(item => item.type === 'photo');
    const videos = media.filter(item => item.type === 'video');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar según el tipo de medio
            if (mediaType === 'photo') {
                if (!file.type.includes('image/')) {
                    setError('El archivo debe ser una imagen');
                    return;
                }
                if (file.size > 5000000) { // 5MB para fotos
                    setError('La imagen no debe superar los 5MB');
                    return;
                }
            } else {
                if (!file.type.includes('video/')) {
                    setError('El archivo debe ser un video');
                    return;
                }
                if (file.size > 50000000) { // 50MB para videos
                    setError('El video no debe superar los 50MB');
                    return;
                }
            }
            
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = () => {
        if (!selectedFile) {
            setError(`Por favor selecciona ${mediaType === 'photo' ? 'una imagen' : 'un video'}`);
            return;
        }

        const mediaData: Partial<TeamMedia> = {
            type: mediaType,
            url: previewUrl, // En realidad, esto sería la URL devuelta por el servidor
            description,
            uploadDate: new Date().toISOString(),
            teamId
        };

        onAddMedia(mediaData);
        handleClose();
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedFile(null);
        setDescription('');
        setPreviewUrl('');
        setError('');
    };

    const renderMediaUploadDialog = () => (
        <Dialog
            open={isDialogOpen}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {mediaType === 'photo' ? 'Añadir Nueva Foto' : 'Añadir Nuevo Video'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            startIcon={mediaType === 'photo' ? <AddPhotoAlternateIcon /> : <VideoCallIcon />}
                        >
                            {mediaType === 'photo' ? 'Seleccionar Imagen' : 'Seleccionar Video'}
                            <input
                                type="file"
                                hidden
                                accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
                                onChange={handleFileSelect}
                            />
                        </Button>
                    </Grid>
                    {previewUrl && (
                        <Grid item xs={12}>
                            {mediaType === 'photo' ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain'
                                    }}
                                />
                            ) : (
                                <video
                                    src={previewUrl}
                                    controls
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px'
                                    }}
                                />
                            )}
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
                    disabled={!selectedFile}
                >
                    Subir {mediaType === 'photo' ? 'Foto' : 'Video'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Galería de Fotos y Videos</Typography>
                    {permissions.canManagePhotos && (
                        <Box>
                            <Button
                                variant="contained"
                                startIcon={<AddPhotoAlternateIcon />}
                                onClick={() => {
                                    setMediaType('photo');
                                    setIsDialogOpen(true);
                                }}
                                sx={{ mr: 1 }}
                            >
                                Añadir Foto
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<VideoCallIcon />}
                                onClick={() => {
                                    setMediaType('video');
                                    setIsDialogOpen(true);
                                }}
                            >
                                Añadir Video
                            </Button>
                        </Box>
                    )}
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 2 }}
                >
                    <Tab label="Fotos" />
                    <Tab label="Videos" />
                </Tabs>
            </Box>

            {activeTab === 0 && (
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
                                            onClick={() => onDeleteMedia(item.id)}
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
            )}

            {activeTab === 1 && (
                <Grid container spacing={2}>
                    {videos.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card>
                                <CardMedia
                                    component="video"
                                    controls
                                    src={item.url}
                                    sx={{ height: 200 }}
                                />
                                <CardContent>
                                    {item.description && (
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    )}
                                    {permissions.canManagePhotos && (
                                        <Box sx={{ mt: 1 }}>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                color="error"
                                                onClick={() => onDeleteMedia(item.id)}
                                            >
                                                Eliminar
                                            </Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {renderMediaUploadDialog()}
        </>
    );
};

export default MediaGallery;