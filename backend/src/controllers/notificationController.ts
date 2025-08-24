import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { NotificationService } from '../services/notificationService';
import { validateNotificationTarget } from '../utils/validators';

// @desc    Enviar notificación personalizada
// @route   POST /api/notifications/send
// @access  Private (Admin y TeamAdmin)
export const sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { title, body, target, category, teamId, imageUrl, data } = req.body;

    // Validar campos requeridos
    if (!title || !body || !target) {
        throw new ErrorResponse('Por favor proporcione título, mensaje y destinatarios', 400);
    }

    // Validar target
    if (!validateNotificationTarget(target)) {
        throw new ErrorResponse('Destinatario no válido', 400);
    }

    // Validar permisos según el target
    if (req.user?.role === 'team_admin') {
        // Los admin de equipo solo pueden enviar a su equipo
        if (!['team_members', 'team_all'].includes(target)) {
            throw new ErrorResponse('No autorizado para enviar a estos destinatarios', 403);
        }
        if (teamId !== req.user.teamId) {
            throw new ErrorResponse('Solo puede enviar notificaciones a su equipo', 403);
        }
    }

    // Validar categoría si es necesaria
    if (target === 'category_players' && !category) {
        throw new ErrorResponse('Categoría requerida para notificaciones por categoría', 400);
    }

    // Validar teamId si es necesario
    if (['team_members', 'team_all'].includes(target) && !teamId) {
        throw new ErrorResponse('ID de equipo requerido para notificaciones de equipo', 400);
    }

    await NotificationService.sendCustomNotification(
        {
            title,
            body,
            imageUrl,
            data
        },
        {
            target,
            category,
            teamId
        }
    );

    res.status(200).json({
        success: true,
        message: 'Notificación enviada correctamente'
    });
});

// @desc    Obtener estadísticas de notificaciones
// @route   GET /api/notifications/stats
// @access  Private (Admin y TeamAdmin)
export const getNotificationStats = asyncHandler(async (req: Request, res: Response) => {
    // Implementar estadísticas de envío de notificaciones
    res.status(200).json({
        success: true,
        data: {
            // Implementar estadísticas
        }
    });
});