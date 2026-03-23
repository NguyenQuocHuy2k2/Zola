import api from './api';
import { CartItem } from './cart.service';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'RECEIVED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'VNPAY';
export type CancellationReason = 
    | 'CHANGE_MIND' | 'WRONG_INFO' | 'PAYMENT_ISSUE' | 'TIME_DELAY' | 'FORGOT_VOUCHER' // User
    | 'OUT_OF_STOCK' | 'PRODUCT_FAULT' | 'NO_CONTACT' | 'INVALID_ADDRESS' | 'FRAUD_SUSPICION' | 'PRICING_ERROR' // Admin
    | 'OTHER';

export interface CancellationReasonResponse {
    code: CancellationReason;
    label: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productVariantId: string;
    imageUrl: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderCode: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    customerName?: string;
    shippingAddress: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    notes?: string;
    cancellationReason?: CancellationReason;
    createdAt: string; // ISO String
}

export const orderService = {
    async getOrderHistory(): Promise<Order[]> {
        try {
            const response = await api.get('/orders/my-orders');
            return response.data.result;
        } catch (error) {
            console.error('Fetch order history failed', error);
            return [];
        }
    },

    async createOrder(params: {
        shippingAddress: string;
        phoneNumber: string;
        paymentMethod: PaymentMethod;
        notes?: string;
        cartItemIds?: string[];
    }): Promise<Order> {
        try {
            const response = await api.post('/orders/checkout', params);
            return response.data.result;
        } catch (error) {
            console.error('Checkout failed', error);
            throw error;
        }
    },

    async getOrderById(id: string): Promise<Order | null> {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data.result;
        } catch (error) {
            console.error('Fetch order detail failed', error);
            return null;
        }
    },

    async cancelOrder(id: string, reason?: CancellationReason): Promise<void> {
        try {
            await api.post(`/orders/${id}/cancel`, null, { params: { reason } });
        } catch (error) {
            console.error('Cancel order failed', error);
            throw error;
        }
    },

    async getAllOrders(): Promise<Order[]> {
        try {
            const response = await api.get('/orders/admin');
            return response.data.result;
        } catch (error) {
            console.error('Fetch all orders failed', error);
            return [];
        }
    },

    async updateOrderStatus(id: string, status: OrderStatus, reason?: CancellationReason): Promise<Order | null> {
        try {
            const response = await api.patch(`/orders/${id}/status`, null, { params: { status, reason } });
            return response.data.result;
        } catch (error) {
            console.error('Update order status failed', error);
            return null;
        }
    },

    async getCancellationReasons(role: 'USER' | 'ADMIN'): Promise<CancellationReasonResponse[]> {
        try {
            const response = await api.get('/orders/cancellation-reasons', { params: { role } });
            return response.data.result;
        } catch (error) {
            console.error('Get cancellation reasons failed', error);
            return [];
        }
    }
};
