import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import Member from '../models/Member';
import Team from '../models/Team';

// @desc    Registrar nuevo/a socio/a
// @route   POST /api/teams/:teamId/members
// @access  Private
export const addMember = asyncHandler(async (
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

    // Añadir el ID del equipo al socio/a
    req.body.teamId = req.params.teamId;
    
    // Establecer fecha de registro
    req.body.registrationDate = new Date();

    // Estado inicial pendiente
    req.body.status = 'pending';

    const member = await Member.create(req.body);

    res.status(201).json({
        success: true,
        data: member
    });
});

// @desc    Obtener todos los/as socios/as de un equipo
// @route   GET /api/teams/:teamId/members
// @access  Private
export const getMembers = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let query = { teamId: req.params.teamId };

    // Filtrar por estado si se especifica
    if (req.query.status) {
        query = { ...query, status: req.query.status };
    }

    const members = await Member.find(query);

    res.status(200).json({
        success: true,
        count: members.length,
        data: members
    });
});

// @desc    Obtener un/a socio/a específico/a
// @route   GET /api/teams/:teamId/members/:id
// @access  Private
export const getMember = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const member = await Member.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Socio/a no encontrado/a'
        });
    }

    res.status(200).json({
        success: true,
        data: member
    });
});

// @desc    Actualizar un/a socio/a
// @route   PUT /api/teams/:teamId/members/:id
// @access  Private
export const updateMember = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let member = await Member.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Socio/a no encontrado/a'
        });
    }

    // Si se está actualizando el estado a 'active', establecer fecha de expiración a null
    if (req.body.status === 'active') {
        req.body.expirationDate = null;
    }

    member = await Member.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: member
    });
});

// @desc    Eliminar un/a socio/a
// @route   DELETE /api/teams/:teamId/members/:id
// @access  Private
export const deleteMember = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const member = await Member.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Socio/a no encontrado/a'
        });
    }

    await member.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Actualizar estado de socio/a
// @route   PUT /api/teams/:teamId/members/:id/status
// @access  Private
export const updateMemberStatus = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Estado no válido'
        });
    }

    const member = await Member.findOne({
        _id: req.params.id,
        teamId: req.params.teamId
    });

    if (!member) {
        return res.status(404).json({
            success: false,
            error: 'Socio/a no encontrado/a'
        });
    }

    member.status = status;
    
    // Si se activa, eliminar fecha de expiración
    if (status === 'active') {
        member.expirationDate = undefined;
    }

    await member.save();

    res.status(200).json({
        success: true,
        data: member
    });
});