import api from './api';
import { Product, ProductVariant, productService } from './product.service';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

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
                const localStr = await AsyncStorage.getItem(GUEST_CART_KEY);
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
            const localStr = await AsyncStorage.getItem(GUEST_CART_KEY);
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
            await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(localCart));
            DeviceEventEmitter.emit('cart_updated');
            return;
        }

        try {
            await api.post('/cart', { productId, variantId, quantity });
            DeviceEventEmitter.emit('cart_updated');
        } catch (e) {
            console.error('Add to cart failed', e);
            throw e;
        }
    },

    async updateQuantity(id: string, quantity: number): Promise<void> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            const localStr = await AsyncStorage.getItem(GUEST_CART_KEY);
            if (!localStr) return;
            let localCart: CartItem[] = JSON.parse(localStr);
            const index = localCart.findIndex(i => i.id === id);
            if (index !== -1) {
                localCart[index].quantity = quantity;
                await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(localCart));
                DeviceEventEmitter.emit('cart_updated');
            }
            return;
        }

        try {
            await api.put(`/cart/${id}`, null, { params: { quantity } });
            DeviceEventEmitter.emit('cart_updated');
        } catch (e) {
            console.error('Update quantity failed', e);
            throw e;
        }
    },

    async removeFromCart(id: string): Promise<void> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            const localStr = await AsyncStorage.getItem(GUEST_CART_KEY);
            if (!localStr) return;
            let localCart: CartItem[] = JSON.parse(localStr);
            localCart = localCart.filter(i => i.id !== id);
            await AsyncStorage.setItem(GUEST_CART_KEY, JSON.stringify(localCart));
            DeviceEventEmitter.emit('cart_updated');
            return;
        }

        try {
            await api.delete(`/cart/${id}`);
            DeviceEventEmitter.emit('cart_updated');
        } catch (e) {
            console.error('Remove from cart failed', e);
            throw e;
        }
    },

    async clearCart(): Promise<void> {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
            await AsyncStorage.removeItem(GUEST_CART_KEY);
            DeviceEventEmitter.emit('cart_updated');
            return;
        }

        try {
            await api.delete('/cart/clear');
            DeviceEventEmitter.emit('cart_updated');
        } catch (e) {
            console.error('Clear cart failed', e);
            throw e;
        }
    },

    async mergeGuestCart(): Promise<void> {
        try {
            const localStr = await AsyncStorage.getItem(GUEST_CART_KEY);
            if (!localStr) return;
            const localCart: CartItem[] = JSON.parse(localStr);
            if (localCart.length === 0) return;

            for (const item of localCart) {
                // Ignore errors per item so one failing doesn't break others
                try {
                    await api.post('/cart', { 
                        productId: item.product.id, 
                        variantId: item.variant.id, 
                        quantity: item.quantity 
                    });
                } catch (err) {
                    console.error('Failed to merge cart item', err);
                }
            }

            // Wipe local cart after merge attempt
            await AsyncStorage.removeItem(GUEST_CART_KEY);
            DeviceEventEmitter.emit('cart_updated');
        } catch (e) {
            console.error('Merge guest cart failed', e);
        }
    }
};
