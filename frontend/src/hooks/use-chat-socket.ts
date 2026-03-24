import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { ChatMessage } from '../services/chat.service';
import { useAuth } from '../contexts/AuthContext';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER_URL;

export const useChatSocket = (roomId?: string) => {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const socketRef = useRef<Socket | null>(null);

    const connectSocket = useCallback(async () => {
        if (socketRef.current?.connected) return;

        const token = await SecureStore.getItemAsync('userToken');
        if (!token) return;

        socketRef.current = io(SOCKET_URL, {
            query: { token },
            transports: ['websocket'],
            forceNew: true,
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
            if (roomId) {
                socketRef.current?.emit('join_room', roomId);
            }
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketRef.current.on('receive_message', (message: ChatMessage) => {
            console.log('Received message:', message);
            if (roomId && message.roomId === roomId) {
                setMessages((prev) => {
                    // Avoid duplicates if message already exists (from optimistic update)
                    if (prev.find(m => m.id === message.id)) return prev;
                    return [...prev, message];
                });
            }
        });

        socketRef.current.on('messages_read', (data: { roomId: string, viewerId: string }) => {
            console.log('Messages read by:', data.viewerId);
            if (roomId && data.roomId === roomId) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.senderId !== data.viewerId ? { ...m, isRead: true } : m
                    )
                );
            }
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

    }, [roomId]);

    useEffect(() => {
        connectSocket();

        return () => {
            if (socketRef.current) {
                if (roomId) {
                    socketRef.current.emit('leave_room', roomId);
                }
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [connectSocket, roomId]);

    const joinRoom = (newRoomId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('join_room', newRoomId);
        }
    };

    const leaveRoom = (oldRoomId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('leave_room', oldRoomId);
        }
    };

    return {
        isConnected,
        messages,
        setMessages,
        socket: socketRef.current,
        joinRoom,
        leaveRoom
    };
};
