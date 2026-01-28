import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { Stack, useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { orderService, Order, OrderStatus } from '@/services/order.service';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatPrice } from '@/utils/format';
import { TABS, getStatusLabel, getStatusColor } from '@/utils/order';
import OrderItemCard from '@/components/orders/order-item-card';
import OrderStatusTabs from '@/components/orders/order-status-tabs';

export default function OrdersScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { status: initialStatus } = useLocalSearchParams<{ status?: string }>();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>(initialStatus || 'PENDING');
    const initialLoadDone = useRef(false);

    const loadOrders = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        const data = await orderService.getOrderHistory();
        setOrders(data);
        setLoading(false);
        initialLoadDone.current = true;
    };

    useFocusEffect(
        useCallback(() => {
            loadOrders(!initialLoadDone.current);
        }, [])
    );

    const filteredOrders = orders.filter(o => {
        if (activeTab === 'ALL') return true;
        return o.status === activeTab;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#FAFAFA' }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.push('/product')} style={styles.backBtn}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đơn hàng của bạn</Text>
                <View style={{ width: 44 }} />
            </View>

            <OrderStatusTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {loading ? (
                <ActivityIndicator style={styles.center} />
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <OrderItemCard item={item} />}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40, opacity: 0.6 }}>
                            Không có đơn hàng nào
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: -10,
    },
    listContent: {
        padding: 16,
    }
});
