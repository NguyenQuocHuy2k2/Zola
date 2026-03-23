import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotificationScreen() {
    const theme = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#FAFAFA' }]} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => {}}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.emptyContainer}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="bell-off-outline" size={48} color="#ccc" />
                    </View>
                    <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
                    <Text style={styles.emptySubtitle}>
                        Thông báo về đơn hàng và ưu đãi sẽ xuất hiện tại đây.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        lineHeight: 20,
    },
});