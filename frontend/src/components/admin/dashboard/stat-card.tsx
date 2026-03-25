import { View, StyleSheet } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

export function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
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

const styles = StyleSheet.create({
    statCard: { flex: 1, borderRadius: 16, backgroundColor: '#fff', elevation: 2 },
    statCardContent: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconContainer: { padding: 8, borderRadius: 12 },
    statInfo: { marginLeft: 12, flex: 1 },
    statLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#111' },
});
