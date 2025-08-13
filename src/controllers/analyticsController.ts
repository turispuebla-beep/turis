import type { Request, Response } from 'express';
import { asyncHandler } from '../middleware/async';
import User from '../models/User';
import Team from '../models/Team';
import Event from '../models/Event';
import Match from '../models/Match';
import Media from '../models/Media';
import { AnalyticsService } from '../services/analyticsService';
import { subDays, startOfDay, endOfDay } from 'date-fns';

// @desc    Obtener datos para el dashboard
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
export const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const range = req.query.range || '7d';
    const endDate = endOfDay(new Date());
    let startDate: Date;

    switch (range) {
        case '30d':
            startDate = startOfDay(subDays(endDate, 30));
            break;
        case '90d':
            startDate = startOfDay(subDays(endDate, 90));
            break;
        default: // 7d
            startDate = startOfDay(subDays(endDate, 7));
    }

    // Estadísticas de usuarios
    const userStats = await User.aggregate([
        {
            $facet: {
                'totalUsers': [
                    { $count: 'count' }
                ],
                'activeUsers': [
                    {
                        $match: {
                            lastLoginAt: { $gte: startDate }
                        }
                    },
                    { $count: 'count' }
                ],
                'newUsers': [
                    {
                        $match: {
                            createdAt: { $gte: startDate }
                        }
                    },
                    { $count: 'count' }
                ],
                'usersByRole': [
                    {
                        $group: {
                            _id: '$role',
                            count: { $sum: 1 }
                        }
                    }
                ]
            }
        }
    ]);

    // Estadísticas de equipos
    const teamStats = await Team.aggregate([
        {
            $facet: {
                'totalTeams': [
                    { $count: 'count' }
                ],
                'playersByCategory': [
                    {
                        $group: {
                            _id: '$category',
                            count: { $sum: '$playerCount' }
                        }
                    },
                    {
                        $project: {
                            category: '$_id',
                            count: 1,
                            _id: 0
                        }
                    }
                ],
                'membersByTeam': [
                    {
                        $project: {
                            team: '$name',
                            count: '$memberCount'
                        }
                    }
                ]
            }
        }
    ]);

    // Estadísticas de actividad
    const activityStats = {
        eventsCreated: await Event.countDocuments({ createdAt: { $gte: startDate } }),
        matchesRecorded: await Match.countDocuments({ createdAt: { $gte: startDate } }),
        mediaUploaded: await Media.countDocuments({ createdAt: { $gte: startDate } }),
        notificationsSent: await AnalyticsService.getNotificationCount(startDate)
    };

    // Datos de engagement diario
    const engagementData = await User.aggregate([
        {
            $match: {
                lastLoginAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastLoginAt' } },
                logins: { $sum: 1 },
                actions: { $sum: '$activityCount' }
            }
        },
        {
            $project: {
                date: '$_id',
                logins: 1,
                actions: 1,
                _id: 0
            }
        },
        {
            $sort: { date: 1 }
        }
    ]);

    // Formatear datos de usuarios por rol
    const usersByRole = {
        admin: 0,
        teamAdmin: 0,
        player: 0,
        member: 0
    };

    userStats[0].usersByRole.forEach((role: any) => {
        usersByRole[role._id] = role.count;
    });

    res.status(200).json({
        success: true,
        data: {
            userStats: {
                totalUsers: userStats[0].totalUsers[0]?.count || 0,
                activeUsers: userStats[0].activeUsers[0]?.count || 0,
                newUsers: userStats[0].newUsers[0]?.count || 0,
                usersByRole
            },
            teamStats: {
                totalTeams: teamStats[0].totalTeams[0]?.count || 0,
                playersByCategory: teamStats[0].playersByCategory,
                membersByTeam: teamStats[0].membersByTeam
            },
            activityStats,
            engagementData
        }
    });
});

// @desc    Obtener estadísticas de un equipo específico
// @route   GET /api/analytics/teams/:teamId
// @access  Private (Admin y TeamAdmin)
export const getTeamAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const range = req.query.range || '7d';
    const endDate = endOfDay(new Date());
    let startDate: Date;

    switch (range) {
        case '30d':
            startDate = startOfDay(subDays(endDate, 30));
            break;
        case '90d':
            startDate = startOfDay(subDays(endDate, 90));
            break;
        default: // 7d
            startDate = startOfDay(subDays(endDate, 7));
    }

    // Verificar permisos
    if (req.user.role === 'teamAdmin' && req.user.teamId !== teamId) {
        return res.status(403).json({
            success: false,
            error: 'No autorizado para ver estadísticas de este equipo'
        });
    }

    const teamStats = await Promise.all([
        // Estadísticas de jugadores
        Match.aggregate([
            {
                $match: {
                    teamId,
                    date: { $gte: startDate }
                }
            },
            {
                $unwind: '$players'
            },
            {
                $group: {
                    _id: '$players.playerId',
                    matches: { $sum: 1 },
                    goals: { $sum: '$players.goals' },
                    assists: { $sum: '$players.assists' },
                    yellowCards: { $sum: '$players.yellowCards' },
                    redCards: { $sum: { $cond: ['$players.redCard', 1, 0] } },
                    minutesPlayed: { $sum: '$players.minutesPlayed' }
                }
            }
        ]),

        // Estadísticas de eventos
        Event.aggregate([
            {
                $match: {
                    teamId,
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEvents: { $sum: 1 },
                    avgParticipants: { $avg: { $size: '$participants' } },
                    maxParticipants: { $max: { $size: '$participants' } }
                }
            }
        ]),

        // Estadísticas de medios
        Media.aggregate([
            {
                $match: {
                    teamId,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    res.status(200).json({
        success: true,
        data: {
            playerStats: teamStats[0],
            eventStats: teamStats[1][0] || {
                totalEvents: 0,
                avgParticipants: 0,
                maxParticipants: 0
            },
            mediaStats: teamStats[2].reduce((acc: any, curr: any) => {
                acc[curr._id] = curr.count;
                return acc;
            }, { photo: 0, video: 0 })
        }
    });
});