import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    query, 
    where, 
    orderBy,
    addDoc,
    updateDoc,
    doc,
    Timestamp
} from 'firebase/firestore';
import { config } from '../config';

// Inicializar Firebase
const firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface Team {
    id: string;
    name: string;
    accessCode: string;
    adminId: string;
    category: string;
    location: string;
    contactPhone: string;
    isActive: boolean;
    createdAt: number;
    subdomain: string;
}

export interface User {
    id: string;
    email: string;
    teamId?: string;
    role: UserRole;
    name: string;
    phone?: string;
    profilePictureUrl?: string;
    isActive: boolean;
    createdAt: number;
    isOnline?: boolean;
    lastSeen?: number;
}

export interface Event {
    id: string;
    teamId: string;
    title: string;
    description: string;
    date: number;
    location: string;
    type: EventType;
    verificationType: EventVerificationType;
    isActive: boolean;
    createdAt: number;
    createdBy: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    timestamp: number;
    type: MessageType;
}

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    TEAM_ADMIN = 'TEAM_ADMIN',
    COACH = 'COACH',
    PLAYER = 'PLAYER',
    MEMBER = 'MEMBER',
    FRIEND = 'FRIEND',
    USER = 'USER'
}

export enum EventType {
    TRAINING = 'TRAINING',
    MATCH = 'MATCH',
    MEETING = 'MEETING',
    TOURNAMENT = 'TOURNAMENT',
    OTHER = 'OTHER'
}

export enum EventVerificationType {
    NONE = 'NONE',
    ADMIN_APPROVAL = 'ADMIN_APPROVAL',
    DOCUMENT_REQUIRED = 'DOCUMENT_REQUIRED'
}

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE'
}

export class RealtimeSyncService {
    // Observar usuarios en tiempo real
    observeUsers(teamId: string, callback: (users: User[]) => void): () => void {
        const q = query(
            collection(db, 'users'),
            where('teamId', '==', teamId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users: User[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                users.push({
                    id: doc.id,
                    email: data.email,
                    teamId: data.teamId,
                    role: data.role,
                    name: data.name,
                    phone: data.phone,
                    profilePictureUrl: data.profilePictureUrl,
                    isActive: data.isActive,
                    createdAt: data.createdAt,
                    isOnline: data.isOnline,
                    lastSeen: data.lastSeen
                });
            });
            callback(users);
        });

        return unsubscribe;
    }

    // Observar eventos en tiempo real
    observeEvents(teamId: string, callback: (events: Event[]) => void): () => void {
        const q = query(
            collection(db, 'events'),
            where('teamId', '==', teamId),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const events: Event[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                events.push({
                    id: doc.id,
                    teamId: data.teamId,
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    location: data.location,
                    type: data.type,
                    verificationType: data.verificationType,
                    isActive: data.isActive,
                    createdAt: data.createdAt,
                    createdBy: data.createdBy
                });
            });
            callback(events);
        });

        return unsubscribe;
    }

    // Observar equipos en tiempo real
    observeTeams(callback: (teams: Team[]) => void): () => void {
        const q = query(collection(db, 'teams'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const teams: Team[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                teams.push({
                    id: doc.id,
                    name: data.name,
                    accessCode: data.accessCode,
                    adminId: data.adminId,
                    category: data.category,
                    location: data.location,
                    contactPhone: data.contactPhone,
                    isActive: data.isActive,
                    createdAt: data.createdAt,
                    subdomain: data.subdomain
                });
            });
            callback(teams);
        });

        return unsubscribe;
    }

    // Observar mensajes del chat en tiempo real
    observeChatMessages(teamId: string, callback: (messages: ChatMessage[]) => void): () => void {
        const q = query(
            collection(db, `teams/${teamId}/messages`),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages: ChatMessage[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    id: doc.id,
                    senderId: data.senderId,
                    senderName: data.senderName,
                    message: data.message,
                    timestamp: data.timestamp,
                    type: data.type
                });
            });
            callback(messages);
        });

        return unsubscribe;
    }

    // Enviar mensaje al chat
    async sendChatMessage(teamId: string, message: Omit<ChatMessage, 'id'>): Promise<void> {
        await addDoc(collection(db, `teams/${teamId}/messages`), {
            ...message,
            timestamp: Date.now()
        });
    }

    // Actualizar estado de usuario
    async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            isOnline,
            lastSeen: Date.now()
        });
    }

    // Crear nuevo evento
    async createEvent(event: Omit<Event, 'id' | 'createdAt'>): Promise<void> {
        await addDoc(collection(db, 'events'), {
            ...event,
            createdAt: Date.now()
        });
    }

    // Actualizar evento
    async updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, updates);
    }
} 