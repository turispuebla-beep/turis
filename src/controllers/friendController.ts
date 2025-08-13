import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import Friend from '../models/Friend';
import Team from '../models/Team';

// @desc    Registrar nuevo/a amigo/a del club
// @route   POST /api/teams/:teamId/friends
// @access  Private
export const addFriend = asyncHandler(async (
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

    // Añadir el ID del equipo al amigo/a
    req.body.teamId = req.params.teamId;

    const friend = await Friend.create(req.body);

    res.status(201).json({
        success: true,
        data: friend
    });
});

// @desc    Obtener todos los/as amigos/as de un equipo
// @route   GET /api/teams/:teamId/friends
// @access  Private
export const getFriends = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const friends = await Friend.find({ teamId: req.params.teamId });

    res.status(200).json({
        success: true,
        count: friends.length,
        data: friends
    });
});

// @desc    Obtener un/a amigo/a específico/a
// @route   GET /api/teams/:teamId/friends/:id
// @access  Private
export const getFriend = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const friend = await Friend.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!friend) {
        return res.status(404).json({
            success: false,
            error: 'Amigo/a del club no encontrado/a'
        });
    }

    res.status(200).json({
        success: true,
        data: friend
    });
});

// @desc    Actualizar un/a amigo/a
// @route   PUT /api/teams/:teamId/friends/:id
// @access  Private
export const updateFriend = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let friend = await Friend.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!friend) {
        return res.status(404).json({
            success: false,
            error: 'Amigo/a del club no encontrado/a'
        });
    }

    friend = await Friend.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: friend
    });
});

// @desc    Eliminar un/a amigo/a
// @route   DELETE /api/teams/:teamId/friends/:id
// @access  Private
export const deleteFriend = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const friend = await Friend.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!friend) {
        return res.status(404).json({
            success: false,
            error: 'Amigo/a del club no encontrado/a'
        });
    }

    await friend.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});