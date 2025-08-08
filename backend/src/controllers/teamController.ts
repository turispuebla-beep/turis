import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import Team from '../models/Team';
import User from '../models/User';
import { uploadFile, deleteFile } from '../services/storageService';

// @desc    Obtener todos los equipos
// @route   GET /api/teams
// @access  Private
export const getTeams = asyncHandler(async (req: Request, res: Response) => {
    let query = Team.find();

    // Filtrar por categoría si se especifica
    if (req.query.category) {
        query = query.where('category').equals(req.query.category);
    }

    // Si es admin de equipo, solo ver su equipo
    if (req.user.role === 'teamAdmin') {
        query = query.where('_id').equals(req.user.teamId);
    }

    const teams = await query.populate('admin', 'name email');

    res.status(200).json({
        success: true,
        count: teams.length,
        data: teams
    });
});

// @desc    Obtener un equipo específico
// @route   GET /api/teams/:id
// @access  Private
export const getTeam = asyncHandler(async (req: Request, res: Response) => {
    const team = await Team.findById(req.params.id)
        .populate('admin', 'name email')
        .populate({
            path: 'players',
            select: 'name surname category'
        })
        .populate({
            path: 'members',
            select: 'name surname status'
        });

    if (!team) {
        throw new ErrorResponse('Equipo no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && team._id.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para ver este equipo', 403);
    }

    res.status(200).json({
        success: true,
        data: team
    });
});

// @desc    Crear nuevo equipo
// @route   POST /api/teams
// @access  Private (Admin only)
export const createTeam = asyncHandler(async (req: Request, res: Response) => {
    const { name, category, admin, contactInfo } = req.body;

    // Validar datos requeridos
    if (!name || !category || !admin || !contactInfo) {
        throw new ErrorResponse('Por favor proporcione todos los datos requeridos', 400);
    }

    // Subir logo si se proporciona
    let logoUrl;
    if (req.file) {
        logoUrl = await uploadFile(req.file, 'team-logos');
    }

    // Crear equipo
    const team = await Team.create({
        name,
        category,
        admin,
        contactInfo,
        logo: logoUrl
    });

    res.status(201).json({
        success: true,
        data: team
    });
});

// @desc    Actualizar equipo
// @route   PUT /api/teams/:id
// @access  Private (Admin only)
export const updateTeam = asyncHandler(async (req: Request, res: Response) => {
    let team = await Team.findById(req.params.id);

    if (!team) {
        throw new ErrorResponse('Equipo no encontrado', 404);
    }

    // Subir nuevo logo si se proporciona
    if (req.file) {
        // Eliminar logo anterior si existe
        if (team.logo) {
            await deleteFile(team.logo);
        }
        req.body.logo = await uploadFile(req.file, 'team-logos');
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: team
    });
});

// @desc    Eliminar equipo
// @route   DELETE /api/teams/:id
// @access  Private (Admin only)
export const deleteTeam = asyncHandler(async (req: Request, res: Response) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        throw new ErrorResponse('Equipo no encontrado', 404);
    }

    // Eliminar logo si existe
    if (team.logo) {
        await deleteFile(team.logo);
    }

    // Eliminar administrador del equipo
    await User.findOneAndUpdate(
        { role: 'teamAdmin', teamId: team._id },
        { $unset: { teamId: 1 } }
    );

    await team.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Asignar administrador a equipo
// @route   POST /api/teams/:id/admin
// @access  Private (Admin only)
export const assignTeamAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    // Validar datos requeridos
    if (!email || !password || !name) {
        throw new ErrorResponse('Por favor proporcione email, contraseña y nombre', 400);
    }

    const team = await Team.findById(req.params.id);
    if (!team) {
        throw new ErrorResponse('Equipo no encontrado', 404);
    }

    // Verificar si ya existe un admin para este equipo
    const existingAdmin = await User.findOne({
        role: 'teamAdmin',
        teamId: team._id
    });

    if (existingAdmin) {
        throw new ErrorResponse('Este equipo ya tiene un administrador asignado', 400);
    }

    // Crear nuevo usuario admin de equipo
    const user = await User.create({
        email,
        password,
        name,
        role: 'teamAdmin',
        teamId: team._id
    });

    res.status(201).json({
        success: true,
        data: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            teamId: user.teamId
        }
    });
});

// @desc    Actualizar logo del equipo
// @route   PUT /api/teams/:id/logo
// @access  Private (Admin and TeamAdmin)
export const updateTeamLogo = asyncHandler(async (req: Request, res: Response) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        throw new ErrorResponse('Equipo no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && team._id.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para modificar este equipo', 403);
    }

    if (!req.file) {
        throw new ErrorResponse('Por favor proporcione un archivo de imagen', 400);
    }

    // Eliminar logo anterior si existe
    if (team.logo) {
        await deleteFile(team.logo);
    }

    // Subir nuevo logo
    const logoUrl = await uploadFile(req.file, 'team-logos');

    team.logo = logoUrl;
    await team.save();

    res.status(200).json({
        success: true,
        data: team
    });
});

// @desc    Obtener estadísticas del equipo
// @route   GET /api/teams/:id/stats
// @access  Private
export const getTeamStats = asyncHandler(async (req: Request, res: Response) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        throw new ErrorResponse('Equipo no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && team._id.toString() !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para ver estadísticas de este equipo', 403);
    }

    const stats = await Team.aggregate([
        {
            $match: { _id: team._id }
        },
        {
            $lookup: {
                from: 'players',
                localField: '_id',
                foreignField: 'teamId',
                as: 'players'
            }
        },
        {
            $lookup: {
                from: 'members',
                localField: '_id',
                foreignField: 'teamId',
                as: 'members'
            }
        },
        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: 'teamId',
                as: 'events'
            }
        },
        {
            $project: {
                playerCount: { $size: '$players' },
                memberCount: {
                    $size: {
                        $filter: {
                            input: '$members',
                            as: 'member',
                            cond: { $eq: ['$$member.status', 'active'] }
                        }
                    }
                },
                eventCount: { $size: '$events' },
                category: 1,
                name: 1,
                admin: 1,
                contactInfo: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: stats[0]
    });
});