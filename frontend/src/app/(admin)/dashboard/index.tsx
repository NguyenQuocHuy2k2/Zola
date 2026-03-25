import { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Text, Card, IconButton, useTheme, Menu, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService, DashboardStats, DailyOrderStat, LowStockProduct } from '@/services/dashboard.service';
import { formatPrice } from '@/utils/format';
import ConfirmModal from '@/components/ui/confirm-modal';
import { LineChart } from 'react-native-chart-kit';
import { Image } from 'expo-image';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
    return (
        <Card style={styles.statCard}>
            <Card.Content style={styles.statCardContent}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <IconButton icon={icon} iconColor={color} size={24} style={{ margin: 0 }} />
                </View>
                <View style={styles.statInfo}>
                    <Text style={styles.statLabel}>{label}</Text>
                    <Text style={styles.statValue}>{value}</Text>
                </View>
            </Card.Content>
        </Card>
    );
}

export default function AdminDashboard() {
    const { signOut } = useAuth();
    const theme = useTheme();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [dateMenuVisible, setDateMenuVisible] = useState(false);
    
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

    const chartData = {
        labels: dailyOrders.length > 0 ? dailyOrders.map(o => {
            const d = new Date(o.date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }) : [''],
        datasets: [
            {
                data: dailyOrders.length > 0 ? dailyOrders.map(o => o.count) : [0],
            }
        ]
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadStats} />}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text variant="headlineSmall" style={styles.title}>Tổng quan</Text>
                        <Text variant="bodyMedium" style={styles.subtitle}>Chào mừng bạn quay lại, Admin!</Text>
                    </View>
                    <IconButton
                        icon="logout"
                        mode="contained-tonal"
                        onPress={handleLogout}
                        containerColor="#FEE2E2"
                        iconColor="#B91C1C"
                    />

                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.row}>
                        <StatCard
                            label="Doanh thu (tháng)"
                            value={formatPrice(stats?.monthlyRevenue || 0)}
                            icon="currency-usd"
                            color="#10B981"
                        />
                        <StatCard
                            label="Đơn hàng mới"
                            value={stats?.monthlyOrders || 0}
                            icon="clipboard-list-outline"
                            color="#3B82F6"
                        />
                    </View>
                    <View style={styles.row}>
                        <StatCard
                            label="Sản phẩm"
                            value={stats?.totalProducts || 0}
                            icon="package-variant-closed"
                            color="#F59E0B"
                        />
                        <StatCard
                            label="Khách hàng"
                            value={stats?.totalUsers || 0}
                            icon="account-group-outline"
                            color="#8B5CF6"
                        />
                    </View>
                </View>

                {/* Chart Section */}
                <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Biểu đồ đơn hàng</Text>
                        <Menu
                            visible={dateMenuVisible}
                            onDismiss={() => setDateMenuVisible(false)}
                            anchor={
                                <Button mode="outlined" onPress={() => setDateMenuVisible(true)} compact>
                                    {dateRange === '7' ? '7 ngày' : '30 ngày'}
                                </Button>
                            }
                        >
                            <Menu.Item onPress={() => { setDateRange('7'); setDateMenuVisible(false); }} title="7 ngày" />
                            <Menu.Item onPress={() => { setDateRange('30'); setDateMenuVisible(false); }} title="30 ngày" />
                        </Menu>
                    </View>
                    <LineChart
                        data={chartData}
                        width={Dimensions.get('window').width - 90} // padding adjustments
                        height={220}
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: "4", strokeWidth: "2", stroke: "#2563EB" },
                            propsForBackgroundLines: { strokeDasharray: "" },
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16, marginLeft: -16 }}
                    />
                </View>

                {/* Low Stock Section */}
                <View style={styles.listContainer}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Sắp hết hàng</Text>
                    {lowStockProducts.length === 0 ? (
                        <Text style={{ color: '#666', marginTop: 8 }}>Không có sản phẩm nào sắp hết hàng.</Text>
                    ) : (
                        lowStockProducts.map((item, index) => (
                            <Card key={index} style={styles.productCard}>
                                <Card.Content style={styles.productCardContent}>
                                    <View style={styles.productImageContainer}>
                                        <Image 
                                            source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }} 
                                            style={styles.productImage} 
                                            contentFit="cover"
                                        />
                                    </View>
                                    <View style={styles.productDetails}>
                                        <Text style={styles.productName} numberOfLines={2}>{item.productName}</Text>
                                        <Text style={styles.productPrice}>{formatPrice(item.price || 0)}</Text>
                                        <View style={styles.badgesRow}>
                                            {item.categoryName && (
                                                <View style={styles.categoryBadge}>
                                                    <IconButton icon="tag-outline" size={12} iconColor="#2E7D32" style={styles.badgeIcon} />
                                                    <Text style={styles.categoryBadgeText}>{item.categoryName}</Text>
                                                </View>
                                            )}
                                            <View style={styles.stockBadge}>
                                                <Text style={styles.stockText}>Tồn: {item.stockQuantity}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>
                        ))
                    )}
                </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    title: { fontWeight: 'bold' },
    subtitle: { color: '#666', marginTop: 4 },
    statsGrid: { gap: 16, marginBottom: 24 },
    row: { flexDirection: 'row', gap: 16 },
    statCard: { flex: 1, borderRadius: 16, backgroundColor: '#fff', elevation: 2 },
    statCardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconContainer: { padding: 8, borderRadius: 12 },
    statInfo: { marginLeft: 12, flex: 1 },
    statLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#111' },
    infoCard: { borderRadius: 16, backgroundColor: '#EFF6FF', borderLeftWidth: 4, borderLeftColor: '#3B82F6' },
    chartContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, elevation: 2 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontWeight: 'bold' },
    segmentedButtons: { transform: [{ scale: 0.8 }] },
    listContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, elevation: 2 },
    productCard: { marginBottom: 12, backgroundColor: '#fff', elevation: 0, borderWidth: 1, borderColor: '#F3F4F6' },
    productCardContent: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    productImageContainer: {
        width: 72,
        height: 72,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden'
    },
    productImage: { width: '100%', height: '100%' },
    productDetails: { flex: 1, justifyContent: 'center' },
    productName: { fontWeight: 'bold', fontSize: 15, color: '#333', marginBottom: 4 },
    productPrice: { fontWeight: 'bold', fontSize: 14, color: '#2563EB', marginBottom: 8 },
    badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
    categoryBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingRight: 10, paddingLeft: 4, paddingVertical: 2, borderRadius: 12 },
    badgeIcon: { margin: 0, padding: 0, width: 16, height: 16 },
    categoryBadgeText: { color: '#2E7D32', fontSize: 11, fontWeight: 'bold' },
    stockBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    stockText: { color: '#E65100', fontWeight: 'bold', fontSize: 11 },
});

