import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, ActivityIndicator, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { orderService, Order, OrderStatus, CancellationReason, CancellationReasonResponse } from '@/services/order.service';
import OrderDetailHeader from '@/components/orders/order-detail/order-detail-header';

import OrderDeliveryInfo from '@/components/admin/orders/details/order-delivery-info';
import OrderItemsList from '@/components/admin/orders/details/order-items-list';
import OrderPaymentSummary from '@/components/admin/orders/details/order-payment-summary';
import OrderCancellationInfo from '@/components/admin/orders/details/order-cancellation-info';
import CancellationReasonModal from '@/components/admin/orders/details/cancellation-reason-modal';
import StatusModal from '@/components/ui/status-modal';


const STATUS_ORDER: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'RECEIVED'];

const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_ORDER.indexOf(current);
    if (idx === -1 || idx >= STATUS_ORDER.length - 1) return null;
    return STATUS_ORDER[idx + 1];
};

const NEXT_STATUS_LABEL: Partial<Record<OrderStatus, string>> = {
    PENDING: 'Xác nhận đơn hàng',
    CONFIRMED: 'Chuyển sang Chuẩn bị',
    PREPARING: 'Chuyển sang Đang giao',
    SHIPPING: 'Xác nhận Đã giao',
};

const NEXT_STATUS_COLOR: Partial<Record<OrderStatus, string>> = {
    PENDING: '#8B5CF6',   // CONFIRMED color
    CONFIRMED: '#F59E0B', // PREPARING color
    PREPARING: '#06B6D4', // SHIPPING color
    SHIPPING: '#388E3C',  // RECEIVED color
};

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [advancing, setAdvancing] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [reasonModalVisible, setReasonModalVisible] = useState(false);
    const [reasons, setReasons] = useState<CancellationReasonResponse[]>([]);
    const [adminReasonsOnly, setAdminReasonsOnly] = useState<CancellationReasonResponse[]>([]);
    const [selectedReason, setSelectedReason] = useState<CancellationReason | null>(null);
    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({ visible: false, type: 'success', title: '', message: '' });

    const showStatus = (type: 'success' | 'error', title: string, message: string) => {
        setStatusModal({ visible: true, type, title, message });
    };

    const loadOrderDetail = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [orderData, userReasons, adminReasons] = await Promise.all([
                orderService.getOrderById(id),
                orderService.getCancellationReasons('USER'),
                orderService.getCancellationReasons('ADMIN')
            ]);
            setOrder(orderData);
            setAdminReasonsOnly(adminReasons);
            // Merge both reason lists so label lookup works regardless of who cancelled
            const merged = [...userReasons, ...adminReasons.filter(
                a => !userReasons.some(u => u.code === a.code)
            )];
            setReasons(merged);
        } catch (error) {
            console.error('Load order detail failed', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(useCallback(() => {
        loadOrderDetail();
    }, [loadOrderDetail]));

    const handleAdvanceStatus = async () => {
        if (!order) return;
        const next = getNextStatus(order.status);
        if (!next) return;
        setAdvancing(true);
        try {
            const updated = await orderService.updateOrderStatus(order.id, next);
            if (updated) {
                setOrder(updated);
                showStatus('success', 'Thành công', 'Đã cập nhật trạng thái đơn hàng');
            } else {
                showStatus('error', 'Lỗi', 'Cập nhật trạng thái thất bại');
            }
        } catch (error) {
            showStatus('error', 'Lỗi', 'Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setAdvancing(false);
        }
    };

    const handleCancelOrder = async (reason: CancellationReason) => {
        if (!order) return;
        setCancelling(true);
        try {
            const updated = await orderService.updateOrderStatus(order.id, 'CANCELLED', reason);
            if (updated) {
                setOrder(updated);
                setReasonModalVisible(false);
                showStatus('success', 'Thành công', 'Đơn hàng đã được hủy');
            } else {
                showStatus('error', 'Lỗi', 'Hủy đơn hàng thất bại');
            }
        } catch (error) {
            showStatus('error', 'Lỗi', 'Có lỗi xảy ra khi hủy đơn hàng');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1D1D1D" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.center}>
                <Text style={{ textAlign: 'center' }}>Không tìm thấy đơn hàng</Text>
            </View>
        );
    }

    const isTerminal = order.status === 'CANCELLED' || order.status === 'RECEIVED';
    const nextStatus = getNextStatus(order.status);
    const nextLabel = NEXT_STATUS_LABEL[order.status];
    const nextColor = NEXT_STATUS_COLOR[order.status] ?? '#1D1D1D';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F9F9F9' }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <OrderDetailHeader 
                orderCode={order.orderCode} 
                createdAt={order.createdAt} 
                status={order.status} 
            />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <OrderDeliveryInfo order={order} />
                <OrderItemsList items={order.items || []} />
                <OrderPaymentSummary order={order} />
                <OrderCancellationInfo order={order} reasons={reasons} />

                {!isTerminal && (
                    <View style={styles.statusSection}>
                        {nextStatus && nextLabel && (
                            <Button
                                mode="contained"
                                onPress={handleAdvanceStatus}
                                style={styles.advanceBtn}
                                contentStyle={{ height: 50 }}
                                labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                                loading={advancing}
                                disabled={advancing || cancelling}
                                buttonColor={nextColor}
                                icon="arrow-right-circle-outline"
                            >
                                {nextLabel}
                            </Button>
                        )}
                        <Button
                            mode="outlined"
                            onPress={() => {
                                setSelectedReason(null);
                                setReasonModalVisible(true);
                            }}
                            style={styles.cancelBtn}
                            contentStyle={{ height: 48 }}
                            labelStyle={{ fontSize: 15, fontWeight: 'bold' }}
                            loading={cancelling}
                            disabled={advancing || cancelling}
                            textColor={theme.colors.error}
                            icon="close-circle-outline"
                        >
                            Hủy đơn hàng
                        </Button>
                    </View>
                )}
            </ScrollView>

            <CancellationReasonModal 
                visible={reasonModalVisible}
                onDismiss={() => setReasonModalVisible(false)}
                reasons={adminReasonsOnly}
                selectedReason={selectedReason}
                setSelectedReason={setSelectedReason}
                onConfirm={() => selectedReason && handleCancelOrder(selectedReason)}
                onBack={() => setReasonModalVisible(false)}
                updating={cancelling}
            />

            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => setStatusModal(prev => ({ ...prev, visible: false }))}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    statusSection: {
        marginTop: 10,
        marginBottom: 20,
        gap: 10,
    },
    advanceBtn: {
        borderRadius: 16,
    },
    cancelBtn: {
        borderRadius: 16,
        borderColor: '#D32F2F',
    },
});

