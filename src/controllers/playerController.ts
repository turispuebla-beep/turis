import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import Player from '../models/Player';
import Team from '../models/Team';

// @desc    Añadir jugador/a a un equipo
// @route   POST /api/teams/:teamId/players
// @access  Private
export const addPlayer = asyncHandler(async (
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

    // Añadir el ID del equipo al jugador/a
    req.body.teamId = req.params.teamId;

    // Calcular edad para validar información de tutores
    const birthDate = new Date(req.body.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();

    if (age < 18 && (!req.body.guardianInfo || req.body.guardianInfo.length === 0)) {
        return res.status(400).json({
            success: false,
            error: 'Para jugadores/as menores de edad, la información del padre/madre/tutor/tutora es obligatoria'
        });
    }

    const player = await Player.create(req.body);

    res.status(201).json({
        success: true,
        data: player
    });
});

// @desc    Obtener todos los/as jugadores/as de un equipo
// @route   GET /api/teams/:teamId/players
// @access  Private
export const getPlayers = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const players = await Player.find({ teamId: req.params.teamId });

    res.status(200).json({
        success: true,
        count: players.length,
        data: players
    });
});

// @desc    Obtener un/a jugador/a específico/a
// @route   GET /api/teams/:teamId/players/:id
// @access  Private
export const getPlayer = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const player = await Player.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!player) {
        return res.status(404).json({
            success: false,
            error: 'Jugador/a no encontrado/a'
        });
    }

    res.status(200).json({
        success: true,
        data: player
    });
});

// @desc    Actualizar un/a jugador/a
// @route   PUT /api/teams/:teamId/players/:id
// @access  Private
export const updatePlayer = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let player = await Player.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!player) {
        return res.status(404).json({
            success: false,
            error: 'Jugador/a no encontrado/a'
        });
    }

    // Validar edad y tutores si se actualiza la fecha de nacimiento
    if (req.body.birthDate) {
        const birthDate = new Date(req.body.birthDate);
        const age = new Date().getFullYear() - birthDate.getFullYear();

        if (age < 18 && (!req.body.guardianInfo || req.body.guardianInfo.length === 0)) {
            return res.status(400).json({
                success: false,
                error: 'Para jugadores/as menores de edad, la información del padre/madre/tutor/tutora es obligatoria'
            });
        }
    }

    player = await Player.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: player
    });
});

// @desc    Eliminar un/a jugador/a
// @route   DELETE /api/teams/:teamId/players/:id
// @access  Private
export const deletePlayer = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const player = await Player.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!player) {
        return res.status(404).json({
            success: false,
            error: 'Jugador/a no encontrado/a'
        });
    }

    await player.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});