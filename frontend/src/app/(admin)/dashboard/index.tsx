import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type StatCardProps = {
    icon: string;
    label: string;
    value: string;
    color: string;
};

function StatCard({ icon, label, value, color }: StatCardProps) {
    return (
        <View style={[styles.statCard, { borderLeftColor: color }]}>
            <MaterialCommunityIcons name={icon as any} size={28} color={color} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

export default function AdminDashboard() {
    const theme = useTheme();

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text variant="headlineSmall" style={styles.title}>Dashboard</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>Tổng quan hệ thống</Text>

                <View style={styles.grid}>
                    <StatCard icon="package-variant" label="Sản phẩm" value="—" color={theme.colors.primary} />
                    <StatCard icon="clipboard-list" label="Đơn hàng" value="—" color="#F59E0B" />
                    <StatCard icon="comment-multiple" label="Đánh giá" value="—" color="#3B82F6" />
                    <StatCard icon="account-group" label="Khách hàng" value="—" color="#8B5CF6" />
                </View>

                <View style={styles.infoCard}>
                    <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={{ marginLeft: 8, flex: 1, color: '#555' }}>
                        Chào mừng đến trang quản trị Zola. Sử dụng các tab bên dưới để quản lý sản phẩm, đơn hàng, và đánh giá.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    container: { padding: 20, paddingBottom: 40 },
    title: { fontWeight: 'bold', marginBottom: 4 },
    subtitle: { color: '#888', marginBottom: 24 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        width: '47%',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        gap: 6,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    statValue: { fontSize: 22, fontWeight: 'bold', color: '#222' },
    statLabel: { fontSize: 13, color: '#888' },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        elevation: 1,
    },
});
