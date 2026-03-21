import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator, Divider, Chip, Button, Portal, Modal, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { orderService, Order, OrderStatus } from '@/services/order.service';
import { formatPrice } from '@/utils/format';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/order';
import OrderDetailHeader from '@/components/orders/order-detail/order-detail-header';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const router = useRouter();
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);

    const loadOrderDetail = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
        setLoading(false);
    }, [id]);

    useFocusEffect(useCallback(() => {
        loadOrderDetail();
    }, [loadOrderDetail]));

    const handleUpdateStatus = async (newStatus: OrderStatus) => {
        if (!order) return;
        setUpdating(true);
        try {
            const updated = await orderService.updateOrderStatus(order.id, newStatus);
            if (updated) {
                setOrder(updated);
                setStatusModalVisible(false);
            } else {
                Alert.alert('Lỗi', 'Cập nhật trạng thái thất bại');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setUpdating(false);
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
                <Text>Không tìm thấy đơn hàng</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F9F9F9' }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <OrderDetailHeader 
                orderCode={order.orderCode} 
                createdAt={order.createdAt} 
                status={order.status} 
            />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Delivery Information Section */}
                <View style={styles.menuCard}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={22} color="#1D1D1D" />
                        <Text style={styles.cardTitle}>Thông tin giao hàng</Text>
                    </View>
                    
                    <View style={styles.deliveryContent}>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="account-outline" size={20} color="#666" style={styles.infoIcon} />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Khách hàng</Text>
                                <Text style={styles.infoValue}>{order.customerName || 'N/A'}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="phone-outline" size={20} color="#666" style={styles.infoIcon} />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Số điện thoại</Text>
                                <Text style={styles.infoValue}>{order.phoneNumber}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" style={styles.infoIcon} />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>Địa chỉ nhận hàng</Text>
                                <Text style={styles.infoValue}>{order.shippingAddress}</Text>
                            </View>
                        </View>

                        {order.notes && (
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="note-text-outline" size={20} color="#666" style={styles.infoIcon} />
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>Ghi chú</Text>
                                    <Text style={styles.infoValue}>{order.notes}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Items Card */}
                <View style={styles.menuCard}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="package-variant-closed" size={20} color="#1D1D1D" />
                        <Text style={styles.cardTitle}>Sản phẩm ({order.items?.length || 0})</Text>
                    </View>
                    {order.items?.map((item, index) => (
                        <View key={item.id}>
                            {index > 0 && <Divider style={styles.divider} />}
                            <View style={styles.itemRow}>
                                <Image 
                                    source={{ uri: item.imageUrl }} 
                                    style={styles.itemImage}
                                    contentFit="cover"
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                                    <Text style={styles.itemPrice}>
                                        {formatPrice(item.price)} x {item.quantity}
                                    </Text>
                                </View>
                                <Text style={styles.itemTotal}>
                                    {formatPrice(item.price * item.quantity)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Payment & Summary Card */}
                <View style={styles.menuCard}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="credit-card-outline" size={20} color="#1D1D1D" />
                        <Text style={styles.cardTitle}>Thanh toán & Tổng cộng</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Phương thức</Text>
                        <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Tạm tiền</Text>
                        <Text style={styles.summaryValue}>{formatPrice(order.totalAmount)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                        <Text style={styles.summaryValue}>{formatPrice(0)}</Text>
                    </View>
                    <Divider style={[styles.divider, { marginVertical: 12 }]} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalValue}>{formatPrice(order.totalAmount)}</Text>
                    </View>
                </View>

                {/* Status Update Section - Moved to Bottom */}
                <View style={styles.statusSection}>
                    <Button 
                        mode="contained" 
                        onPress={() => setStatusModalVisible(true)}
                        style={styles.updateBtn}
                        contentStyle={{ height: 50 }}
                        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        loading={updating}
                        disabled={updating}
                        buttonColor="#1D1D1D"
                    >
                        Cập nhật trạng thái
                    </Button>
                </View>
            </ScrollView>

            {/* Status Selection Modal */}
            <Portal>
                <Modal 
                    visible={statusModalVisible} 
                    onDismiss={() => setStatusModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Chọn trạng thái mới</Text>
                    </View>
                    <ScrollView>
                        {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((status) => (
                            <TouchableOpacity 
                                key={status} 
                                style={[
                                    styles.statusOption,
                                    order.status === status && { backgroundColor: '#F5F5F5' }
                                ]}
                                onPress={() => handleUpdateStatus(status)}
                            >
                                <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[status] }]} />
                                <Text style={[
                                    styles.statusOptionText,
                                    order.status === status && { fontWeight: 'bold', color: '#1D1D1D' }
                                ]}>
                                    {STATUS_LABEL[status]}
                                </Text>
                                {order.status === status && (
                                    <MaterialCommunityIcons name="check" size={20} color="#1D1D1D" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Button 
                        mode="text" 
                        onPress={() => setStatusModalVisible(false)}
                        style={{ marginTop: 12 }}
                        textColor="#666"
                    >
                        Đóng
                    </Button>
                </Modal>
            </Portal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { padding: 16, paddingBottom: 40 },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        marginBottom: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D1D1D',
        marginLeft: 10,
    },
    deliveryContent: {
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#8A8D9F',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: '#1D1D1D',
        fontWeight: '500',
        lineHeight: 20,
    },
    divider: {
        backgroundColor: '#F0F0F0',
        height: 1,
        marginVertical: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1D1D1D',
    },
    itemPrice: {
        fontSize: 13,
        color: '#777',
        marginTop: 4,
    },
    itemTotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#777',
    },
    summaryValue: {
        fontSize: 14,
        color: '#1D1D1D',
        fontWeight: '500',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E53935',
    },
    statusSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    updateBtn: {
        borderRadius: 16,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 24,
        margin: 20,
        borderRadius: 24,
        maxHeight: '80%',
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
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    statusOptionText: {
        fontSize: 16,
        color: '#444',
        flex: 1,
    },
});
