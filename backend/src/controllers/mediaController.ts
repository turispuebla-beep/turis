import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import Media from '../models/Media';
import Team from '../models/Team';
import path from 'path';
import fs from 'fs';

// @desc    Subir foto o video
// @route   POST /api/teams/:teamId/media
// @access  Private
export const uploadMedia = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Verificar que el equipo existe
    const team = await Team.findById(req.params.teamId);
    if (!team) {
        return res.status(404).json({
            success: false,
            error: 'Equipo no encontrado'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No se ha subido ningún archivo'
        });
    }

    const file = req.files.file;
    const fileType = file.mimetype.startsWith('image/') ? 'photo' : 'video';

    // Validar tipo de archivo
    if (fileType === 'photo' && !file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
        return res.status(400).json({
            success: false,
            error: 'Formato de imagen no válido. Use JPEG, PNG o WebP'
        });
    }

    if (fileType === 'video' && !file.mimetype.match(/^video\/(mp4|webm)$/)) {
        return res.status(400).json({
            success: false,
            error: 'Formato de video no válido. Use MP4 o WebM'
        });
    }

    // Validar tamaño
    const maxSize = fileType === 'photo' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB para fotos, 50MB para videos
    if (file.size > maxSize) {
        return res.status(400).json({
            success: false,
            error: `El archivo es demasiado grande. Máximo ${maxSize / (1024 * 1024)}MB`
        });
    }

    // Crear nombre de archivo único
    const fileExt = path.extname(file.name);
    const fileName = `${fileType}_${team._id}_${Date.now()}${fileExt}`;
    const uploadPath = path.join(process.env.UPLOAD_PATH || 'uploads', fileType === 'photo' ? 'photos' : 'videos');

    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Mover archivo
    await file.mv(path.join(uploadPath, fileName));

    // Crear registro en la base de datos
    const media = await Media.create({
        type: fileType,
        url: `/uploads/${fileType === 'photo' ? 'photos' : 'videos'}/${fileName}`,
        description: req.body.description,
        teamId: req.params.teamId,
        fileSize: file.size,
        fileName: fileName,
        mimeType: file.mimetype
    });

    res.status(201).json({
        success: true,
        data: media
    });
});

// @desc    Obtener todos los medios de un equipo
// @route   GET /api/teams/:teamId/media
// @access  Private
export const getMedia = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let query = { teamId: req.params.teamId };

    // Filtrar por tipo si se especifica
    if (req.query.type) {
        query = { ...query, type: req.query.type };
    }

    const media = await Media.find(query).sort({ uploadDate: -1 });

    res.status(200).json({
        success: true,
        count: media.length,
        data: media
    });
});

// @desc    Obtener un medio específico
// @route   GET /api/teams/:teamId/media/:id
// @access  Private
export const getMediaById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const media = await Media.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!media) {
        return res.status(404).json({
            success: false,
            error: 'Archivo no encontrado'
        });
    }

    res.status(200).json({
        success: true,
        data: media
    });
});

// @desc    Actualizar descripción de un medio
// @route   PUT /api/teams/:teamId/media/:id
// @access  Private
export const updateMedia = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let media = await Media.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!media) {
        return res.status(404).json({
            success: false,
            error: 'Archivo no encontrado'
        });
    }

    // Solo permitir actualizar la descripción
    media = await Media.findByIdAndUpdate(
        req.params.id,
        { description: req.body.description },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: media
    });
});

// @desc    Eliminar un medio
// @route   DELETE /api/teams/:teamId/media/:id
// @access  Private
export const deleteMedia = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const media = await Media.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!media) {
        return res.status(404).json({
            success: false,
            error: 'Archivo no encontrado'
        });
    }

    // Eliminar archivo físico
    const filePath = path.join(process.env.UPLOAD_PATH || 'uploads', media.url);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    await media.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});