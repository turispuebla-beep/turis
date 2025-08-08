import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'pending_validation':
        return 'Pendiente de validación';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'pending_validation':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'socio':
        return 'Socio del Club';
      case 'amigo':
        return 'Amigo del Club';
      default:
        return 'Usuario';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 Mi Perfil</Text>
        <Text style={styles.headerSubtitle}>
          Información de tu cuenta
        </Text>
      </View>

      {/* Información del usuario */}
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Title style={styles.userName}>
                {user?.name} {user?.surname}
              </Title>
              <Text style={styles.userType}>{getTypeText(user?.type)}</Text>
              <Text style={[styles.userStatus, { color: getStatusColor(user?.status) }]}>
                Estado: {getStatusText(user?.status)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Detalles de la cuenta */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>📋 Detalles de la Cuenta</Title>
          
          <List.Item
            title="Email"
            description={user?.email || 'No especificado'}
            left={(props) => <List.Icon {...props} icon="email" />}
            style={styles.listItem}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Teléfono"
            description={user?.phone || 'No especificado'}
            left={(props) => <List.Icon {...props} icon="phone" />}
            style={styles.listItem}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Tipo de cuenta"
            description={getTypeText(user?.type)}
            left={(props) => <List.Icon {...props} icon="account" />}
            style={styles.listItem}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Estado"
            description={getStatusText(user?.status)}
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Información específica por tipo de usuario */}
      {user?.type === 'socio' && user?.status === 'pending_validation' && (
        <Card style={styles.warningCard}>
          <Card.Content>
            <Title style={styles.warningTitle}>⚠️ Cuenta Pendiente</Title>
            <Paragraph style={styles.warningText}>
              Tu cuenta está pendiente de validación por un administrador. 
              Este proceso puede tardar hasta 7 días. Una vez validado, 
              tendrás acceso completo a todas las funcionalidades.
            </Paragraph>
          </Card.Content>
        </Card>
      )}

      {/* Funcionalidades disponibles */}
      <Card style={styles.featuresCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>🎯 Funcionalidades Disponibles</Title>
          
          {user?.type === 'socio' && user?.status === 'active' ? (
            <>
              <List.Item
                title="Ver equipos completos"
                description="Acceso a información detallada de todos los equipos"
                left={(props) => <List.Icon {...props} icon="sports-soccer" />}
                style={styles.listItem}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Calendario completo"
                description="Eventos, partidos y actividades del club"
                left={(props) => <List.Icon {...props} icon="calendar" />}
                style={styles.listItem}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Notificaciones push"
                description="Recibe notificaciones de eventos importantes"
                left={(props) => <List.Icon {...props} icon="notifications" />}
                style={styles.listItem}
              />
            </>
          ) : user?.type === 'amigo' ? (
            <>
              <List.Item
                title="Ver equipos básicos"
                description="Información básica de los equipos"
                left={(props) => <List.Icon {...props} icon="sports-soccer" />}
                style={styles.listItem}
              />
              <Divider style={styles.divider} />
              <List.Item
                title="Calendario básico"
                description="Partidos y eventos principales"
                left={(props) => <List.Icon {...props} icon="calendar" />}
                style={styles.listItem}
              />
            </>
          ) : (
            <List.Item
              title="Funcionalidades limitadas"
              description="Espera la validación de tu cuenta"
              left={(props) => <List.Icon {...props} icon="lock" />}
              style={styles.listItem}
            />
          )}
        </Card.Content>
      </Card>

      {/* Información de contacto */}
      <Card style={styles.contactCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>📞 Contacto</Title>
          <Paragraph style={styles.contactText}>
            Si tienes alguna pregunta o necesitas ayuda:{'\n\n'}
            📧 club@cdsanabriacf.com{'\n'}
            📱 +34 123 456 789{'\n\n'}
            Los administradores están disponibles para ayudarte.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Botón de cerrar sesión */}
      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#dc2626"
        >
          Cerrar Sesión
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  profileCard: {
    margin: 20,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e3a8a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  userType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 15,
  },
  listItem: {
    paddingVertical: 5,
  },
  divider: {
    marginVertical: 5,
  },
  warningCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  featuresCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  contactCard: {
    margin: 20,
    marginTop: 0,
    elevation: 4,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  logoutContainer: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    borderRadius: 25,
  },
});

export default ProfileScreen;
