import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  SegmentedButtons,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation, route }) => {
  const { userType } = route.params || { userType: 'socio' };
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [selectedType, setSelectedType] = useState(userType);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || formData.email.trim() === '') {
      Alert.alert('Error', 'Por favor, introduce tu email o teléfono');
      return false;
    }

    if (!formData.password || formData.password.trim() === '') {
      Alert.alert('Error', 'Por favor, introduce tu contraseña');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, selectedType);
      
      if (result.success) {
        Alert.alert(
          'Acceso Exitoso',
          `¡Bienvenido a CDSANABRIACF!`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Ha ocurrido un error durante el acceso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Acceso al Club</Title>
            
            <Paragraph style={styles.subtitle}>
              Introduce tus credenciales para acceder
            </Paragraph>

            {/* Selector de tipo de usuario */}
            <SegmentedButtons
              value={selectedType}
              onValueChange={setSelectedType}
              buttons={[
                {
                  value: 'socio',
                  label: 'Socio',
                  icon: 'account-group',
                },
                {
                  value: 'amigo',
                  label: 'Amigo',
                  icon: 'handshake',
                },
              ]}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Email o Teléfono *"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Introduce tu email o teléfono"
            />

            <TextInput
              label="Contraseña *"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              placeholder="Introduce tu contraseña"
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Accediendo...' : 'Acceder'}
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Register', { userType: selectedType })}
              style={styles.registerButton}
            >
              ¿No tienes cuenta? Regístrate
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              Volver
            </Button>
          </Card.Content>
        </Card>

        {/* Información adicional */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>Información de Acceso</Title>
            <Paragraph style={styles.infoText}>
              • Puedes acceder con tu email o teléfono{'\n'}
              • Los socios deben estar validados por un administrador{'\n'}
              • Los amigos tienen acceso inmediato{'\n'}
              • Si olvidaste tu contraseña, contacta con el administrador
            </Paragraph>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: '#1e3a8a',
    borderRadius: 25,
  },
  registerButton: {
    marginBottom: 10,
  },
  backButton: {
    marginTop: 10,
  },
  infoCard: {
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

export default LoginScreen;
