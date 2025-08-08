import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import Match from '../models/Match';
import Player from '../models/Player';
import { uploadFile, deleteFile } from '../services/storageService';
import { NotificationService } from '../services/notificationService';
import { startOfDay, endOfDay, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';

// @desc    Obtener partidos
// @route   GET /api/teams/:teamId/matches
// @access  Private
export const getMatches = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const {
        status,
        competition,
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

    // Filtrar por competición
    if (competition) {
        query.competition = competition;
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

    const matches = await Match.find(query)
        .sort({ date: 1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('players.playerId', 'name surname number')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');

    const total = await Match.countDocuments(query);

    res.status(200).json({
        success: true,
        count: matches.length,
        total,
        pages: Math.ceil(total / Number(limit)),
        data: matches
    });
});

// @desc    Obtener un partido específico
// @route   GET /api/teams/:teamId/matches/:id
// @access  Private
export const getMatch = asyncHandler(async (req: Request, res: Response) => {
    const match = await Match.findById(req.params.id)
        .populate('players.playerId', 'name surname number position')
        .populate('createdBy', 'name')
        .populate('updatedBy', 'name');

    if (!match) {
        throw new ErrorResponse('Partido no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && match.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para ver este partido', 403);
    }

    res.status(200).json({
        success: true,
        data: match
    });
});

// @desc    Crear nuevo partido
// @route   POST /api/teams/:teamId/matches
// @access  Private (Admin y TeamAdmin)
export const createMatch = asyncHandler(async (req: Request, res: Response) => {
    req.body.teamId = req.params.teamId;
    req.body.createdBy = req.user.id;
    req.body.updatedBy = req.user.id;

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && req.body.teamId !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para crear partidos en este equipo', 403);
    }

    const match = await Match.create(req.body);

    // Notificar a los miembros del equipo
    await NotificationService.sendCustomNotification(
        {
            title: 'Nuevo Partido Programado',
            body: `${match.homeTeam} vs ${match.awayTeam} - ${format(match.date, "d 'de' MMMM", { locale: es })}`,
            data: {
                type: 'MATCH',
                matchId: match._id.toString(),
                teamId: match.teamId.toString()
            }
        },
        {
            target: 'team_all',
            teamId: match.teamId.toString()
        }
    );

    res.status(201).json({
        success: true,
        data: match
    });
});

// @desc    Actualizar partido
// @route   PUT /api/teams/:teamId/matches/:id
// @access  Private (Admin y TeamAdmin)
export const updateMatch = asyncHandler(async (req: Request, res: Response) => {
    let match = await Match.findById(req.params.id);

    if (!match) {
        throw new ErrorResponse('Partido no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && match.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para actualizar este partido', 403);
    }

    req.body.updatedBy = req.user.id;

    match = await Match.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Notificar cambios importantes
    if (req.body.status === 'completed' && match!.homeScore !== undefined && match!.awayScore !== undefined) {
        await NotificationService.sendCustomNotification(
            {
                title: 'Resultado Final',
                body: `${match!.homeTeam} ${match!.homeScore} - ${match!.awayScore} ${match!.awayTeam}`,
                data: {
                    type: 'MATCH_RESULT',
                    matchId: match!._id.toString(),
                    teamId: match!.teamId.toString()
                }
            },
            {
                target: 'team_all',
                teamId: match!.teamId.toString()
            }
        );
    } else if (req.body.status === 'postponed') {
        await NotificationService.sendCustomNotification(
            {
                title: 'Partido Pospuesto',
                body: `El partido ${match!.homeTeam} vs ${match!.awayTeam} ha sido pospuesto`,
                data: {
                    type: 'MATCH_POSTPONED',
                    matchId: match!._id.toString(),
                    teamId: match!.teamId.toString()
                }
            },
            {
                target: 'team_all',
                teamId: match!.teamId.toString()
            }
        );
    }

    res.status(200).json({
        success: true,
        data: match
    });
});

// @desc    Eliminar partido
// @route   DELETE /api/teams/:teamId/matches/:id
// @access  Private (Admin y TeamAdmin)
export const deleteMatch = asyncHandler(async (req: Request, res: Response) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        throw new ErrorResponse('Partido no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && match.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para eliminar este partido', 403);
    }

    // Eliminar fotos y videos asociados
    for (const photo of match.photos) {
        await deleteFile(photo);
    }
    for (const video of match.videos) {
        await deleteFile(video);
    }

    await match.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Añadir jugador a partido
// @route   POST /api/teams/:teamId/matches/:id/players
// @access  Private (Admin y TeamAdmin)
export const addPlayer = asyncHandler(async (req: Request, res: Response) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        throw new ErrorResponse('Partido no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && match.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para modificar este partido', 403);
    }

    // Verificar que el jugador pertenece al equipo
    const player = await Player.findOne({
        _id: req.body.playerId,
        teamId: match.teamId
    });

    if (!player) {
        throw new ErrorResponse('Jugador no encontrado o no pertenece a este equipo', 404);
    }

    await match.addPlayer(player._id, req.body.substitute || false);

    res.status(200).json({
        success: true,
        data: match
    });
});

// @desc    Actualizar estadísticas de jugador en partido
// @route   PUT /api/teams/:teamId/matches/:id/players/:playerId
// @access  Private (Admin y TeamAdmin)
export const updatePlayerStats = asyncHandler(async (req: Request, res: Response) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        throw new ErrorResponse('Partido no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && match.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para modificar este partido', 403);
    }

    await match.updatePlayerStats(req.params.playerId, req.body);

    res.status(200).json({
        success: true,
        data: match
    });
});

// @desc    Subir fotos del partido
// @route   POST /api/teams/:teamId/matches/:id/photos
// @access  Private (Admin y TeamAdmin)
export const uploadMatchPhotos = asyncHandler(async (req: Request, res: Response) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        throw new ErrorResponse('Partido no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && match.teamId.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para subir fotos a este partido', 403);
    }

    if (!req.files || !Array.isArray(req.files)) {
        throw new ErrorResponse('Por favor proporcione las fotos', 400);
    }

    const photoUrls = await Promise.all(
        req.files.map(file => uploadFile(file, 'match-photos'))
    );

    match.photos.push(...photoUrls);
    await match.save();

    // Notificar nuevas fotos
    await NotificationService.sendCustomNotification(
        {
            title: 'Nuevas Fotos del Partido',
            body: `Se han añadido nuevas fotos del partido ${match.homeTeam} vs ${match.awayTeam}`,
            data: {
                type: 'MATCH_PHOTOS',
                matchId: match._id.toString(),
                teamId: match.teamId.toString()
            }
        },
        {
            target: 'team_all',
            teamId: match.teamId.toString()
        }
    );

    res.status(200).json({
        success: true,
        data: match
    });
});