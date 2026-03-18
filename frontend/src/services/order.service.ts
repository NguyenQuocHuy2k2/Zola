import api from './api';
import { CartItem } from './cart.service';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'RECEIVED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'VNPAY';

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

    async cancelOrder(id: string): Promise<void> {
        try {
            await api.post(`/orders/${id}/cancel`);
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

    async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
        try {
            const response = await api.patch(`/orders/${id}/status`, null, { params: { status } });
            return response.data.result;
        } catch (error) {
            console.error('Update order status failed', error);
            return null;
        }
    }
};
