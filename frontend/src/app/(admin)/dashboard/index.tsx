import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService, DashboardStats } from '@/services/dashboard.service';
import { formatPrice } from '@/utils/format';

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

    const loadStats = useCallback(async () => {
        setRefreshing(true);
        const data = await dashboardService.getStats();
        if (data) setStats(data);
        setRefreshing(false);
    }, []);

    useFocusEffect(useCallback(() => {
        loadStats();
    }, [loadStats]));

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
                        onPress={signOut} 
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

                {/* Activity Placeholder or additional charts can go here */}
                <Card style={styles.infoCard}>
                    <Card.Title title="Thông tin hệ thống" left={(props) => <IconButton {...props} icon="information-outline" />} />
                    <Card.Content>
                        <Text variant="bodyMedium">Tất cả dữ liệu được cập nhật thời gian thực từ hệ thống ZOLA.</Text>
                    </Card.Content>
                </Card>
            </ScrollView>
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
});

