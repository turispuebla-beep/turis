import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { ExportService } from '../services/exportService';
import { format } from 'date-fns';

// @desc    Exportar listado de jugadores
// @route   GET /api/export/players
// @access  Private (Admin y TeamAdmin)
export const exportPlayers = asyncHandler(async (req: Request, res: Response) => {
    const { teamId, category } = req.query;

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && teamId !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para exportar datos de este equipo', 403);
    }

    const buffer = await ExportService.exportPlayers(
        teamId as string,
        category as string
    );

    const filename = `jugadores_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
});

// @desc    Exportar listado de socios
// @route   GET /api/export/members
// @access  Private (Admin y TeamAdmin)
export const exportMembers = asyncHandler(async (req: Request, res: Response) => {
    const { teamId, status } = req.query;

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && teamId !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para exportar datos de este equipo', 403);
    }

    const buffer = await ExportService.exportMembers(
        teamId as string,
        status as string
    );

    const filename = `socios_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
});

// @desc    Exportar listado de equipos
// @route   GET /api/export/teams
// @access  Private (Admin only)
export const exportTeams = asyncHandler(async (req: Request, res: Response) => {
    // Verificar permisos
    if (req.user.role !== 'admin') {
        throw new ErrorResponse('No autorizado para exportar listado de equipos', 403);
    }

    const buffer = await ExportService.exportTeams();

    const filename = `equipos_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
});

// @desc    Exportar estadísticas de equipo
// @route   GET /api/export/teams/:teamId/stats
// @access  Private (Admin y TeamAdmin)
export const exportTeamStats = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && teamId !== req.user.teamId) {
        throw new ErrorResponse('No autorizado para exportar estadísticas de este equipo', 403);
    }

    const buffer = await ExportService.exportTeamStats(teamId);

    const filename = `estadisticas_equipo_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
});