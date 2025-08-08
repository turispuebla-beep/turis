import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import Event from '../models/Event';
import Member from '../models/Member';
import { uploadFile, deleteFile } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

// @desc    Obtener eventos
// @route   GET /api/teams/:teamId/events
// @access  Private
export const getEvents = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const { 
        status,
        category,
        startDate,
        endDate,
        upcoming = 'true',
        page = 1,
        limit = 10
    } = req.query;

    // Construir query
    const query: any = { teamId };

    // Filtrar por estado
    if (status) {
        query.status = status;
    }

    // Filtrar por categoría
    if (category) {
        query.category = category;
    }

    // Filtrar por fecha
    if (startDate) {
        query.date = { $gte: startOfDay(parseISO(startDate as string)) };
    }
    if (endDate) {
        query.date = { ...query.date, $lte: endOfDay(parseISO(endDate as string)) };
    }
    if (upcoming === 'true' && !startDate && !endDate) {
        query.date = { $gte: new Date() };
    }

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    const events = await Event.find(query)
        .sort({ date: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('participants.memberId', 'name surname');

    const total = await Event.countDocuments(query);

    res.status(200).json({
        success: true,
        count: events.length,
        total,
        pages: Math.ceil(total / Number(limit)),
        data: events
    });
});

// @desc    Obtener un evento específico
// @route   GET /api/teams/:teamId/events/:id
// @access  Private
export const getEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id)
        .populate('participants.memberId', 'name surname email phone')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');

    if (!event) {
        throw new ErrorResponse('Evento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && event.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para ver este evento', 403);
    }

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Crear nuevo evento
// @route   POST /api/teams/:teamId/events
// @access  Private (Admin y TeamAdmin)
export const createEvent = asyncHandler(async (req: Request, res: Response) => {
    req.body.teamId = req.params.teamId;
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && req.body.teamId !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para crear eventos en este equipo', 403);
    }

    // Subir imagen si se proporciona
    if (req.file) {
        req.body.image = await uploadFile(req.file, 'event-images');
    }

    const event = await Event.create(req.body);

    // Notificar a los miembros del equipo
    if (event.status === 'published') {
        await NotificationService.sendCustomNotification(
            {
                title: 'Nuevo Evento',
                body: `Se ha creado un nuevo evento: ${event.title}`,
                data: {
                    type: 'EVENT',
                    eventId: event._id.toString(),
                    teamId: event.teamId.toString()
                }
            },
            {
                target: 'team_all',
                teamId: event.teamId.toString()
            }
        );
    }

    res.status(201).json({
        success: true,
        data: event
    });
});

