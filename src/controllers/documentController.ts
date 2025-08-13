import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import Document from '../models/Document';
import { uploadFile, deleteFile } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
import path from 'path';

// @desc    Obtener documentos
// @route   GET /api/teams/:teamId/documents
// @access  Private
export const getDocuments = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const {
        category,
        status = 'active',
        search,
        tag,
        page = 1,
        limit = 10
    } = req.query;

    // Construir query
    const query: any = { teamId };

    // Filtrar por categoría
    if (category) {
        query.category = category;
    }

    // Filtrar por estado
    if (status) {
        query.status = status;
    }

    // Filtrar por tag
    if (tag) {
        query.tags = tag;
    }

    // Búsqueda por texto
    if (search) {
        query.$text = { $search: search };
    }

    // Filtrar por acceso
    if (req.user.role !== 'admin') {
        if (req.user.role === 'teamAdmin') {
            query.teamId = req.user.teamId;
        } else {
            query.isPublic = true;
            query.teamId = req.user.teamId;
        }
    }

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    const documents = await Document.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');

    const total = await Document.countDocuments(query);

    res.status(200).json({
        success: true,
        count: documents.length,
        total,
        pages: Math.ceil(total / Number(limit)),
        data: documents
    });
});

// @desc    Obtener un documento específico
// @route   GET /api/teams/:teamId/documents/:id
// @access  Private
export const getDocument = asyncHandler(async (req: Request, res: Response) => {
    const document = await Document.findById(req.params.id)
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');

    if (!document) {
        throw new ErrorResponse('Documento no encontrado', 404);
    }

    // Verificar permisos de acceso
    if (!document.isAccessibleBy(req.user)) {
        throw new ErrorResponse('No autorizado para acceder a este documento', 403);
    }

    res.status(200).json({
        success: true,
        data: document
    });
});

// @desc    Crear nuevo documento
// @route   POST /api/teams/:teamId/documents
// @access  Private (Admin y TeamAdmin)
export const createDocument = asyncHandler(async (req: Request, res: Response) => {
    req.body.teamId = req.params.teamId;
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && req.body.teamId !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para crear documentos en este equipo', 403);
    }

    if (!req.file) {
        throw new ErrorResponse('Por favor proporcione un archivo', 400);
    }

    // Validar tipo de archivo
    const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    const fileExt = path.extname(req.file.originalname).toLowerCase().slice(1);
    
    if (!allowedTypes.includes(fileExt)) {
        throw new ErrorResponse('Tipo de archivo no permitido', 400);
    }

    // Subir archivo
    const fileUrl = await uploadFile(req.file, 'documents');

    // Crear documento
    const document = await Document.create({
        ...req.body,
        fileUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: fileExt
    });

    // Notificar si es público
    if (document.isPublic) {
        await NotificationService.sendCustomNotification(
            {
                title: 'Nuevo Documento',
                body: `Se ha publicado un nuevo documento: ${document.title}`,
                data: {
                    type: 'DOCUMENT',
                    documentId: document._id.toString(),
                    teamId: document.teamId.toString()
                }
            },
            {
                target: 'team_all',
                teamId: document.teamId.toString()
            }
        );
    }

    res.status(201).json({
        success: true,
        data: document
    });
});

// @desc    Actualizar documento
// @route   PUT /api/teams/:teamId/documents/:id
// @access  Private (Admin y TeamAdmin)
export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
    let document = await Document.findById(req.params.id);

    if (!document) {
        throw new ErrorResponse('Documento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && document.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para actualizar este documento', 403);
    }

    // Actualizar archivo si se proporciona
    if (req.file) {
        // Validar tipo de archivo
        const allowedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
        const fileExt = path.extname(req.file.originalname).toLowerCase().slice(1);
        
        if (!allowedTypes.includes(fileExt)) {
            throw new ErrorResponse('Tipo de archivo no permitido', 400);
        }

        // Eliminar archivo anterior
        await deleteFile(document.fileUrl);

        // Subir nuevo archivo
        const fileUrl = await uploadFile(req.file, 'documents');

        req.body.fileUrl = fileUrl;
        req.body.fileName = req.file.originalname;
        req.body.fileSize = req.file.size;
        req.body.fileType = fileExt;
    }

    req.body.updatedBy = req.user.id;

    document = await Document.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Notificar actualización si es público
    if (document!.isPublic) {
        await NotificationService.sendCustomNotification(
            {
                title: 'Documento Actualizado',
                body: `Se ha actualizado el documento: ${document!.title}`,
                data: {
                    type: 'DOCUMENT_UPDATE',
                    documentId: document!._id.toString(),
                    teamId: document!.teamId.toString()
                }
            },
            {
                target: 'team_all',
                teamId: document!.teamId.toString()
            }
        );
    }

    res.status(200).json({
        success: true,
        data: document
    });
});

// @desc    Eliminar documento
// @route   DELETE /api/teams/:teamId/documents/:id
// @access  Private (Admin y TeamAdmin)
export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new ErrorResponse('Documento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && document.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para eliminar este documento', 403);
    }

    // Eliminar archivo
    await deleteFile(document.fileUrl);

    await document.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Descargar documento
// @route   GET /api/teams/:teamId/documents/:id/download
// @access  Private
export const downloadDocument = asyncHandler(async (req: Request, res: Response) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new ErrorResponse('Documento no encontrado', 404);
    }

    // Verificar permisos de acceso
    if (!document.isAccessibleBy(req.user)) {
        throw new ErrorResponse('No autorizado para descargar este documento', 403);
    }

    // Incrementar contador de descargas
    await document.incrementDownloads();

    // Redirigir a la URL del archivo
    res.redirect(document.fileUrl);
});

// @desc    Archivar documento
// @route   PUT /api/teams/:teamId/documents/:id/archive
// @access  Private (Admin y TeamAdmin)
export const archiveDocument = asyncHandler(async (req: Request, res: Response) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new ErrorResponse('Documento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && document.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para archivar este documento', 403);
    }

    await document.archive();

    res.status(200).json({
        success: true,
        data: document
    });
});