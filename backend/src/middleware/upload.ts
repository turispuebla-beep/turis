import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { storageService } from '../services/storageService';

// Configuración de multer para almacenamiento en memoria
const storage = multer.memoryStorage();

// Función para filtrar archivos según tipo
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
) => {
    const type = req.params.type || 'image';
    
    switch (type) {
        case 'image':
            if (!file.mimetype.startsWith('image/')) {
                callback(new Error('Solo se permiten imágenes'));
                return;
            }
            break;
        case 'video':
            if (!file.mimetype.startsWith('video/')) {
                callback(new Error('Solo se permiten videos'));
                return;
            }
            break;
        case 'document':
            if (file.mimetype !== 'application/pdf') {
                callback(new Error('Solo se permiten documentos PDF'));
                return;
            }
            break;
        default:
            callback(new Error('Tipo de archivo no válido'));
            return;
    }
    
    callback(null, true);
};

// Configuración de multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB máximo (se validará más específicamente después)
    }
});

// Middleware para procesar la subida de archivos
export const processFileUpload = (type: 'image' | 'video' | 'document') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Primero usar multer para procesar el archivo
            upload.single('file')(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({
                        success: false,
                        error: 'Error al subir el archivo: ' + err.message
                    });
                } else if (err) {
                    return res.status(400).json({
                        success: false,
                        error: err.message
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        error: 'No se ha proporcionado ningún archivo'
                    });
                }

                try {
                    // Guardar el archivo usando el servicio de almacenamiento
                    const result = await storageService.saveFile(
                        {
                            originalName: req.file.originalname,
                            mimeType: req.file.mimetype,
                            size: req.file.size,
                            buffer: req.file.buffer
                        },
                        type
                    );

                    // Añadir información del archivo a la request
                    req.uploadedFile = result;
                    next();
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        error: error.message
                    });
                }
            });
        } catch (error) {
            next(error);
        }
    };
};

// Middleware para limpiar archivos temporales
export const cleanupTempFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await storageService.cleanupTempFiles();
        next();
    } catch (error) {
        next(error);
    }
};

// Extender la interfaz Request para incluir el archivo subido
declare global {
    namespace Express {
        interface Request {
            uploadedFile?: {
                fileName: string;
                filePath: string;
            };
        }
    }
}