import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Card, Title, Paragraph, Chip, List, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarScreen = () => {
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    try {
      // Cargar eventos
      const eventsData = await AsyncStorage.getItem('clubEvents');
      const eventsList = eventsData ? JSON.parse(eventsData) : [];

      // Cargar actividades
      const activitiesData = await AsyncStorage.getItem('clubActivities');
      const activitiesList = activitiesData ? JSON.parse(activitiesData) : [];

      // Ordenar por fecha
      const sortedEvents = eventsList.sort((a, b) => new Date(a.date) - new Date(b.date));
      const sortedActivities = activitiesList.sort((a, b) => new Date(a.date) - new Date(b.date));

      setEvents(sortedEvents);
      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString || 'Por determinar';
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'partido':
        return '⚽';
      case 'entrenamiento':
        return '🏃‍♂️';
      case 'evento':
        return '🎉';
      case 'reunion':
        return '👥';
      default:
        return '📅';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'partido':
        return '#ef4444';
      case 'entrenamiento':
        return '#10b981';
      case 'evento':
        return '#8b5cf6';
      case 'reunion':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const renderEvent = ({ item }) => (
    <Card style={[styles.eventCard, { borderLeftColor: getEventTypeColor(item.type) }]}>
      <Card.Content>
        <View style={styles.eventHeader}>
          <Text style={styles.eventIcon}>{getEventTypeIcon(item.type)}</Text>
          <View style={styles.eventInfo}>
            <Title style={styles.eventTitle}>{item.name}</Title>
            <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
          </View>
          <Chip 
            mode="outlined" 
            style={[styles.eventType, { borderColor: getEventTypeColor(item.type) }]}
            textStyle={{ color: getEventTypeColor(item.type) }}
          >
            {item.type}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏰ Hora:</Text>
            <Text style={styles.detailValue}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>

          {item.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Ubicación:</Text>
              <Text style={styles.detailValue}>{item.location}</Text>
            </View>
          )}

          {item.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📝 Descripción:</Text>
              <Text style={styles.detailValue}>{item.description}</Text>
            </View>
          )}

          {item.price && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💰 Precio:</Text>
              <Text style={styles.detailValue}>{item.price}€</Text>
            </View>
          )}

          {item.minParticipants && item.maxParticipants && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>👥 Participantes:</Text>
              <Text style={styles.detailValue}>
                {item.minParticipants}-{item.maxParticipants}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderActivity = ({ item }) => (
    <Card style={[styles.activityCard, { borderLeftColor: '#3b82f6' }]}>
      <Card.Content>
        <View style={styles.activityHeader}>
          <Text style={styles.activityIcon}>📅</Text>
          <View style={styles.activityInfo}>
            <Title style={styles.activityTitle}>{item.title}</Title>
            <Text style={styles.activityDate}>{formatDate(item.date)}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.activityDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏰ Hora:</Text>
            <Text style={styles.detailValue}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
          </View>

          {item.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Ubicación:</Text>
              <Text style={styles.detailValue}>{item.location}</Text>
            </View>
          )}

          {item.rival && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>⚽ Rival:</Text>
              <Text style={styles.detailValue}>{item.rival}</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando calendario...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Calendario del Club</Text>
        <Text style={styles.headerSubtitle}>
          Eventos, partidos y actividades
        </Text>
      </View>

      {/* Eventos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎉 Eventos</Text>
        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={(event) => event.id}
            scrollEnabled={false}
            style={styles.eventsList}
          />
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No hay eventos programados</Text>
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Actividades */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚽ Actividades</Text>
        {activities.length > 0 ? (
          <FlatList
            data={activities}
            renderItem={renderActivity}
            keyExtractor={(activity) => activity.id}
            scrollEnabled={false}
            style={styles.activitiesList}
          />
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No hay actividades programadas</Text>
            </Card.Content>
          </Card>
        )}
      </View>

      {/* Información */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.infoTitle}>Información del Calendario</Title>
          <Paragraph style={styles.infoText}>
            • Los eventos se actualizan desde el panel de administración{'\n'}
            • Los partidos incluyen información del rival{'\n'}
            • Los eventos pueden tener precio y límite de participantes{'\n'}
            • Las actividades incluyen entrenamientos y partidos
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  eventCard: {
    marginBottom: 15,
    elevation: 4,
    borderLeftWidth: 4,
  },
  activityCard: {
    marginBottom: 15,
    elevation: 4,
    borderLeftWidth: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
  },
  activityInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  eventType: {
    backgroundColor: 'transparent',
  },
  divider: {
    marginVertical: 10,
  },
  eventDetails: {
    marginTop: 10,
  },
  activityDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  emptyCard: {
    elevation: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  infoCard: {
    margin: 20,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export default CalendarScreen;
