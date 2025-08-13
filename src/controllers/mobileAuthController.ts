import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';

// @desc    Login para aplicación móvil
// @route   POST /api/v1/mobile/auth/login
// @access  Public
export const mobileLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, deviceToken } = req.body;

    // Validar email y contraseña
    if (!email || !password) {
        throw new ErrorResponse('Por favor proporcione email y contraseña', 400);
    }

    // Buscar usuario
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ErrorResponse('Credenciales inválidas', 401);
    }

    // Verificar contraseña
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ErrorResponse('Credenciales inválidas', 401);
    }

    // Actualizar token de dispositivo si se proporciona
    if (deviceToken) {
        user.deviceToken = deviceToken;
        await user.save();
    }

    // Generar token JWT
    const token = generateToken(user);

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            teamId: user.teamId
        },
        expiresIn: 86400 // 24 horas
    });
});

// @desc    Actualizar token de dispositivo
// @route   PUT /api/v1/mobile/auth/device-token
// @access  Private
export const updateDeviceToken = asyncHandler(async (req: Request, res: Response) => {
    const { deviceToken } = req.body;

    if (!deviceToken) {
        throw new ErrorResponse('Por favor proporcione el token del dispositivo', 400);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        throw new ErrorResponse('Usuario no encontrado', 404);
    }

    user.deviceToken = deviceToken;
    await user.save();

    res.status(200).json({
        success: true,
        data: {}
    });
});