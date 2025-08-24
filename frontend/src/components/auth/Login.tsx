import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Container
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  SportsSoccer,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    teamId: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password, formData.teamId);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implementar recuperación de contraseña
    alert('Función de recuperación de contraseña en desarrollo');
  };

  const handleSuperAdminLogin = () => {
    setFormData(prev => ({
      ...prev,
      email: 'amco@gmx.es',
      password: '533712'
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            width: '100%',
            maxWidth: 450,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SportsSoccer sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              CDSANABRIACF
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Acceso al Sistema de Gestión
            </Typography>
          </Box>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Email */}
            <TextField
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {/* Contraseña */}
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* ID del Equipo */}
            <TextField
              fullWidth
              label="ID del Equipo (Opcional)"
              value={formData.teamId}
              onChange={handleInputChange('teamId')}
              margin="normal"
              helperText="Solo necesario para administradores de equipo"
            />

            {/* Recordar datos */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    rememberMe: e.target.checked
                  }))}
                  color="primary"
                />
              }
              label="Recordar datos de acceso"
              sx={{ mt: 2 }}
            />

            {/* Botón de login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<LoginIcon />}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                }
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            {/* Enlaces de ayuda */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ mr: 2 }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link
                component="button"
                variant="body2"
                onClick={handleSuperAdminLogin}
              >
                Acceso Super Admin
              </Link>
            </Box>
          </form>

          {/* Separador */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              O
            </Typography>
          </Divider>

          {/* Información adicional */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              ¿No tienes cuenta?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/register')}
              sx={{ mt: 1 }}
            >
              Registrarse
            </Button>
          </Box>

          {/* Información de contacto */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              ¿Necesitas ayuda? Contacta con tu administrador de equipo
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};


