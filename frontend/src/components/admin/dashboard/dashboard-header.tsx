import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

export function DashboardHeader({ onLogout }: { onLogout: () => void }) {
    return (
        <View style={styles.header}>
            <View>
                <Text variant="headlineSmall" style={styles.title}>Tổng quan</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>Chào mừng bạn quay lại, Admin!</Text>
            </View>
            <IconButton
                icon="logout"
                mode="contained-tonal"
                onPress={onLogout}
                containerColor="#FEE2E2"
                iconColor="#B91C1C"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    title: { fontWeight: 'bold' },
    subtitle: { color: '#666', marginTop: 4 },
});
