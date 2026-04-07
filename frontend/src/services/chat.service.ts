import api from './api';

export enum AttachmentType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    FILE = 'FILE'
}

export interface ChatMessageAttachment {
    id: string;
    url: string;
    type: AttachmentType;
    thumbnailUrl?: string;
}

export interface ChatMessage {
    id: string;
    roomId: string; // Added for real-time filtering
    senderId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    attachments: ChatMessageAttachment[];
}

export interface ChatRoom {
    id: string;
    otherUserId: string;
    otherUserName: string;
    otherUserAvatar?: string;
    otherUserEmail?: string;
    otherUserPhone?: string;
    lastMessage?: string;
    lastMessageTime: string;
    unreadCount: number;
}

export interface AttachmentRequest {
    url: string;
    type: AttachmentType;
    thumbnailUrl?: string;
}

export const formatChatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    const nowStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dateStartOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    
    const diffDays = Math.floor((nowStartOfDay - dateStartOfDay) / (1000 * 60 * 60 * 24));
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    if (diffDays < 7 && diffDays >= 0) {
        return `${timeStr} ${days[date.getDay()]}`;
    } else {
        return `${timeStr} ${date.getDate()} Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
    }
};

export const isDifferentDay = (dateStr1: string, dateStr2: string) => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    return d1.getFullYear() !== d2.getFullYear() || 
           d1.getMonth() !== d2.getMonth() || 
           d1.getDate() !== d2.getDate();
};

export const chatService = {
    async getRooms(): Promise<ChatRoom[]> {
        const response = await api.get('/chat/rooms');
        return response.data.result;
    },

    async getMessages(roomId: string): Promise<ChatMessage[]> {
        const response = await api.get(`/chat/rooms/${roomId}/messages`);
        return response.data.result;
    },

    async sendMessage(roomId: string, content: string, attachments?: AttachmentRequest[]): Promise<ChatMessage> {
        const response = await api.post(`/chat/rooms/${roomId}/send`, {
            content,
            attachments,
        });
        return response.data.result;
    },

    async joinRoom(shopId: string): Promise<ChatRoom> {
        const response = await api.get('/chat/rooms/join', {
            params: { shopId },
        });
        return response.data.result;
    },

    async joinAdminRoom(): Promise<ChatRoom> {
        const response = await api.get('/chat/rooms/admin');
        return response.data.result;
    },

    async uploadMedia(fileUri: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            type: 'image/jpeg', // Default to image/jpeg, backend Cloudinary will auto-detect
            name: 'chat_media.jpg',
        } as any);
        const response = await api.post('/chat/upload-media', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.result;
    },
};
