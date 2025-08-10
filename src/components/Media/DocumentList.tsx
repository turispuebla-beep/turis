import React, { useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondary,
    IconButton,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Grid,
    Paper,
    Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { TeamDocument } from '../../types/team';
import { TeamPermissions } from '../../types/permissions';

interface DocumentListProps {
    documents: TeamDocument[];
    teamId: string;
    permissions: TeamPermissions;
    onAddDocument: (documentData: Partial<TeamDocument>) => void;
    onDeleteDocument: (documentId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
    documents,
    teamId,
    permissions,
    onAddDocument,
    onDeleteDocument
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.includes('pdf')) {
                setError('Solo se permiten archivos PDF');
                return;
            }
            if (file.size > 10000000) { // 10MB limit
                setError('El documento no debe superar los 10MB');
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    };

    const handleSubmit = () => {
        if (!selectedFile) {
            setError('Por favor selecciona un documento');
            return;
        }

        if (!title.trim()) {
            setError('El título es obligatorio');
            return;
        }

        // Aquí simularemos la subida del documento
        // En una implementación real, subiríamos el archivo a un servidor
        const documentData: Partial<TeamDocument> = {
            title,
            description,
            fileUrl: URL.createObjectURL(selectedFile), // En realidad, esto sería la URL devuelta por el servidor
            uploadDate: new Date().toISOString(),
            teamId
        };

        onAddDocument(documentData);
        handleClose();
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedFile(null);
        setTitle('');
        setDescription('');
        setError('');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Documentos</Typography>
                {permissions.canManageDocuments && (
                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Subir Documento
                    </Button>
                )}
            </Box>

            <Paper>
                <List>
                    {documents.map((doc) => (
                        <ListItem
                            key={doc.id}
                            secondaryAction={
                                permissions.canManageDocuments && (
                                    <Tooltip title="Eliminar documento">
                                        <IconButton
                                            edge="end"
                                            onClick={() => onDeleteDocument(doc.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                        >
                            <ListItemIcon>
                                <PictureAsPdfIcon color="error" />
                            </ListItemIcon>
                            <ListItemText
                                primary={doc.title}
                                secondary={
                                    <>
                                        {doc.description && (
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {doc.description}
                                                <br />
                                            </Typography>
                                        )}
                                        {`Subido el ${formatDate(doc.uploadDate)}`}
                                    </>
                                }
                            />
                            <Button
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ver PDF
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <Dialog
                open={isDialogOpen}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Subir Nuevo Documento</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Título del Documento"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
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
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<UploadFileIcon />}
                            >
                                Seleccionar PDF
                                <input
                                    type="file"
                                    hidden
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                />
                            </Button>
                            {selectedFile && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    Archivo seleccionado: {selectedFile.name}
                                </Typography>
                            )}
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
                        disabled={!selectedFile || !title.trim()}
                    >
                        Subir Documento
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DocumentList;