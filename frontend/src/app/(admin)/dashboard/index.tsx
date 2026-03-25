import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService, DashboardStats, DailyOrderStat, LowStockProduct } from '@/services/dashboard.service';
import ConfirmModal from '@/components/ui/confirm-modal';

import { DashboardHeader } from '@/components/admin/dashboard/dashboard-header';
import { StatsGrid } from '@/components/admin/dashboard/stats-grid';
import { OrdersChart } from '@/components/admin/dashboard/orders-chart';
import { LowStockList } from '@/components/admin/dashboard/low-stock-list';

export default function AdminDashboard() {
    const { signOut } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [dailyOrders, setDailyOrders] = useState<DailyOrderStat[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
    const [dateRange, setDateRange] = useState('7');

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = () => {
        setLogoutModalVisible(false);
        signOut();
    };

    const loadOrders = useCallback(async (range: string) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - parseInt(range));
        const orders = await dashboardService.getDailyOrders(start.toISOString(), end.toISOString());
        setDailyOrders(orders);
    }, []);

    const loadStats = useCallback(async () => {
        setRefreshing(true);
        const [data, stocks] = await Promise.all([
            dashboardService.getStats(),
            dashboardService.getLowStockProducts()
        ]);
        if (data) setStats(data);
        setLowStockProducts(stocks);
        await loadOrders(dateRange);
        setRefreshing(false);
    }, [dateRange, loadOrders]);

    useFocusEffect(useCallback(() => {
        loadStats();
    }, [loadStats]));

    useEffect(() => {
        loadOrders(dateRange);
    }, [dateRange, loadOrders]);

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadStats} />}
            >
                <DashboardHeader onLogout={handleLogout} />
                <StatsGrid stats={stats} />
                <OrdersChart dailyOrders={dailyOrders} dateRange={dateRange} setDateRange={setDateRange} />
                <LowStockList products={lowStockProducts} />
            </ScrollView>

            <ConfirmModal
                visible={logoutModalVisible}
                title="Đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản quản trị không?"
                confirmLabel="Đăng xuất"
                confirmColor="#FF5252"
                icon="logout-variant"
                onConfirm={confirmLogout}
                onCancel={() => setLogoutModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    scrollContent: { padding: 20 },
});
