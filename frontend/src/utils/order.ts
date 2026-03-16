import { OrderStatus } from '@/services/order.service';

export const TABS = [
    { value: 'ALL', label: 'Tất cả', icon: 'list-status' },
    { value: 'PENDING', label: 'Đang chờ', icon: 'clock-outline' },
    { value: 'CONFIRMED', label: 'Xác nhận', icon: 'check-circle-outline' },
    { value: 'PREPARING', label: 'Đang chuẩn bị', icon: 'package-variant' },
    { value: 'SHIPPING', label: 'Đang giao', icon: 'truck-delivery-outline' },
    { value: 'RECEIVED', label: 'Đã nhận', icon: 'archive-check-outline' },
    { value: 'CANCELLED', label: 'Đã hủy', icon: 'close-circle-outline' },
];

export const getStatusLabel = (status: OrderStatus | string) => {
    switch (status) {
        case 'PENDING': return 'Đang chờ';
        case 'CONFIRMED': return 'Xác nhận';
        case 'PREPARING': return 'Chuẩn bị hàng';
        case 'SHIPPING': return 'Đang giao';
        case 'RECEIVED': return 'Đã nhận';
        case 'CANCELLED': return 'Đã hủy';
        default: return status;
    }
};

export const getStatusColor = (status: OrderStatus | string) => {
    switch (status) {
        case 'RECEIVED': return '#388E3C';
        case 'CANCELLED': return '#D32F2F';
        case 'SHIPPING': return '#1976D2';
        default: return '#FFA000';
    }
};

export const getPaymentMethodLabel = (method: string) => {
    switch (method) {
        case 'COD': return 'Thanh toán khi nhận hàng (COD)';
        case 'VNPAY': return 'Thanh toán qua VNPay';
        default: return method;
    }
};
