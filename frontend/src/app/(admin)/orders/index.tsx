import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { orderService, Order, OrderStatus } from '@/services/order.service';
import { formatPrice } from '@/utils/format';
import OrderStatusTabs from '@/components/orders/order-status-tabs';

import { STATUS_LABEL, STATUS_COLOR } from '@/constants/order';


function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
    const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

    return (
        <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.8}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <Text style={styles.orderIdText}>
                    Order #{order.orderCode}
                </Text>
                <Text style={styles.orderDateText}>
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            </View>

            {/* Customer info */}
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Khách hàng:</Text>
                <Text style={styles.infoValue}>{order.customerName || 'N/A'}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Điện thoại:</Text>
                <Text style={styles.infoValue}>{order.phoneNumber}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Địa chỉ:</Text>
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                    {order.shippingAddress}
                </Text>
            </View>

            <View style={styles.separator} />

            {/* Quantity + Total */}
            <View style={styles.cardInfoRow}>
                <View style={styles.rowLeft}>
                    <Text style={styles.infoLabel}>Số lượng:</Text>
                    <Text style={[styles.infoValue, { marginLeft: 8 }]}>{itemCount}</Text>
                </View>
                <View style={styles.rowRight}>
                    <Text style={styles.infoLabel}>Tổng:</Text>
                    <Text style={styles.subtotalValue}>{formatPrice(order.totalAmount)}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
                <Text style={[styles.statusText, { color: STATUS_COLOR[order.status] }]}>
                    {STATUS_LABEL[order.status].toUpperCase()}
                </Text>
                <View style={styles.detailsBtn}>
                    <Text style={styles.detailsBtnText}>Chi tiết</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function AdminOrders() {
    const theme = useTheme();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

    const loadOrders = useCallback(async () => {
        const data = await orderService.getAllOrders();
        setOrders(data);
    }, []);

    useFocusEffect(useCallback(() => {
        loadOrders();
    }, [loadOrders]));

    const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    const counts = {
        ALL: orders.length,
        PENDING: orders.filter(o => o.status === 'PENDING').length,
        CONFIRMED: orders.filter(o => o.status === 'CONFIRMED').length,
        PREPARING: orders.filter(o => o.status === 'PREPARING').length,
        SHIPPING: orders.filter(o => o.status === 'SHIPPING').length,
        RECEIVED: orders.filter(o => o.status === 'RECEIVED').length,
        CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
    };

    return (
        <SafeAreaView style={styles.safe}>
            <OrderStatusTabs 
                activeTab={filter} 
                onTabChange={(tab) => setFilter(tab as any)} 
                counts={counts}
            />

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() => router.push({ pathname: '/order/[id]' as any, params: { id: item.id } })}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 40, opacity: 0.5 }}>
                        Không có đơn hàng nào
                    </Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    listContent: { padding: 16, paddingBottom: 24 },

    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 12,
    },
    orderIdText: { fontSize: 16, fontWeight: 'bold', color: '#222' },
    orderDateText: { fontSize: 14, color: '#8A8D9F', marginTop: 2 },
    cardInfoRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 8,
    },
    infoLabel: { fontSize: 14, color: '#8A8D9F' },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#222', marginLeft: 8 },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    rowRight: { flexDirection: 'row', alignItems: 'center' },
    subtotalValue: { fontSize: 15, fontWeight: 'bold', color: '#222', marginLeft: 8 },
    separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
    cardFooter: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 4,
    },
    statusText: { fontSize: 14, fontWeight: '600' },
    detailsBtn: {
        paddingHorizontal: 20, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1,
        borderColor: '#EAEAEA', backgroundColor: '#fff',
    },
    detailsBtnText: { fontSize: 14, fontWeight: '600', color: '#222' },
});
