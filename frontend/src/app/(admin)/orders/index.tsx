import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { adminOrderService, AdminOrder, AdminOrderStatus } from '@/services/admin.service';
import { formatPrice } from '@/utils/format';

const STATUS_LABEL: Record<AdminOrderStatus, string> = {
    NEW: 'Mới', CONFIRMED: 'Xác nhận', PREPARING: 'Chuẩn bị',
    DELIVERING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};

const STATUS_COLOR: Record<AdminOrderStatus, string> = {
    NEW: '#3B82F6', CONFIRMED: '#8B5CF6', PREPARING: '#F59E0B',
    DELIVERING: '#06B6D4', DELIVERED: '#388E3C', CANCELLED: '#D32F2F',
};

const FILTER_TABS: { value: AdminOrderStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'NEW', label: 'Mới' },
    { value: 'CONFIRMED', label: 'Xác nhận' },
    { value: 'PREPARING', label: 'Chuẩn bị' },
    { value: 'DELIVERING', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Hủy' },
];


function OrderCard({ order, onPress }: { order: AdminOrder; onPress: () => void }) {
    const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.8}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <Text style={styles.orderIdText}>
                    Order #{order.id.replace('order_admin_', '').padStart(4, '0')}
                </Text>
                <Text style={styles.orderDateText}>
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            </View>

            {/* Customer info */}
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Khách hàng:</Text>
                <Text style={styles.infoValue}>{order.customerName}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Điện thoại:</Text>
                <Text style={styles.infoValue}>{order.customerPhone}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Địa chỉ:</Text>
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                    {order.address}
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
                    <Text style={styles.subtotalValue}>{formatPrice(order.total)}</Text>
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
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [filter, setFilter] = useState<AdminOrderStatus | 'ALL'>('ALL');

    const loadOrders = useCallback(() => {
        setOrders(adminOrderService.getAll());
    }, []);

    useFocusEffect(loadOrders);

    const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    return (
        <SafeAreaView style={styles.safe}>
            {/* Filter tabs */}
            <View style={styles.tabsContainer}>
                <FlatList
                    horizontal
                    data={FILTER_TABS}
                    keyExtractor={item => item.value}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsListContent}
                    renderItem={({ item: tab }) => {
                        const isActive = filter === tab.value;
                        const count = tab.value === 'ALL'
                            ? orders.length
                            : orders.filter(o => o.status === tab.value).length;
                        return (
                            <TouchableOpacity
                                onPress={() => setFilter(tab.value)}
                                style={[
                                    styles.tabChip,
                                    isActive
                                        ? { backgroundColor: theme.colors.primary }
                                        : { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E0E0E0' },
                                ]}
                                activeOpacity={0.8}
                            >
                                <Text style={isActive ? styles.activeTabText : styles.inactiveTabText}>
                                    {tab.label} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() => router.push({ pathname: '/(admin)/order/[id]', params: { id: item.id } })}
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
    tabsContainer: { paddingVertical: 12, backgroundColor: '#FAFAFA' },
    tabsListContent: { paddingHorizontal: 16, gap: 8 },
    tabChip: {
        flexDirection: 'row', alignItems: 'center',
        borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    },
    activeTabText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    inactiveTabText: { color: '#666', fontSize: 13 },
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
