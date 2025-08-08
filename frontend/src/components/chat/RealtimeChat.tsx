import React, { useState, useEffect, useRef } from 'react';
import { useRealtimeChat } from '../../hooks/useRealtimeSync';
import { ChatMessage, MessageType } from '../../services/RealtimeSyncService';
import './RealtimeChat.css';

interface RealtimeChatProps {
    teamId: string;
    currentUserId: string;
    currentUserName: string;
}

export const RealtimeChat: React.FC<RealtimeChatProps> = ({
    teamId,
    currentUserId,
    currentUserName
}) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, loading, error, sendMessage } = useRealtimeChat(teamId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message: Omit<ChatMessage, 'id'> = {
                senderId: currentUserId,
                senderName: currentUserName,
                message: newMessage.trim(),
                timestamp: Date.now(),
                type: MessageType.TEXT
            };

            await sendMessage(message);
            setNewMessage('');
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="chat-loading">Cargando chat...</div>;
    }

    if (error) {
        return <div className="chat-error">Error: {error}</div>;
    }

    return (
        <div className="realtime-chat">
            <div className="chat-header">
                <h3>Chat del Equipo</h3>
                <div className="online-indicator">
                    <span className="online-dot"></span>
                    {messages.length} mensajes
                </div>
            </div>

            <div className="messages-container">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.senderId === currentUserId ? 'own-message' : 'other-message'}`}
                    >
                        <div className="message-header">
                            <span className="sender-name">{message.senderName}</span>
                            <span className="message-time">{formatTime(message.timestamp)}</span>
                        </div>
                        <div className="message-content">
                            {message.type === MessageType.TEXT ? (
                                <p>{message.message}</p>
                            ) : message.type === MessageType.IMAGE ? (
                                <img src={message.message} alt="Imagen" className="message-image" />
                            ) : (
                                <a href={message.message} target="_blank" rel="noopener noreferrer">
                                    Descargar archivo
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
                <div className="input-container">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="message-input"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="send-button"
                        disabled={!newMessage.trim() || loading}
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
}; 