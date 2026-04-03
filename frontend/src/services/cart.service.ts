import api from './api';
import { Product, ProductVariant, productService } from './product.service';
import * as SecureStore from 'expo-secure-store';

export interface CartItem {
    id: string;
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

const GUEST_CART_KEY = 'guest_cart';

export const cartService = {
    async getCart(): Promise<CartItem[]> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            try {
                const localStr = await SecureStore.getItemAsync(GUEST_CART_KEY);
                return localStr ? JSON.parse(localStr) : [];
            } catch { return []; }
        }

        try {
            const response = await api.get('/cart');
            return response.data.result;
        } catch (e) {
            console.error('Fetch cart failed', e);
            return [];
        }
    },

    async addToCart(productId: string, variantId: number, quantity: number = 1): Promise<void> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            // Logic cho Guest Cart
            const localStr = await SecureStore.getItemAsync(GUEST_CART_KEY);
            let localCart: CartItem[] = localStr ? JSON.parse(localStr) : [];
            
            // Check var trong local
            const existing = localCart.find(i => i.product.id === productId && i.variant.id === variantId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                // Fetch product details
                const product = await productService.getProductById(productId);
                const variant = product.variants.find(v => v.id === variantId);
                if (variant) {
                    localCart.push({
                        id: `guest_${Date.now()}_${productId}_${variantId}`,
                        product,
                        variant,
                        quantity
                    });
                }
            }
            await SecureStore.setItemAsync(GUEST_CART_KEY, JSON.stringify(localCart));
            return;
        }

        try {
            await api.post('/cart', { productId, variantId, quantity });
        } catch (e) {
            console.error('Add to cart failed', e);
            throw e;
        }
    },

    async updateQuantity(id: string, quantity: number): Promise<void> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            const localStr = await SecureStore.getItemAsync(GUEST_CART_KEY);
            if (!localStr) return;
            let localCart: CartItem[] = JSON.parse(localStr);
            const index = localCart.findIndex(i => i.id === id);
            if (index !== -1) {
                localCart[index].quantity = quantity;
                await SecureStore.setItemAsync(GUEST_CART_KEY, JSON.stringify(localCart));
            }
            return;
        }

        try {
            await api.put(`/cart/${id}`, null, { params: { quantity } });
        } catch (e) {
            console.error('Update quantity failed', e);
            throw e;
        }
    },

    async removeFromCart(id: string): Promise<void> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            const localStr = await SecureStore.getItemAsync(GUEST_CART_KEY);
            if (!localStr) return;
            let localCart: CartItem[] = JSON.parse(localStr);
            localCart = localCart.filter(i => i.id !== id);
            await SecureStore.setItemAsync(GUEST_CART_KEY, JSON.stringify(localCart));
            return;
        }

        try {
            await api.delete(`/cart/${id}`);
        } catch (e) {
            console.error('Remove from cart failed', e);
            throw e;
        }
    },

    async clearCart(): Promise<void> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            await SecureStore.deleteItemAsync(GUEST_CART_KEY);
            return;
        }

        try {
            await api.delete('/cart/clear');
        } catch (e) {
            console.error('Clear cart failed', e);
            throw e;
        }
    }
};
