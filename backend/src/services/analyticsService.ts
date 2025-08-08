import admin from 'firebase-admin';
import { logger } from '../utils/logger';

interface AnalyticsEvent {
    name: string;
    params: Record<string, any>;
    userId?: string;
    teamId?: string;
    timestamp?: Date;
}

interface UserProperties {
    role: string;
    teamId?: string;
    deviceType: string;
    appVersion: string;
}

export class AnalyticsService {
    private static analytics = admin.analytics();

    public static async logEvent(event: AnalyticsEvent): Promise<void> {
        try {
            await this.analytics.logEvent({
                name: event.name,
                params: {
                    ...event.params,
                    teamId: event.teamId,
                    timestamp: event.timestamp || new Date()
                },
                userId: event.userId
            });
        } catch (error) {
            logger.error('Error logging analytics event:', error);
        }
    }

    public static async setUserProperties(
        userId: string,
        properties: UserProperties
    ): Promise<void> {
        try {
            await this.analytics.setUserProperties(userId, properties);
        } catch (error) {
            logger.error('Error setting user properties:', error);
        }
    }

    // Eventos específicos

    public static async logLogin(
        userId: string,
        success: boolean,
        deviceType: string
    ): Promise<void> {
        await this.logEvent({
            name: 'login',
            params: {
                success,
                deviceType,
                method: 'email'
            },
            userId
        });
    }

    public static async logMediaUpload(
        userId: string,
        teamId: string,
        type: 'photo' | 'video',
        fileSize: number
    ): Promise<void> {
        await this.logEvent({
            name: 'media_upload',
            params: {
                type,
                fileSize,
                success: true
            },
            userId,
            teamId
        });
    }

    public static async logEventCreation(
        userId: string,
        teamId: string,
        eventType: string,
        participantCount: number
    ): Promise<void> {
        await this.logEvent({
            name: 'event_creation',
            params: {
                eventType,
                participantCount
            },
            userId,
            teamId
        });
    }

    public static async logMatchResult(
        userId: string,
        teamId: string,
        category: string,
        result: 'victory' | 'draw' | 'defeat'
    ): Promise<void> {
        await this.logEvent({
            name: 'match_result',
            params: {
                category,
                result
            },
            userId,
            teamId
        });
    }

    public static async logMembershipAction(
        userId: string,
        teamId: string,
        action: 'request' | 'approve' | 'reject',
        processingTime?: number
    ): Promise<void> {
        await this.logEvent({
            name: 'membership_action',
            params: {
                action,
                processingTime
            },
            userId,
            teamId
        });
    }

    public static async logFeatureUsage(
        userId: string,
        teamId: string,
        feature: string,
        action: string,
        duration?: number
    ): Promise<void> {
        await this.logEvent({
            name: 'feature_usage',
            params: {
                feature,
                action,
                duration
            },
            userId,
            teamId
        });
    }

    public static async logError(
        userId: string,
        errorType: string,
        errorMessage: string,
        stackTrace?: string
    ): Promise<void> {
        await this.logEvent({
            name: 'app_error',
            params: {
                errorType,
                errorMessage,
                stackTrace
            },
            userId
        });
    }

    public static async logSync(
        userId: string,
        success: boolean,
        duration: number,
        dataSize: number
    ): Promise<void> {
        await this.logEvent({
            name: 'data_sync',
            params: {
                success,
                duration,
                dataSize
            },
            userId
        });
    }

    public static async logSearch(
        userId: string,
        searchType: string,
        query: string,
        resultCount: number
    ): Promise<void> {
        await this.logEvent({
            name: 'search',
            params: {
                searchType,
                query,
                resultCount
            },
            userId
        });
    }

    public static async logPerformanceMetric(
        userId: string,
        metricName: string,
        value: number,
        context?: Record<string, any>
    ): Promise<void> {
        await this.logEvent({
            name: 'performance_metric',
            params: {
                metricName,
                value,
                ...context
            },
            userId
        });
    }

    // Reportes y agregaciones

    public static async generateDailyReport(): Promise<Record<string, any>> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);

        try {
            const report = await this.analytics.getReport({
                dimensions: ['date', 'eventName'],
                metrics: ['eventCount', 'userCount'],
                dateRanges: [{
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }]
            });

            return report;
        } catch (error) {
            logger.error('Error generating daily report:', error);
            return {};
        }
    }

    public static async getUserEngagementMetrics(
        teamId: string,
        days: number = 30
    ): Promise<Record<string, any>> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        try {
            const metrics = await this.analytics.getReport({
                dimensions: ['userId', 'eventName'],
                metrics: ['eventCount'],
                dateRanges: [{
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }],
                dimensionFilters: {
                    teamId: teamId
                }
            });

            return metrics;
        } catch (error) {
            logger.error('Error getting user engagement metrics:', error);
            return {};
        }
    }
}