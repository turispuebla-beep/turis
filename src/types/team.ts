export type TeamCategory = 'prebenjamin' | 'benjamin' | 'alevin' | 'infantil' | 'aficionado';

export interface Member {
    id: string;
    name: string;
    surname: string;
    dni?: string;
    phone: string;
    email?: string;
    address?: string;
    memberNumber: number; // Numeración automática
    registrationDate: string;
    status: 'pending' | 'active' | 'inactive';
    teamId: string; // Equipo al que está asociado
}

export interface Friend {
    id: string;
    name: string;
    surname: string;
    dni?: string;
    phone: string;
    email?: string;
    teamId: string; // Equipo al que está asociado
}

export interface TeamEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    image?: string;
    price?: number;
    minParticipants: number;
    maxParticipants: number;
    requirePhotoConsent: boolean;
    participants: Member[];
    teamId: string; // Equipo organizador
}

export interface TeamDocument {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    uploadDate: string;
    teamId: string;
}

export interface TeamMedia {
    id: string;
    type: 'photo' | 'video';
    url: string;
    description?: string;
    uploadDate: string;
    teamId: string;
}

export interface TeamAdmin {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface Team {
    id: string;
    category: TeamCategory;
    name: string;
    logo?: string;
    admin: TeamAdmin; // Administrador secundario asignado
    players: Player[];
    members: Member[];
    friends: Friend[];
    events: TeamEvent[];
    documents: TeamDocument[];
    media: TeamMedia[];
    coach?: {
        name: string;
        phone: string;
        email: string;
    };
    contactInfo: {
        email: string;
        phone: string;
        address?: string;
    };
}

export interface Player {
    id: string;
    name: string;
    surname: string;
    dni: string;
    phone: string;
    address?: string;
    birthDate: string;
    jerseyNumber: number;
    teamId: string;
    // Datos adicionales para menores de edad
    guardianInfo?: {
        name: string;
        dni: string;
        phone: string;
        address: string;
        email: string;
    }[];
    photoConsent: boolean;
    teamConsent: boolean;
}