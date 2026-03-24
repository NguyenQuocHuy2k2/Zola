import api from './api';

export enum NotificationType {
    ORDER = 'ORDER',
    PROMOTION = 'PROMOTION',
    SYSTEM = 'SYSTEM',
}

export interface NotificationResponse {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

const notificationService = {
    getUserNotifications: async (page = 0, size = 10): Promise<PageResponse<NotificationResponse>> => {
        const response = await api.get(`/notifications?page=${page}&size=${size}`);
        return response.data.result;
    },

    markAsRead: async (id: number): Promise<void> => {
        await api.patch(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.patch('/notifications/read-all');
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get('/notifications/unread-count');
        return response.data.result;
    },
};

export default notificationService;
