import api from './api';
import { mockAuthService } from '../mocks/authService';

// Durante el desarrollo, usamos el servicio mock
const isDevelopment = process.env.NODE_ENV === 'development';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
    preferences: {
        language: string;
        theme: 'light' | 'dark';
        notifications: boolean;
    };
}

const apiAuthService = {
    /**
     * Inicia sesión con email y contraseña
     */
    async loginWithEmailPassword(email: string, password: string): Promise<{
        user: UserProfile;
        tokens: AuthTokens;
    }> {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    /**
     * Inicia sesión con Google
     */
    async loginWithGoogle(idToken: string): Promise<{
        user: UserProfile;
        tokens: AuthTokens;
    }> {
        const response = await api.post('/auth/google', { idToken });
        return response.data;
    },

    /**
     * Registra un nuevo usuario
     */
    async register(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        user: UserProfile;
        tokens: AuthTokens;
    }> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    /**
     * Refresca el token de acceso
     */
    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },

    /**
     * Cierra la sesión
     */
    async logout(refreshToken: string): Promise<void> {
        await api.post('/auth/logout', { refreshToken });
    },

    /**
     * Obtiene el perfil del usuario actual
     */
    async getCurrentUser(): Promise<UserProfile> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Actualiza el perfil del usuario
     */
    async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    /**
     * Cambia la contraseña del usuario
     */
    async changePassword(data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void> {
        await api.put('/auth/change-password', data);
    },

    /**
     * Solicita un restablecimiento de contraseña
     */
    async requestPasswordReset(email: string): Promise<void> {
        await api.post('/auth/forgot-password', { email });
    },

    /**
     * Restablece la contraseña con un token
     */
    async resetPassword(data: {
        token: string;
        newPassword: string;
    }): Promise<void> {
        await api.post('/auth/reset-password', data);
    },

    /**
     * Verifica el email del usuario
     */
    async verifyEmail(token: string): Promise<void> {
        await api.post('/auth/verify-email', { token });
    },

    /**
     * Reenvía el email de verificación
     */
    async resendVerificationEmail(): Promise<void> {
        await api.post('/auth/resend-verification');
    },

    /**
     * Vincula una cuenta de Google
     */
    async linkGoogleAccount(idToken: string): Promise<void> {
        await api.post('/auth/link/google', { idToken });
    },

    /**
     * Desvincula una cuenta de Google
     */
    async unlinkGoogleAccount(): Promise<void> {
        await api.post('/auth/unlink/google');
    },

    /**
     * Elimina la cuenta del usuario
     */
    async deleteAccount(password: string): Promise<void> {
        await api.post('/auth/delete-account', { password });
    },

    /**
     * Obtiene las sesiones activas del usuario
     */
    async getActiveSessions(): Promise<{
        id: string;
        device: string;
        platform: string;
        lastActive: Date;
        current: boolean;
    }[]> {
        const response = await api.get('/auth/sessions');
        return response.data;
    },

    /**
     * Cierra una sesión específica
     */
    async revokeSession(sessionId: string): Promise<void> {
        await api.delete(`/auth/sessions/${sessionId}`);
    },

    /**
     * Cierra todas las sesiones excepto la actual
     */
    async revokeAllSessions(): Promise<void> {
        await api.delete('/auth/sessions');
    }
};

export const sharedAuthService = isDevelopment ? mockAuthService : apiAuthService;