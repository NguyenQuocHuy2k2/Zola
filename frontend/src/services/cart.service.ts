import api from './api';
import { Product, ProductVariant } from './product.service';

export interface CartItem {
    id: string;
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

export const cartService = {
    async getCart(): Promise<CartItem[]> {
        try {
            const response = await api.get('/cart');
            return response.data.result;
        } catch (e) {
            console.error('Fetch cart failed', e);
            return [];
        }
    },

    async addToCart(productId: string, variantId: number, quantity: number = 1): Promise<void> {
        try {
            await api.post('/cart', { productId, variantId, quantity });
        } catch (e) {
            console.error('Add to cart failed', e);
            throw e;
        }
    },

    async updateQuantity(id: string, quantity: number): Promise<void> {
        try {
            await api.put(`/cart/${id}`, null, { params: { quantity } });
        } catch (e) {
            console.error('Update quantity failed', e);
            throw e;
        }
    },

    async removeFromCart(id: string): Promise<void> {
        try {
            await api.delete(`/cart/${id}`);
        } catch (e) {
            console.error('Remove from cart failed', e);
            throw e;
        }
    },

    async clearCart(): Promise<void> {
        try {
            await api.delete('/cart/clear');
        } catch (e) {
            console.error('Clear cart failed', e);
            throw e;
        }
    }
};
