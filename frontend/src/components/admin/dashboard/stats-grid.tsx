import { View, StyleSheet } from 'react-native';
import { DashboardStats } from '@/services/dashboard.service';
import { formatPrice } from '@/utils/format';
import { StatCard } from './stat-card';

export function StatsGrid({ stats }: { stats: DashboardStats | null }) {
    return (
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
    );
}

const styles = StyleSheet.create({
    statsGrid: { gap: 16, marginBottom: 24 },
    row: { flexDirection: 'row', gap: 16 },
});
