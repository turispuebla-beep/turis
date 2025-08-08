import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Card, Title, Paragraph, Chip, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TeamsScreen = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const playersData = await AsyncStorage.getItem('clubPlayers');
      const players = playersData ? JSON.parse(playersData) : [];

      // Agrupar jugadores por categoría
      const teamsData = [
        {
          id: 'prebenjamin',
          name: 'Prebenjamín',
          category: 'Prebenjamín',
          players: players.filter(p => p.category === 'Prebenjamín'),
          color: '#10b981',
        },
        {
          id: 'benjamin',
          name: 'Benjamín',
          category: 'Benjamín',
          players: players.filter(p => p.category === 'Benjamín'),
          color: '#3b82f6',
        },
        {
          id: 'alevin',
          name: 'Alevín',
          category: 'Alevín',
          players: players.filter(p => p.category === 'Alevín'),
          color: '#8b5cf6',
        },
        {
          id: 'infantil',
          name: 'Infantil',
          category: 'Infantil',
          players: players.filter(p => p.category === 'Infantil'),
          color: '#f59e0b',
        },
        {
          id: 'aficionado',
          name: 'Aficionado',
          category: 'Aficionado',
          players: players.filter(p => p.category === 'Aficionado'),
          color: '#ef4444',
        },
      ];

      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPlayer = ({ item }) => (
    <List.Item
      title={`${item.name} ${item.surname}`}
      description={`Dorsal: ${item.dorsal || 'N/A'} | DNI: ${item.dni}`}
      left={(props) => <List.Icon {...props} icon="account" />}
      style={styles.playerItem}
    />
  );

  const renderTeam = ({ item }) => (
    <Card style={[styles.teamCard, { borderLeftColor: item.color }]}>
      <Card.Content>
        <View style={styles.teamHeader}>
          <Title style={styles.teamTitle}>{item.name}</Title>
          <Chip 
            mode="outlined" 
            style={[styles.playerCount, { borderColor: item.color }]}
            textStyle={{ color: item.color }}
          >
            {item.players.length} jugadores
          </Chip>
        </View>

        {item.players.length > 0 ? (
          <FlatList
            data={item.players}
            renderItem={renderPlayer}
            keyExtractor={(player) => player.id}
            scrollEnabled={false}
            style={styles.playersList}
          />
        ) : (
          <Paragraph style={styles.noPlayers}>
            No hay jugadores registrados en esta categoría
          </Paragraph>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando equipos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏆 Equipos del Club</Text>
        <Text style={styles.headerSubtitle}>
          Conoce a nuestros jugadores por categoría
        </Text>
      </View>

      <FlatList
        data={teams}
        renderItem={renderTeam}
        keyExtractor={(team) => team.id}
        scrollEnabled={false}
        style={styles.teamsList}
      />

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.infoTitle}>Información de Equipos</Title>
          <Paragraph style={styles.infoText}>
            • Los equipos están organizados por categorías de edad{'\n'}
            • Cada jugador tiene un dorsal asignado{'\n'}
            • Los datos se actualizan desde el panel de administración{'\n'}
            • Solo se muestran jugadores validados
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
  teamsList: {
    padding: 20,
  },
  teamCard: {
    marginBottom: 20,
    elevation: 4,
    borderLeftWidth: 4,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  playerCount: {
    backgroundColor: 'transparent',
  },
  playersList: {
    marginTop: 10,
  },
  playerItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  noPlayers: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
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

export default TeamsScreen;
