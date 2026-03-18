import { OrderStatus } from '@/services/order.service';

export const STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING: 'Đang chờ', 
    CONFIRMED: 'Xác nhận', 
    PREPARING: 'Chuẩn bị',
    SHIPPING: 'Đang giao', 
    RECEIVED: 'Đã nhận', 
    CANCELLED: 'Đã hủy',
};

export const STATUS_COLOR: Record<OrderStatus, string> = {
    PENDING: '#3B82F6', 
    CONFIRMED: '#8B5CF6', 
    PREPARING: '#F59E0B',
    SHIPPING: '#06B6D4', 
    RECEIVED: '#388E3C', 
    CANCELLED: '#D32F2F',
};
