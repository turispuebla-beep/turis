import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';

// Generar token JWT
const generateToken = (user: IUser) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
            teamId: user.teamId
        },
        process.env.JWT_SECRET || 'secret',
        {
            expiresIn: process.env.JWT_EXPIRE || '24h'
        }
    );
};

// @desc    Registrar administrador/a de equipo
// @route   POST /api/auth/register
// @access  Private (solo admin)
export const registerTeamAdmin = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password, name, teamId } = req.body;

    const user = await User.create({
        email,
        password,
        name,
        role: 'teamAdmin',
        teamId
    });

    // No enviar la contraseña en la respuesta
    user.password = undefined;

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;

    // Validar email y contraseña
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Por favor proporcione email y contraseña'
        });
    }

    // Verificar usuario/a
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            error: 'Credenciales inválidas'
        });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Credenciales inválidas'
        });
    }

    // No enviar la contraseña en la respuesta
    user.password = undefined;

    // Generar token
    const token = generateToken(user);

    res.status(200).json({
        success: true,
        token,
        data: user
    });
});

// @desc    Obtener usuario/a actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = await User.findById(req.user?.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Actualizar contraseña
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = await User.findById(req.user?.id).select('+password');

    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'Usuario/a no encontrado/a'
        });
    }

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(req.body.currentPassword);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: 'Contraseña actual incorrecta'
        });
    }

    user.password = req.body.newPassword;
    await user.save();

    // Generar nuevo token
    const token = generateToken(user);

    res.status(200).json({
        success: true,
        token
    });
});