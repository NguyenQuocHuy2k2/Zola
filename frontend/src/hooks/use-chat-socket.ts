import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { ChatMessage } from '../services/chat.service';
import { useAuth } from '../contexts/AuthContext';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER_URL;

export const useChatSocket = (roomId?: string, isFocused: boolean = true) => {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const isFocusedRef = useRef(isFocused);

    useEffect(() => {
        isFocusedRef.current = isFocused;
    }, [isFocused]);

    const connectSocket = useCallback(async () => {
        if (socketRef.current?.connected) return;

        const token = await SecureStore.getItemAsync('userToken');
        if (!token) return;

        const socket = io(SOCKET_URL, {
            query: { token },
            transports: ['websocket'],
            forceNew: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
            // Re-join current room on reconnect if roomId exists
            const currentRoomId = roomIdRef.current;
            if (currentRoomId) {
                socket.emit('join_room', currentRoomId);
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socket.on('receive_message', (message: ChatMessage) => {
            console.log('Received message:', message);
            if (roomIdRef.current && message.roomId === roomIdRef.current) {
                setMessages((prev) => {
                    if (prev.find(m => m.id === message.id)) return prev;
                    return [...prev, message];
                });
                // Mark as read immediately ONLY if we are focused on the room
                if (isFocusedRef.current) {
                    socket.emit('mark_read', message.roomId);
                }
            }
        });

        socket.on('messages_read', (data: { roomId: string, viewerId: string }) => {
            console.log('Messages read by:', data.viewerId);
            if (roomIdRef.current && data.roomId === roomIdRef.current) {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.senderId !== data.viewerId ? { ...m, isRead: true } : m
                    )
                );
            }
        });

        socket.on('update_chat_list', (updatedRoom: any) => {
            console.log('Room list update received:', updatedRoom.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

    }, []);

    const roomIdRef = useRef<string | undefined>(roomId);
    
    // Connection Effect
    useEffect(() => {
        connectSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [connectSocket]);

    // Room Joining Effect
    useEffect(() => {
        const oldRoomId = roomIdRef.current;
        roomIdRef.current = roomId;

        if (oldRoomId !== roomId) {
            setMessages([]);
        }

        if (socketRef.current?.connected) {
            if (oldRoomId && oldRoomId !== roomId) {
                socketRef.current.emit('leave_room', oldRoomId);
            }
            if (roomId) {
                socketRef.current.emit('join_room', roomId);
                if (isFocused) {
                    socketRef.current.emit('mark_read', roomId);
                }
            }
        }
    }, [roomId, isFocused]);

    const joinRoom = (newRoomId: string) => {
        if (socketRef.current?.connected) {
            socketRef.current.emit('join_room', newRoomId);
            socketRef.current.emit('mark_read', newRoomId);
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
