import { useState, useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { orderService, Order, OrderStatus } from '@/services/order.service';
import OrderStatusTabs from '@/components/orders/order-status-tabs';
import OrderCard from '@/components/admin/orders/order-card';
import OrderListHeader from '@/components/admin/orders/order-list-header';

export default function AdminOrders() {
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

    const filtered = filter === 'ALL' ? orders : orders.filter((o: Order) => o.status === filter);

    const counts = {
        ALL: orders.length,
        PENDING: orders.filter((o: Order) => o.status === 'PENDING').length,
        CONFIRMED: orders.filter((o: Order) => o.status === 'CONFIRMED').length,
        PREPARING: orders.filter((o: Order) => o.status === 'PREPARING').length,
        SHIPPING: orders.filter((o: Order) => o.status === 'SHIPPING').length,
        RECEIVED: orders.filter((o: Order) => o.status === 'RECEIVED').length,
        CANCELLED: orders.filter((o: Order) => o.status === 'CANCELLED').length,
    };

    return (
        <SafeAreaView style={styles.safe}>
            <OrderListHeader orderCount={orders.length} />

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
                        onPress={() => router.push({ pathname: '/(admin)/orders/[id]' as any, params: { id: item.id } })}
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
});
