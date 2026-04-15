import { OrderStatus } from '@/services/order.service';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/order';

export const TABS = [
    { value: 'ALL', label: 'Tất cả', icon: 'list-status' },
    { value: 'PENDING', label: STATUS_LABEL.PENDING, icon: 'clock-outline' },
    { value: 'CONFIRMED', label: STATUS_LABEL.CONFIRMED, icon: 'check-circle-outline' },
    { value: 'PREPARING', label: STATUS_LABEL.PREPARING, icon: 'package-variant' },
    { value: 'SHIPPING', label: STATUS_LABEL.SHIPPING, icon: 'truck-delivery-outline' },
    { value: 'DELIVERED', label: STATUS_LABEL.DELIVERED, icon: 'map-marker-check-outline' },
    { value: 'RECEIVED', label: STATUS_LABEL.RECEIVED, icon: 'archive-check-outline' },
    { value: 'CANCELLED', label: STATUS_LABEL.CANCELLED, icon: 'close-circle-outline' },
];

export const getStatusLabel = (status: OrderStatus | string) => {
    return STATUS_LABEL[status as OrderStatus] || status;
};

export const getStatusColor = (status: OrderStatus | string) => {
    return STATUS_COLOR[status as OrderStatus] || '#FFA000';
};

export const getPaymentMethodLabel = (method: string) => {
    switch (method) {
        case 'COD': return 'Thanh toán khi nhận hàng (COD)';
        case 'VNPAY': return 'Thanh toán qua VNPay';
        default: return method;
    }
};