// @desc    Actualizar evento
// @route   PUT /api/teams/:teamId/events/:id
// @access  Private (Admin y TeamAdmin)
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
    let event = await Event.findById(req.params.id);

    if (!event) {
        throw new ErrorResponse('Evento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && event.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para actualizar este evento', 403);
    }

    // Actualizar imagen si se proporciona
    if (req.file) {
        if (event.image) {
            await deleteFile(event.image);
        }
        req.body.image = await uploadFile(req.file, 'event-images');
    }

    req.body.updatedBy = req.user.id;

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Notificar cambios importantes
    if (req.body.date || req.body.location || req.body.status === 'cancelled') {
        await NotificationService.sendCustomNotification(
            {
                title: 'Actualización de Evento',
                body: `Se ha actualizado el evento: ${event!.title}`,
                data: {
                    type: 'EVENT_UPDATE',
                    eventId: event!._id.toString(),
                    teamId: event!.teamId.toString()
                }
            },
            {
                target: 'team_all',
                teamId: event!.teamId.toString()
            }
        );
    }

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Eliminar evento
// @route   DELETE /api/teams/:teamId/events/:id
// @access  Private (Admin y TeamAdmin)
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ErrorResponse('Evento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && event.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para eliminar este evento', 403);
    }

    // Eliminar imagen si existe
    if (event.image) {
        await deleteFile(event.image);
    }

    // Eliminar fotos y videos
    for (const photo of event.photos) {
        await deleteFile(photo);
    }
    for (const video of event.videos) {
        await deleteFile(video);
    }

    await event.deleteOne();

    // Notificar a los participantes
    if (event.participants.length > 0) {
        await NotificationService.sendCustomNotification(
            {
                title: 'Evento Cancelado',
                body: `El evento "${event.title}" ha sido cancelado`,
                data: {
                    type: 'EVENT_CANCELLED',
                    eventId: event._id.toString(),
                    teamId: event.teamId.toString()
                }
            },
            {
                target: 'team_all',
                teamId: event.teamId.toString()
            }
        );
    }

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Registrar participante en evento
// @route   POST /api/teams/:teamId/events/:id/register
// @access  Private
export const registerForEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ErrorResponse('Evento no encontrado', 404);
    }

    // Verificar que el miembro pertenece al equipo
    const member = await Member.findOne({
        _id: req.body.memberId,
        teamId: event.teamId,
        status: 'active'
    });

    if (!member) {
        throw new ErrorResponse('Socio no encontrado o no pertenece a este equipo', 404);
    }

    // Intentar registrar al participante
    const success = await event.addParticipant(
        member._id,
        req.body.photoConsent || false
    );

    if (!success) {
        throw new ErrorResponse('No se pudo registrar al participante', 400);
    }

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Cancelar registro en evento
// @route   DELETE /api/teams/:teamId/events/:id/register
// @access  Private
export const unregisterFromEvent = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ErrorResponse('Evento no encontrado', 404);
    }

    // Verificar que el miembro pertenece al equipo
    const member = await Member.findOne({
        _id: req.body.memberId,
        teamId: event.teamId
    });

    if (!member) {
        throw new ErrorResponse('Socio no encontrado o no pertenece a este equipo', 404);
    }

    // Intentar eliminar al participante
    const success = await event.removeParticipant(member._id);

    if (!success) {
        throw new ErrorResponse('No se pudo cancelar el registro', 400);
    }

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Subir fotos del evento
// @route   POST /api/teams/:teamId/events/:id/photos
// @access  Private (Admin y TeamAdmin)
export const uploadEventPhotos = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ErrorResponse('Evento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && event.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para subir fotos a este evento', 403);
    }

    if (!req.files || !Array.isArray(req.files)) {
        throw new ErrorResponse('Por favor proporcione las fotos', 400);
    }

    const photoUrls = await Promise.all(
        req.files.map(file => uploadFile(file, 'event-photos'))
    );

    event.photos.push(...photoUrls);
    await event.save();

    // Notificar a los participantes
    await NotificationService.sendCustomNotification(
        {
            title: 'Nuevas Fotos',
            body: `Se han añadido nuevas fotos al evento "${event.title}"`,
            data: {
                type: 'EVENT_PHOTOS',
                eventId: event._id.toString(),
                teamId: event.teamId.toString()
            }
        },
        {
            target: 'team_all',
            teamId: event.teamId.toString()
        }
    );

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Subir videos del evento
// @route   POST /api/teams/:teamId/events/:id/videos
// @access  Private (Admin y TeamAdmin)
export const uploadEventVideos = asyncHandler(async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        throw new ErrorResponse('Evento no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && event.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para subir videos a este evento', 403);
    }

    if (!req.files || !Array.isArray(req.files)) {
        throw new ErrorResponse('Por favor proporcione los videos', 400);
    }

    const videoUrls = await Promise.all(
        req.files.map(file => uploadFile(file, 'event-videos'))
    );

    event.videos.push(...videoUrls);
    await event.save();

    // Notificar a los participantes
    await NotificationService.sendCustomNotification(
        {
            title: 'Nuevos Videos',
            body: `Se han añadido nuevos videos al evento "${event.title}"`,
            data: {
                type: 'EVENT_VIDEOS',
                eventId: event._id.toString(),
                teamId: event.teamId.toString()
            }
        },
        {
            target: 'team_all',
            teamId: event.teamId.toString()
        }
    );

    res.status(200).json({
        success: true,
        data: event
    });
});