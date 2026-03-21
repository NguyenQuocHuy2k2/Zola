import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface OrderListHeaderProps {
    orderCount: number;
}

export default function OrderListHeader({ orderCount }: OrderListHeaderProps) {
    return (
        <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
                Quản lý đơn hàng
            </Text>
            <View style={styles.countBadge}>
                <Text variant="bodySmall" style={styles.countText}>
                    {orderCount}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#FAFAFA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontWeight: '800',
        color: '#1a1a1a',
        letterSpacing: -0.5,
    },
    countBadge: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    countText: {
        color: '#666',
        fontWeight: '700',
        fontSize: 14,
    },
});
