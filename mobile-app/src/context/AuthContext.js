import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario guardado al iniciar la app
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, userType) => {
    try {
      // Obtener datos del localStorage (simulado)
      let users = [];
      
      if (userType === 'socio') {
        const sociosData = await AsyncStorage.getItem('clubMembers');
        users = sociosData ? JSON.parse(sociosData) : [];
      } else if (userType === 'amigo') {
        const amigosData = await AsyncStorage.getItem('clubFriends');
        users = amigosData ? JSON.parse(amigosData) : [];
      }

      // Buscar usuario
      const foundUser = users.find(u => 
        (u.email === email || u.telefono === email) && u.password === password
      );

      if (foundUser) {
        // Verificar estado para socios
        if (userType === 'socio' && foundUser.status !== 'active') {
          throw new Error('Tu cuenta está pendiente de validación. Contacta con un administrador.');
        }

        const userData = {
          id: foundUser.id || foundUser.dni,
          name: foundUser.name,
          surname: foundUser.surname,
          email: foundUser.email,
          phone: foundUser.telefono,
          type: userType,
          status: foundUser.status
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData, userType) => {
    try {
      // Obtener datos existentes
      let existingUsers = [];
      const storageKey = userType === 'socio' ? 'clubMembers' : 'clubFriends';
      
      const existingData = await AsyncStorage.getItem(storageKey);
      existingUsers = existingData ? JSON.parse(existingData) : [];

      // Verificar si ya existe
      const exists = existingUsers.find(u => 
        u.email === userData.email || u.telefono === userData.phone || u.dni === userData.dni
      );

      if (exists) {
        throw new Error('Ya existe un usuario con estos datos');
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        telefono: userData.phone,
        dni: userData.dni,
        password: userData.password,
        status: userType === 'socio' ? 'pending_validation' : 'active',
        registrationDate: new Date().toISOString(),
        type: userType
      };

      // Agregar a la lista
      existingUsers.push(newUser);
      await AsyncStorage.setItem(storageKey, JSON.stringify(existingUsers));

      return { success: true, message: 'Registro exitoso' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
