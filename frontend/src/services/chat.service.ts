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
