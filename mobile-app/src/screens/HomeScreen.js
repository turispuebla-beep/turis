import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#dc2626', '#3b82f6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Icon name="sports-soccer" size={60} color="white" />
          </View>
          <Text style={styles.title}>CDSANABRIACF</Text>
          <Text style={styles.subtitle}>Club Deportivo Sanabriacf</Text>
          
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>
                ¡Bienvenido, {user.name}!
              </Text>
              <Text style={styles.userType}>
                {user.type === 'socio' ? '👨‍👩‍👧‍👦 Socio' : '🤝 Amigo del Club'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Información de fecha y hora */}
      <Card style={styles.timeCard}>
        <Card.Content>
          <View style={styles.timeContainer}>
            <Icon name="schedule" size={24} color="#dc2626" />
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
        </Card.Content>
      </Card>

      {/* Accesos rápidos */}
      <View style={styles.quickAccess}>
        <Text style={styles.sectionTitle}>Accesos Rápidos</Text>
        
        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate('Teams')}
          >
            <Icon name="sports-soccer" size={32} color="#dc2626" />
            <Text style={styles.buttonText}>Equipos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Icon name="calendar-today" size={32} color="#3b82f6" />
            <Text style={styles.buttonText}>Calendario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="person" size={32} color="#059669" />
            <Text style={styles.buttonText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications" size={32} color="#f59e0b" />
            <Text style={styles.buttonText}>Notificaciones</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Información del club */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>🏆 Sobre CDSANABRIACF</Title>
          <Paragraph style={styles.cardText}>
            Club Deportivo Sanabriacf - Un equipo con tradición, pasión y compromiso con el fútbol. 
            Formamos parte de la familia TURISTEAM.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Estadísticas rápidas */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>📊 Estadísticas</Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Equipos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Jugadores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100+</Text>
              <Text style={styles.statLabel}>Socios</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Botón de cerrar sesión */}
      {user && (
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonText}
          >
            Cerrar Sesión
          </Button>
        </View>
      )}

      {/* Botones de registro/login para usuarios no autenticados */}
      {!user && (
        <View style={styles.authContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Register')}
            style={[styles.authButton, { backgroundColor: '#dc2626' }]}
          >
            Registrarse
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Login')}
            style={styles.authButton}
            labelStyle={{ color: '#dc2626' }}
          >
            Iniciar Sesión
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  userInfo: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  userType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  timeCard: {
    margin: 15,
    elevation: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginLeft: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  quickAccess: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickButton: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  infoCard: {
    margin: 15,
    elevation: 4,
  },
  cardTitle: {
    color: '#dc2626',
    fontSize: 18,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  statsCard: {
    margin: 15,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  logoutContainer: {
    padding: 15,
    marginTop: 10,
  },
  logoutButton: {
    borderColor: '#dc2626',
  },
  logoutButtonText: {
    color: '#dc2626',
  },
  authContainer: {
    padding: 15,
    marginTop: 10,
  },
  authButton: {
    marginBottom: 10,
  },
});
