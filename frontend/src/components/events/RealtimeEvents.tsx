import React from 'react';
import { useRealtimeEvents } from '../../hooks/useRealtimeSync';
import { Event, EventType } from '../../services/RealtimeSyncService';
import './RealtimeEvents.css';

interface RealtimeEventsProps {
    teamId: string;
}

export const RealtimeEvents: React.FC<RealtimeEventsProps> = ({ teamId }) => {
    const { events, loading, error } = useRealtimeEvents(teamId);

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventTypeIcon = (type: EventType) => {
        switch (type) {
            case EventType.TRAINING:
                return '🏃‍♂️';
            case EventType.MATCH:
                return '⚽';
            case EventType.MEETING:
                return '👥';
            case EventType.TOURNAMENT:
                return '🏆';
            default:
                return '📅';
        }
    };

    const getEventTypeColor = (type: EventType) => {
        switch (type) {
            case EventType.TRAINING:
                return '#28a745';
            case EventType.MATCH:
                return '#dc3545';
            case EventType.MEETING:
                return '#007bff';
            case EventType.TOURNAMENT:
                return '#ffc107';
            default:
                return '#6c757d';
        }
    };

    if (loading) {
        return (
            <div className="events-loading">
                <div className="loading-spinner"></div>
                <p>Cargando eventos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="events-error">
                <p>Error al cargar eventos: {error}</p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="events-empty">
                <p>No hay eventos programados</p>
            </div>
        );
    }

    return (
        <div className="realtime-events">
            <div className="events-header">
                <h3>Eventos del Equipo</h3>
                <span className="events-count">{events.length} eventos</span>
            </div>

            <div className="events-list">
                {events.map((event) => (
                    <div key={event.id} className="event-card">
                        <div className="event-header">
                            <div className="event-type">
                                <span className="event-icon">{getEventTypeIcon(event.type)}</span>
                                <span 
                                    className="event-type-badge"
                                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                                >
                                    {event.type}
                                </span>
                            </div>
                            <div className="event-status">
                                {event.isActive ? (
                                    <span className="status-active">Activo</span>
                                ) : (
                                    <span className="status-inactive">Cancelado</span>
                                )}
                            </div>
                        </div>

                        <div className="event-content">
                            <h4 className="event-title">{event.title}</h4>
                            <p className="event-description">{event.description}</p>
                            
                            <div className="event-details">
                                <div className="event-detail">
                                    <span className="detail-icon">📅</span>
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                
                                {event.location && (
                                    <div className="event-detail">
                                        <span className="detail-icon">📍</span>
                                        <span>{event.location}</span>
                                    </div>
                                )}
                                
                                <div className="event-detail">
                                    <span className="detail-icon">🔒</span>
                                    <span>
                                        Verificación: {
                                            event.verificationType === 'NONE' ? 'No requerida' :
                                            event.verificationType === 'ADMIN_APPROVAL' ? 'Aprobación del admin' :
                                            'Documento requerido'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="event-actions">
                            <button className="btn-primary">Ver detalles</button>
                            <button className="btn-secondary">Confirmar asistencia</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 