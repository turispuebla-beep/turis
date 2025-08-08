import { useState, useEffect } from 'react';
import { RealtimeSyncService, User, Event, Team, ChatMessage } from '../services/RealtimeSyncService';

const syncService = new RealtimeSyncService();

export const useRealtimeUsers = (teamId: string) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = syncService.observeUsers(teamId, (newUsers) => {
            setUsers(newUsers);
            setLoading(false);
            setError(null);
        });

        return () => {
            unsubscribe();
        };
    }, [teamId]);

    return { users, loading, error };
};

export const useRealtimeEvents = (teamId: string) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = syncService.observeEvents(teamId, (newEvents) => {
            setEvents(newEvents);
            setLoading(false);
            setError(null);
        });

        return () => {
            unsubscribe();
        };
    }, [teamId]);

    return { events, loading, error };
};

export const useRealtimeTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = syncService.observeTeams((newTeams) => {
            setTeams(newTeams);
            setLoading(false);
            setError(null);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return { teams, loading, error };
};

export const useRealtimeChat = (teamId: string) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const unsubscribe = syncService.observeChatMessages(teamId, (newMessages) => {
            setMessages(newMessages);
            setLoading(false);
            setError(null);
        });

        return () => {
            unsubscribe();
        };
    }, [teamId]);

    const sendMessage = async (message: Omit<ChatMessage, 'id'>) => {
        try {
            await syncService.sendChatMessage(teamId, message);
        } catch (err) {
            setError('Error al enviar mensaje');
            console.error(err);
        }
    };

    return { messages, loading, error, sendMessage };
};

export const useUserStatus = (userId: string) => {
    const updateStatus = async (isOnline: boolean) => {
        try {
            await syncService.updateUserStatus(userId, isOnline);
        } catch (err) {
            console.error('Error actualizando estado de usuario:', err);
        }
    };

    return { updateStatus };
}; 