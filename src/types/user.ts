export type UserRole = 'admin' | 'teamAdmin';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    teamId?: string; // Solo para administradores de equipo
}

export interface LoginCredentials {
    email: string;
    password: string;
    teamId?: string; // Para administradores de equipo
}

export interface TeamAdminRegistration extends LoginCredentials {
    teamId: string;
    name: string;
}