import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, ActivityIndicator, Divider, Appbar } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { orderService, Order } from '@/services/order.service';
import OrderDetailHeader from '@/components/orders/order-detail/order-detail-header';
import OrderDetailItems from '@/components/orders/order-detail/order-detail-items';
import OrderDetailSummary from '@/components/orders/order-detail/order-detail-summary';
import OrderDetailInfo from '@/components/orders/order-detail/order-detail-info';
import OrderDetailActions from '@/components/orders/order-detail/order-detail-actions';
import ConfirmModal from '@/components/ui/confirm-modal';
import { Portal, Modal } from 'react-native-paper';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/order';
import { CancellationReason, CancellationReasonResponse } from '@/services/order.service';
import StatusModal from '@/components/ui/status-modal';
import OrderCancellationInfo from '@/components/admin/orders/details/order-cancellation-info';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const router = useRouter();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmReceivedModalVisible, setConfirmReceivedModalVisible] = useState(false);
    const [reasonModalVisible, setReasonModalVisible] = useState(false);
    const [reasons, setReasons] = useState<CancellationReasonResponse[]>([]);
    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({
        visible: false,
        type: 'success',
        title: '',
        message: '',
    });

    useEffect(() => {
        if (id) {
            loadOrder();
        }
    }, [id]);

    const showStatus = (type: 'success' | 'error', title: string, message: string) => {
        setStatusModal({ visible: true, type, title, message });
    };

    const loadOrder = async () => {
        setLoading(true);
        try {
            const [orderData, userReasons, adminReasons] = await Promise.all([
                orderService.getOrderById(id),
                orderService.getCancellationReasons('USER'),
                orderService.getCancellationReasons('ADMIN'),
            ]);
            setOrder(orderData);
            // Merge both reason lists so label lookup works regardless of who cancelled
            const merged = [...userReasons, ...adminReasons.filter(
                a => !userReasons.some(u => u.code === a.code)
            )];
            setReasons(merged);
        } catch (error) {
            console.error('Load order failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = () => {
        setConfirmModalVisible(true);
    };

    const processCancelOrder = (reason: CancellationReason) => {
        setReasonModalVisible(false);
        performCancel(reason);
    };

    const performCancel = async (reason?: CancellationReason) => {
        setCancelling(true);
        try {
            await orderService.cancelOrder(id, reason);
            showStatus('success', 'Thành công', 'Đơn hàng đã được hủy');
            loadOrder();
        } catch (error: any) {
            showStatus('error', 'Lỗi', error.message || 'Không thể hủy đơn hàng');
        } finally {
            setCancelling(false);
        }
    };

    const handleConfirmReceived = () => {
        setConfirmReceivedModalVisible(true);
    };

    const processConfirmReceived = async () => {
        setConfirmReceivedModalVisible(false);
        setConfirming(true);
        try {
            await orderService.updateOrderStatus(id, 'RECEIVED');
            showStatus('success', 'Thành công', 'Cảm ơn bạn đã mua sắm!');
            loadOrder();
        } catch (error: any) {
            showStatus('error', 'Lỗi', error.message || 'Có lỗi xảy ra');
        } finally {
            setConfirming(false);
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

    const canConfirm = () => {
        return order?.status === 'SHIPPING';
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
                    canCancel={canCancel()} 
                    canConfirm={canConfirm()}
                    onCancel={handleCancelOrder} 
                    onConfirmReceived={handleConfirmReceived}
                    cancelling={cancelling} 
                    confirming={confirming}
                />

                <OrderCancellationInfo order={order} reasons={reasons} />
            </ScrollView>

            <ConfirmModal
                visible={confirmModalVisible}
                title="Hủy đơn hàng"
                message="Bạn có chắc chắn muốn hủy đơn hàng này?"
                onConfirm={() => {
                    setConfirmModalVisible(false);
                    setReasonModalVisible(true);
                }}
                onCancel={() => setConfirmModalVisible(false)}
                confirmLabel="HỦY ĐƠN HÀNG"
                cancelLabel="QUAY LẠI"
                confirmColor={theme.colors.error}
                icon="close-circle-outline"
            />

            <ConfirmModal
                visible={confirmReceivedModalVisible}
                title="Xác nhận nhận hàng"
                message="Bạn đã nhận được sản phẩm và hài lòng với đơn hàng?"
                onConfirm={processConfirmReceived}
                onCancel={() => setConfirmReceivedModalVisible(false)}
                confirmLabel="ĐÃ NHẬN HÀNG"
                cancelLabel="CHƯA NHẬN"
                confirmColor={theme.colors.primary}
                icon="check-circle-outline"
            />

            <Portal>
                <Modal 
                    visible={reasonModalVisible} 
                    onDismiss={() => setReasonModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Lý do hủy đơn hàng</Text>
                    </View>
                    <ScrollView>
                        {reasons.map((reason) => (
                            <TouchableOpacity 
                                key={reason.code} 
                                style={styles.reasonOption}
                                onPress={() => processCancelOrder(reason.code)}
                            >
                                <Text style={styles.reasonOptionText}>
                                    {reason.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Button 
                        mode="text" 
                        onPress={() => setReasonModalVisible(false)}
                        style={{ marginTop: 12 }}
                        textColor="#666"
                    >
                        Quay lại
                    </Button>
                </Modal>
            </Portal>

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
    },

    modalContainer: {
        backgroundColor: 'white',
        padding: 24,
        margin: 20,
        borderRadius: 24,
    },
    modalHeader: {
        marginBottom: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    reasonOption: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
    },
    reasonOptionText: {
        fontSize: 16,
        color: '#444',
    },
});
