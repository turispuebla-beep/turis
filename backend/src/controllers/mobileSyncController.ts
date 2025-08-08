import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import Team from '../models/Team';
import Player from '../models/Player';
import Member from '../models/Member';
import Event from '../models/Event';
import Media from '../models/Media';
import sharp from 'sharp';
import path from 'path';

// @desc    Sincronizar datos para la app móvil
// @route   GET /api/v1/mobile/sync
// @access  Private
export const syncData = asyncHandler(async (req: Request, res: Response) => {
    const lastSyncTime = new Date(req.headers['last-sync-time'] as string || '1970-01-01');
    const currentTime = new Date();

    // Obtener actualizaciones basadas en el tiempo de última sincronización
    const updates = {
        teams: await getTeamUpdates(req.user, lastSyncTime),
        players: await getPlayerUpdates(req.user, lastSyncTime),
        members: await getMemberUpdates(req.user, lastSyncTime),
        events: await getEventUpdates(req.user, lastSyncTime),
        media: await getMediaUpdates(req.user, lastSyncTime)
    };

    // Obtener eliminaciones
    const deletions = {
        teams: await getTeamDeletions(req.user, lastSyncTime),
        players: await getPlayerDeletions(req.user, lastSyncTime),
        members: await getMemberDeletions(req.user, lastSyncTime),
        events: await getEventDeletions(req.user, lastSyncTime),
        media: await getMediaDeletions(req.user, lastSyncTime)
    };

    res.status(200).json({
        success: true,
        data: {
            updates,
            deletions,
            syncTime: currentTime.toISOString()
        }
    });
});

// @desc    Obtener media optimizada para dispositivos móviles
// @route   GET /api/v1/mobile/media/:id
// @access  Private
export const getOptimizedMedia = asyncHandler(async (req: Request, res: Response) => {
    const media = await Media.findById(req.params.id);
    if (!media) {
        throw new ErrorResponse('Medio no encontrado', 404);
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && media.teamId.toString() !== req.user.teamId?.toString()) {
        throw new ErrorResponse('No autorizado', 403);
    }

    const deviceWidth = parseInt(req.headers['device-width'] as string) || 1080;
    const deviceDpi = parseInt(req.headers['device-dpi'] as string) || 440;

    // Calcular dimensiones óptimas
    const targetWidth = Math.min(deviceWidth, 1920); // Máximo 1920px
    const quality = deviceDpi > 440 ? 90 : 80; // Calidad basada en DPI

    if (media.type === 'photo') {
        const filePath = path.join(process.cwd(), media.url);
        
        // Optimizar imagen
        const optimizedImage = await sharp(filePath)
            .resize(targetWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality })
            .toBuffer();

        res.set('Content-Type', 'image/jpeg');
        return res.send(optimizedImage);
    }

    // Para videos, redirigir al archivo original
    res.redirect(media.url);
});

// Funciones auxiliares para obtener actualizaciones
async function getTeamUpdates(user: any, lastSyncTime: Date) {
    const query = user.role === 'admin' 
        ? { updatedAt: { $gt: lastSyncTime } }
        : { 
            updatedAt: { $gt: lastSyncTime },
            _id: user.teamId
        };
    
    return await Team.find(query);
}

async function getPlayerUpdates(user: any, lastSyncTime: Date) {
    const query = user.role === 'admin'
        ? { updatedAt: { $gt: lastSyncTime } }
        : {
            updatedAt: { $gt: lastSyncTime },
            teamId: user.teamId
        };
    
    return await Player.find(query);
}

async function getMemberUpdates(user: any, lastSyncTime: Date) {
    const query = user.role === 'admin'
        ? { updatedAt: { $gt: lastSyncTime } }
        : {
            updatedAt: { $gt: lastSyncTime },
            teamId: user.teamId
        };
    
    return await Member.find(query);
}

async function getEventUpdates(user: any, lastSyncTime: Date) {
    const query = user.role === 'admin'
        ? { updatedAt: { $gt: lastSyncTime } }
        : {
            updatedAt: { $gt: lastSyncTime },
            teamId: user.teamId
        };
    
    return await Event.find(query);
}

async function getMediaUpdates(user: any, lastSyncTime: Date) {
    const query = user.role === 'admin'
        ? { updatedAt: { $gt: lastSyncTime } }
        : {
            updatedAt: { $gt: lastSyncTime },
            teamId: user.teamId
        };
    
    return await Media.find(query);
}

// Funciones auxiliares para obtener eliminaciones
async function getTeamDeletions(user: any, lastSyncTime: Date) {
    // Implementar lógica de soft delete o registro de eliminaciones
    return [];
}

async function getPlayerDeletions(user: any, lastSyncTime: Date) {
    // Implementar lógica de soft delete o registro de eliminaciones
    return [];
}

async function getMemberDeletions(user: any, lastSyncTime: Date) {
    // Implementar lógica de soft delete o registro de eliminaciones
    return [];
}

async function getEventDeletions(user: any, lastSyncTime: Date) {
    // Implementar lógica de soft delete o registro de eliminaciones
    return [];
}

async function getMediaDeletions(user: any, lastSyncTime: Date) {
    // Implementar lógica de soft delete o registro de eliminaciones
    return [];
}