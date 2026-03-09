import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, ActivityIndicator, Divider, Appbar } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { orderService, Order } from '@/services/order.service';
import OrderDetailHeader from '@/components/orders/order-detail/order-detail-header';
import OrderDetailItems from '@/components/orders/order-detail/order-detail-items';
import OrderDetailSummary from '@/components/orders/order-detail/order-detail-summary';
import OrderDetailInfo from '@/components/orders/order-detail/order-detail-info';
import OrderDetailActions from '@/components/orders/order-detail/order-detail-actions';
import ConfirmModal from '@/components/ui/confirm-modal';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    useEffect(() => {
        if (id) {
            loadOrder();
        }
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
        setLoading(false);
    };

    const handleCancelOrder = () => {
        setConfirmModalVisible(true);
    };

    const processCancelOrder = async () => {
        setConfirmModalVisible(false);
        setCancelling(true);
        try {
            await orderService.cancelOrder(id);
            Alert.alert('Thành công', 'Đơn hàng đã được hủy');
            loadOrder();
        } catch (error: any) {
            Alert.alert('Lỗi', error.message || 'Không thể hủy đơn hàng');
        } finally {
            setCancelling(false);
        }
    };


    const canCancel = () => {
        if (!order) return false;
        if (order.status !== 'PENDING') return false;
        const createdAt = new Date(order.createdAt).getTime();
        const now = Date.now();
        const minutesDiff = (now - createdAt) / 1000 / 60;
        return minutesDiff <= 30;
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.centerContainer}>
                <Text>Không tìm thấy đơn hàng</Text>
                <Button onPress={() => router.back()} style={{ marginTop: 16 }}>Quay lại</Button>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8F9FA' }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <OrderDetailHeader 
                orderCode={order.orderCode} 
                createdAt={order.createdAt} 
                status={order.status} 
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <OrderDetailItems items={order.items} />
                <OrderDetailSummary totalAmount={order.totalAmount} />
                <OrderDetailInfo 
                    paymentMethod={order.paymentMethod} 
                    phoneNumber={order.phoneNumber} 
                    shippingAddress={order.shippingAddress} 
                />
                
                <OrderDetailActions 
                    visible={canCancel()} 
                    onCancel={handleCancelOrder} 
                    cancelling={cancelling} 
                />
            </ScrollView>

            <ConfirmModal
                visible={confirmModalVisible}
                title="Hủy đơn hàng"
                message="Bạn có chắc chắn muốn hủy đơn hàng này?"
                onConfirm={processCancelOrder}
                onCancel={() => setConfirmModalVisible(false)}
                confirmLabel="HỦY ĐƠN HÀNG"
                cancelLabel="QUAY LẠI"
                confirmColor={theme.colors.error}
                icon="close-circle-outline"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
        gap: 16,
    }
});
