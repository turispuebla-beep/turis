import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
  Checkbox,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation, route }) => {
  const { userType } = route.params || { userType: 'socio' };
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dni: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    birthDate: '',
    consentPhotos: false,
    consentPlayer: false,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'surname', 'phone', 'password'];
    
    if (userType === 'socio') {
      requiredFields.push('dni', 'email');
    }

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        Alert.alert('Error', `El campo ${field} es obligatorio`);
        return false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (userType === 'socio' && !formData.consentPlayer) {
      Alert.alert('Error', 'Debes aceptar ser jugador del equipo');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register(formData, userType);
      
      if (result.success) {
        Alert.alert(
          'Registro Exitoso',
          userType === 'socio' 
            ? 'Tu registro ha sido completado. Debes ser validado por un administrador en 7 días.'
            : 'Tu registro ha sido completado. Ya puedes acceder a la aplicación.',
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
      Alert.alert('Error', 'Ha ocurrido un error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>
              {userType === 'socio' ? 'Registro de Socio' : 'Registro de Amigo'}
            </Title>
            
            <Paragraph style={styles.subtitle}>
              {userType === 'socio' 
                ? 'Únete como socio del club y disfruta de todos los beneficios'
                : 'Únete como amigo del club y mantente informado'
              }
            </Paragraph>

            {/* Campos básicos */}
            <TextInput
              label="Nombre *"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Apellidos *"
              value={formData.surname}
              onChangeText={(text) => handleInputChange('surname', text)}
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="DNI *"
              value={formData.dni}
              onChangeText={(text) => handleInputChange('dni', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="default"
            />

            <TextInput
              label="Teléfono *"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />

            <TextInput
              label="Email *"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Dirección"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              style={styles.input}
              mode="outlined"
              multiline
            />

            <TextInput
              label="Fecha de Nacimiento"
              value={formData.birthDate}
              onChangeText={(text) => handleInputChange('birthDate', text)}
              style={styles.input}
              mode="outlined"
              placeholder="DD/MM/AAAA"
            />

            <TextInput
              label="Contraseña *"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label="Confirmar Contraseña *"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />

            {/* Checkboxes para socios */}
            {userType === 'socio' && (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={formData.consentPlayer ? 'checked' : 'unchecked'}
                  onPress={() => handleInputChange('consentPlayer', !formData.consentPlayer)}
                />
                <Text style={styles.checkboxText}>
                  Acepto ser jugador del equipo *
                </Text>
              </View>

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={formData.consentPhotos ? 'checked' : 'unchecked'}
                  onPress={() => handleInputChange('consentPhotos', !formData.consentPhotos)}
                />
                <Text style={styles.checkboxText}>
                  Acepto aparecer en fotos del club
                </Text>
              </View>
            )}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    elevation: 4,
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
  input: {
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  registerButton: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#1e3a8a',
    borderRadius: 25,
  },
  backButton: {
    marginTop: 10,
  },
});

export default RegisterScreen;
