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
    imageUrl?: string;
    data?: any;
}

interface NotificationTarget {
    target: string;
    category?: string;
    teamId?: string;
    memberId?: string;
}

export class NotificationService {
    static async sendCustomNotification(
        data: NotificationData,
        target: NotificationTarget
    ): Promise<void> {
        // Implementación básica - en producción se conectaría con FCM, OneSignal, etc.
        console.log('Enviando notificación:', {
            data,
            target,
            timestamp: new Date().toISOString()
        });
        
        // Aquí se implementaría la lógica real de envío de notificaciones
        // Por ahora solo simulamos el envío
        return Promise.resolve();
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