import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials } from '../types/user';

interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isTeamAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Aquí implementaremos la verificación del token almacenado
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                // TODO: Verificar token con el backend
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            // TODO: Implementar llamada al backend
            // NOTA: Las credenciales deben validarse en el servidor, no en el cliente
            // Por ahora, usamos un sistema temporal para desarrollo
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData.user);
                localStorage.setItem('authToken', userData.token);
            } else {
                throw new Error('Credenciales inválidas');
            }
            // Aquí implementaremos la lógica para teamAdmin
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isTeamAdmin: user?.role === 'teamAdmin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};