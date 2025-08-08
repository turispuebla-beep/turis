import api from './api';
import { TeamEvent } from '../types/team';

export interface EventFilters {
    search?: string;
    type?: string;
    status?: 'upcoming' | 'completed' | 'cancelled';
    teamId?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy?: 'date' | 'type' | 'team';
    sortOrder?: 'asc' | 'desc';
}

export interface EventAttendance {
    playerId: string;
    status: 'confirmed' | 'declined' | 'pending';
    notes?: string;
}

export interface EventReminder {
    id: string;
    eventId: string;
    type: 'email' | 'push' | 'sms';
    minutesBefore: number;
    status: 'pending' | 'sent' | 'failed';
}

export const sharedEventService = {
    /**
     * Obtiene todos los eventos
     */
    async getEvents(filters?: EventFilters): Promise<TeamEvent[]> {
        const response = await api.get('/events', {
            params: {
                ...filters,
                startDate: filters?.startDate?.toISOString(),
                endDate: filters?.endDate?.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Obtiene un evento por ID
     */
    async getEventById(eventId: string): Promise<TeamEvent> {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
    },

    /**
     * Crea un nuevo evento
     */
    async createEvent(event: Omit<TeamEvent, 'id'>): Promise<TeamEvent> {
        const response = await api.post('/events', event);
        return response.data;
    },

    /**
     * Actualiza un evento existente
     */
    async updateEvent(eventId: string, event: Partial<TeamEvent>): Promise<TeamEvent> {
        const response = await api.put(`/events/${eventId}`, event);
        return response.data;
    },

    /**
     * Elimina un evento
     */
    async deleteEvent(eventId: string): Promise<void> {
        await api.delete(`/events/${eventId}`);
    },

    /**
     * Obtiene la asistencia a un evento
     */
    async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
        const response = await api.get(`/events/${eventId}/attendance`);
        return response.data;
    },

    /**
     * Actualiza la asistencia de un jugador a un evento
     */
    async updateAttendance(eventId: string, attendance: EventAttendance): Promise<EventAttendance> {
        const response = await api.put(`/events/${eventId}/attendance/${attendance.playerId}`, attendance);
        return response.data;
    },

    /**
     * Actualiza la asistencia de múltiples jugadores
     */
    async updateBulkAttendance(eventId: string, attendances: EventAttendance[]): Promise<EventAttendance[]> {
        const response = await api.put(`/events/${eventId}/attendance`, { attendances });
        return response.data;
    },

    /**
     * Obtiene los recordatorios de un evento
     */
    async getEventReminders(eventId: string): Promise<EventReminder[]> {
        const response = await api.get(`/events/${eventId}/reminders`);
        return response.data;
    },

    /**
     * Crea un recordatorio para un evento
     */
    async createReminder(eventId: string, reminder: Omit<EventReminder, 'id' | 'eventId' | 'status'>): Promise<EventReminder> {
        const response = await api.post(`/events/${eventId}/reminders`, reminder);
        return response.data;
    },

    /**
     * Elimina un recordatorio
     */
    async deleteReminder(eventId: string, reminderId: string): Promise<void> {
        await api.delete(`/events/${eventId}/reminders/${reminderId}`);
    },

    /**
     * Obtiene eventos por rango de fechas
     */
    async getEventsByDateRange(startDate: Date, endDate: Date): Promise<TeamEvent[]> {
        const response = await api.get('/events/range', {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });
        return response.data;
    },

    /**
     * Obtiene eventos recurrentes
     */
    async getRecurringEvents(): Promise<TeamEvent[]> {
        const response = await api.get('/events/recurring');
        return response.data;
    },

    /**
     * Crea una serie de eventos recurrentes
     */
    async createRecurringEvents(event: Omit<TeamEvent, 'id'> & {
        recurrence: {
            frequency: 'daily' | 'weekly' | 'monthly';
            interval: number;
            endDate: Date;
            daysOfWeek?: number[];
        };
    }): Promise<TeamEvent[]> {
        const response = await api.post('/events/recurring', event);
        return response.data;
    },

    /**
     * Cancela un evento
     */
    async cancelEvent(eventId: string, reason?: string): Promise<TeamEvent> {
        const response = await api.post(`/events/${eventId}/cancel`, { reason });
        return response.data;
    },

    /**
     * Reprograma un evento
     */
    async rescheduleEvent(eventId: string, newDate: Date): Promise<TeamEvent> {
        const response = await api.post(`/events/${eventId}/reschedule`, {
            newDate: newDate.toISOString()
        });
        return response.data;
    },

    /**
     * Obtiene conflictos de horarios para un evento
     */
    async getScheduleConflicts(event: Partial<TeamEvent>): Promise<{
        conflictingEvents: TeamEvent[];
        playerConflicts: {
            playerId: string;
            conflictingEvents: TeamEvent[];
        }[];
    }> {
        const response = await api.post('/events/check-conflicts', event);
        return response.data;
    },

    /**
     * Exporta eventos a formato iCal
     */
    async exportToICal(eventIds: string[]): Promise<Blob> {
        const response = await api.post('/events/export/ical', { eventIds }, {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Obtiene estadísticas de asistencia
     */
    async getAttendanceStats(filters?: {
        teamId?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        totalEvents: number;
        averageAttendance: number;
        playerStats: {
            playerId: string;
            attendanceRate: number;
            totalAttended: number;
            totalMissed: number;
        }[];
    }> {
        const response = await api.get('/events/attendance-stats', {
            params: {
                ...filters,
                startDate: filters?.startDate?.toISOString(),
                endDate: filters?.endDate?.toISOString()
            }
        });
        return response.data;
    }
};