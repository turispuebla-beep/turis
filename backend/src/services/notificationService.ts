import admin from 'firebase-admin';
import User from '../models/User';
import Team from '../models/Team';
import Player from '../models/Player';
import Member from '../models/Member';
import { logger } from '../utils/logger';

// Tipos para los destinatarios de notificaciones
type NotificationTarget = 
    | 'all'                    // Todos los usuarios
    | 'all_players'            // Todos los jugadores/as
    | 'category_players'       // Jugadores/as de una categoría específica
    | 'all_members'            // Todos los socios/as
    | 'team_members'           // Socios/as de un equipo específico
    | 'team_all';              // Todos los usuarios de un equipo

interface NotificationData {
    title: string;
    body: string;
    data?: Record<string, string>;
    imageUrl?: string;
}

interface NotificationOptions {
    target: NotificationTarget;
    category?: string;        // Para notificaciones por categoría
    teamId?: string;         // Para notificaciones específicas de equipo
}

export class NotificationService {
    private static async getTargetTokens(options: NotificationOptions): Promise<string[]> {
        let users: any[] = [];

        switch (options.target) {
            case 'all':
                users = await User.find({
                    deviceToken: { $exists: true }
                });
                break;

            case 'all_players':
                const playerIds = await Player.distinct('_id');
                users = await User.find({
                    _id: { $in: playerIds },
                    deviceToken: { $exists: true }
                });
                break;

            case 'category_players':
                if (!options.category) {
                    throw new Error('Categoría requerida para notificaciones de categoría específica');
                }
                const categoryTeams = await Team.find({ category: options.category });
                const categoryPlayerIds = await Player.distinct('_id', {
                    teamId: { $in: categoryTeams.map(team => team._id) }
                });
                users = await User.find({
                    _id: { $in: categoryPlayerIds },
                    deviceToken: { $exists: true }
                });
                break;

            case 'all_members':
                const memberIds = await Member.distinct('_id', { status: 'active' });
                users = await User.find({
                    _id: { $in: memberIds },
                    deviceToken: { $exists: true }
                });
                break;

            case 'team_members':
                if (!options.teamId) {
                    throw new Error('ID de equipo requerido para notificaciones de equipo específico');
                }
                const teamMemberIds = await Member.distinct('_id', {
                    teamId: options.teamId,
                    status: 'active'
                });
                users = await User.find({
                    _id: { $in: teamMemberIds },
                    deviceToken: { $exists: true }
                });
                break;

            case 'team_all':
                if (!options.teamId) {
                    throw new Error('ID de equipo requerido para notificaciones de equipo específico');
                }
                const teamPlayerIds = await Player.distinct('_id', { teamId: options.teamId });
                const allTeamMemberIds = await Member.distinct('_id', {
                    teamId: options.teamId,
                    status: 'active'
                });
                users = await User.find({
                    $or: [
                        { _id: { $in: [...teamPlayerIds, ...allTeamMemberIds] } },
                        { role: 'teamAdmin', teamId: options.teamId }
                    ],
                    deviceToken: { $exists: true }
                });
                break;
        }

        return users.map(user => user.deviceToken!).filter(token => token);
    }

    private static async sendToDevices(tokens: string[], notification: NotificationData): Promise<void> {
        if (tokens.length === 0) return;

        try {
            const response = await admin.messaging().sendMulticast({
                tokens,
                notification: {
                    title: notification.title,
                    body: notification.body,
                    imageUrl: notification.imageUrl
                },
                data: notification.data,
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'default',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK'
                    }
                }
            });

            // Manejar tokens inválidos
            if (response.failureCount > 0) {
                const invalidTokens = response.responses
                    .map((resp, idx) => resp.success ? null : tokens[idx])
                    .filter(token => token !== null);

                await User.updateMany(
                    { deviceToken: { $in: invalidTokens } },
                    { $unset: { deviceToken: 1 } }
                );

                logger.info(`Removed ${invalidTokens.length} invalid tokens`);
            }

            logger.info(`Sent notification to ${response.successCount} devices`);
        } catch (error) {
            logger.error('Error sending notifications:', error);
            throw error;
        }
    }

    // Método principal para enviar notificaciones personalizadas
    public static async sendCustomNotification(
        notification: NotificationData,
        options: NotificationOptions
    ): Promise<void> {
        try {
            const tokens = await this.getTargetTokens(options);
            await this.sendToDevices(tokens, notification);

            // Registrar el envío
            logger.info('Custom notification sent', {
                target: options.target,
                category: options.category,
                teamId: options.teamId,
                recipientCount: tokens.length
            });
        } catch (error) {
            logger.error('Error sending custom notification:', error);
            throw error;
        }
    }

    // Ejemplos de uso específico
    public static async sendEventNotification(
        eventTitle: string,
        eventId: string,
        options: NotificationOptions
    ): Promise<void> {
        await this.sendCustomNotification(
            {
                title: 'Nuevo Evento',
                body: `Se ha creado un nuevo evento: ${eventTitle}`,
                data: {
                    type: 'EVENT',
                    eventId,
                    teamId: options.teamId
                }
            },
            options
        );
    }

    public static async sendMatchResultNotification(
        matchDetails: {
            matchId: string;
            homeTeam: string;
            awayTeam: string;
            homeScore: number;
            awayScore: number;
        },
        options: NotificationOptions
    ): Promise<void> {
        const result = `${matchDetails.homeTeam} ${matchDetails.homeScore} - ${matchDetails.awayScore} ${matchDetails.awayTeam}`;
        
        await this.sendCustomNotification(
            {
                title: 'Resultado del Partido',
                body: result,
                data: {
                    type: 'MATCH',
                    matchId: matchDetails.matchId,
                    teamId: options.teamId
                }
            },
            options
        );
    }

    public static async sendAnnouncementNotification(
        title: string,
        message: string,
        options: NotificationOptions
    ): Promise<void> {
        await this.sendCustomNotification(
            {
                title,
                body: message,
                data: {
                    type: 'ANNOUNCEMENT',
                    teamId: options.teamId
                }
            },
            options
        );
    }
}