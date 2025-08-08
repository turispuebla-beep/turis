import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  // Datos de ejemplo para notificaciones
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        title: '🏆 Partido de Liga',
        message: 'Mañana a las 18:00h partido contra Real Madrid en casa',
        type: 'match',
        date: '2024-01-15',
        time: '18:00',
        read: false,
        priority: 'high',
      },
      {
        id: 2,
        title: '📅 Entrenamiento',
        message: 'Entrenamiento especial este sábado a las 10:00h',
        type: 'training',
        date: '2024-01-13',
        time: '10:00',
        read: true,
        priority: 'medium',
      },
      {
        id: 3,
        title: '🎉 Evento Social',
        message: 'Cena de equipo el próximo viernes en el restaurante del club',
        type: 'event',
        date: '2024-01-19',
        time: '21:00',
        read: false,
        priority: 'low',
      },
      {
        id: 4,
        title: '📋 Reunión de Padres',
        message: 'Reunión informativa para padres de jugadores infantiles',
        type: 'meeting',
        date: '2024-01-20',
        time: '19:30',
        read: true,
        priority: 'medium',
      },
      {
        id: 5,
        title: '⚽ Torneo Local',
        message: 'Inscripciones abiertas para el torneo de verano',
        type: 'tournament',
        date: '2024-01-25',
        time: '09:00',
        read: false,
        priority: 'high',
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'match':
        return 'sports-soccer';
      case 'training':
        return 'fitness-center';
      case 'event':
        return 'event';
      case 'meeting':
        return 'people';
      case 'tournament':
        return 'emoji-events';
      default:
        return 'notifications';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'match':
        return '#dc2626';
      case 'training':
        return '#3b82f6';
      case 'event':
        return '#f59e0b';
      case 'meeting':
        return '#059669';
      case 'tournament':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    Alert.alert(
      'Eliminar Notificación',
      '¿Estás seguro de que quieres eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
          },
        },
      ]
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📢 Notificaciones</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <Chip
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={[styles.filterChip, filter === 'all' && styles.selectedChip]}
          textStyle={[styles.filterText, filter === 'all' && styles.selectedFilterText]}
        >
          Todas
        </Chip>
        <Chip
          selected={filter === 'unread'}
          onPress={() => setFilter('unread')}
          style={[styles.filterChip, filter === 'unread' && styles.selectedChip]}
          textStyle={[styles.filterText, filter === 'unread' && styles.selectedFilterText]}
        >
          No leídas ({unreadCount})
        </Chip>
        <Chip
          selected={filter === 'match'}
          onPress={() => setFilter('match')}
          style={[styles.filterChip, filter === 'match' && styles.selectedChip]}
          textStyle={[styles.filterText, filter === 'match' && styles.selectedFilterText]}
        >
          Partidos
        </Chip>
        <Chip
          selected={filter === 'event'}
          onPress={() => setFilter('event')}
          style={[styles.filterChip, filter === 'event' && styles.selectedChip]}
          textStyle={[styles.filterText, filter === 'event' && styles.selectedFilterText]}
        >
          Eventos
        </Chip>
      </ScrollView>

      {/* Lista de notificaciones */}
      <ScrollView style={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="notifications-off" size={64} color="#9ca3af" />
              <Text style={styles.emptyText}>No hay notificaciones</Text>
              <Text style={styles.emptySubtext}>
                {filter === 'all' 
                  ? 'No tienes notificaciones por el momento'
                  : 'No hay notificaciones con este filtro'
                }
              </Text>
            </Card.Content>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
            >
              <Card.Content>
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationInfo}>
                    <View style={styles.titleRow}>
                      <Icon
                        name={getTypeIcon(notification.type)}
                        size={24}
                        color={getTypeColor(notification.type)}
                        style={styles.typeIcon}
                      />
                      <Title style={styles.notificationTitle}>
                        {notification.title}
                      </Title>
                    </View>
                    <View style={styles.metaRow}>
                      <Text style={styles.notificationDate}>
                        {notification.date} - {notification.time}
                      </Text>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(notification.priority) }
                      ]}>
                        <Text style={styles.priorityText}>
                          {notification.priority === 'high' ? 'Alta' :
                           notification.priority === 'medium' ? 'Media' : 'Baja'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {!notification.read && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
                
                <Paragraph style={styles.notificationMessage}>
                  {notification.message}
                </Paragraph>

                <View style={styles.notificationActions}>
                  {!notification.read && (
                    <Button
                      mode="text"
                      onPress={() => markAsRead(notification.id)}
                      style={styles.actionButton}
                      labelStyle={styles.actionButtonText}
                    >
                      Marcar como leída
                    </Button>
                  )}
                  <Button
                    mode="text"
                    onPress={() => deleteNotification(notification.id)}
                    style={styles.actionButton}
                    labelStyle={[styles.actionButtonText, { color: '#dc2626' }]}
                  >
                    Eliminar
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Botón de acción rápida */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => Alert.alert('Configuración', 'Configuración de notificaciones próximamente')}
        >
          <Icon name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#dc2626',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  badge: {
    backgroundColor: '#fbbf24',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filtersContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterChip: {
    marginRight: 10,
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
  },
  selectedChip: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  filterText: {
    color: '#6b7280',
  },
  selectedFilterText: {
    color: 'white',
  },
  notificationsList: {
    flex: 1,
    padding: 15,
  },
  emptyCard: {
    marginTop: 50,
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 5,
  },
  notificationCard: {
    marginBottom: 15,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  notificationInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  typeIcon: {
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
    marginLeft: 10,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 15,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 10,
  },
  actionButtonText: {
    fontSize: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
