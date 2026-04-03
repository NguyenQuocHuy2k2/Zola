import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { cartService, CartItem } from '@/services/cart.service';

import CartHeader from '@/components/cart/cart-header';
import EmptyCart from '@/components/cart/empty-cart';
import CartItemCard from '@/components/cart/cart-item-card';
import CartBottomSummary from '@/components/cart/cart-bottom-summary';
import ConfirmModal from '@/components/ui/confirm-modal';
import { GuestPlaceholder } from '@/components/auth/guest-placeholder';
import { IconButton, Text as PaperText } from 'react-native-paper';

export default function CartScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { user } = useAuth();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
    const initialLoadDone = useRef(false);

    // Modal state
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<string | null>(null);
    const [showGuestPrompt, setShowGuestPrompt] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadCart(!initialLoadDone.current);
        }, [])
    );

    const loadCart = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const items = await cartService.getCart();
            setCartItems(items || []);

            setSelectedItems(prev => {
                const newSelection: Record<string, boolean> = { ...prev };
                (items || []).forEach(item => {
                    if (newSelection[item.id] === undefined) {
                        newSelection[item.id] = false;
                    }
                });
                return newSelection;
            });
        } catch (e) {
            console.error('Failed to load cart', e);
        } finally {
            if (showLoader) setLoading(false);
            initialLoadDone.current = true;
        }
    };

    const updateQuantity = async (id: string, quantity: number) => {
        if (quantity < 1) {
            setItemToRemove(id);
            setConfirmModalVisible(true);
            return;
        }

        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));

        try {
            await cartService.updateQuantity(id, quantity);
        } catch (e) {
            await loadCart(false);
        }
    };

    const handleConfirmRemove = async () => {
        if (!itemToRemove) return;

        setConfirmModalVisible(false);
        try {
            await cartService.removeFromCart(itemToRemove);
            await loadCart(false);
        } catch (e) {
            console.error('Failed to remove item', e);
        } finally {
            setItemToRemove(null);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);
    const totalPrice = selectedCartItems.reduce((sum, item) => sum + (item.product.basePrice * item.quantity), 0);

    if (showGuestPrompt) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <View style={styles.guestPromptHeader}>
                    <IconButton icon="chevron-left" size={28} onPress={() => setShowGuestPrompt(false)} />
                    <PaperText variant="titleMedium" style={{ fontWeight: 'bold' }}>Thanh toán</PaperText>
                    <View style={{ width: 44 }} />
                </View>
                <GuestPlaceholder
                    title="Yêu cầu đăng nhập"
                    description="Vui lòng đăng nhập tài khoản Zola để tiến hành mua hàng và thanh toán."
                    icon="cart-arrow-right"
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <CartHeader />

            {loading ? (
                <ActivityIndicator style={styles.center} />
            ) : cartItems.length === 0 ? (
                <EmptyCart />
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <CartItemCard
                                item={item}
                                isSelected={!!selectedItems[item.id]}
                                onToggleSelection={toggleSelection}
                                onUpdateQuantity={updateQuantity}
                                onNavigateToProduct={(productId) => router.push(`/cart/${productId}`)}
                                onRemove={(id) => {
                                    setItemToRemove(id);
                                    setConfirmModalVisible(true);
                                }}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                    <CartBottomSummary
                        totalPrice={totalPrice}
                        selectedCount={selectedCartItems.length}
                        onCheckout={() => {
                            if (!user) {
                                setShowGuestPrompt(true);
                                return;
                            }
                            const ids = selectedCartItems.map(i => i.id).join(',');
                            router.push(`/cart/checkout?ids=${ids}`);
                        }}
                        primaryColor={theme.colors.primary}
                    />
                </>
            )}

            <ConfirmModal
                visible={confirmModalVisible}
                title="Xóa sản phẩm?"
                message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
                confirmLabel="Xóa"
                confirmColor="#FF5252"
                icon="trash-can-outline"
                onConfirm={handleConfirmRemove}
                onCancel={() => {
                    setConfirmModalVisible(false);
                    setItemToRemove(null);
                    loadCart(false); // Reload to reset optimistic quantity
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    guestPromptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
});
