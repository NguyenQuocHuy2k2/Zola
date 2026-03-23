import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Order, CancellationReasonResponse } from '@/services/order.service';

interface OrderCancellationInfoProps {
    order: Order;
    reasons: CancellationReasonResponse[];
}

const OrderCancellationInfo: React.FC<OrderCancellationInfoProps> = ({ order, reasons }) => {
    const theme = useTheme();

    if (order.status !== 'CANCELLED' || !order.cancellationReason) {
        return null;
    }

    return (
        <View style={[styles.menuCard, { borderColor: theme.colors.error, borderWidth: 1 }]}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="close-circle-outline" size={20} color={theme.colors.error} />
                <Text style={[styles.cardTitle, { color: theme.colors.error }]}>Lý do hủy đơn</Text>
            </View>
            <Text style={styles.infoValue}>
                {reasons.find(r => r.code === order.cancellationReason)?.label || order.cancellationReason}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        marginBottom: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D1D1D',
        marginLeft: 10,
    },
    infoValue: {
        fontSize: 15,
        color: '#1D1D1D',
        fontWeight: '500',
        lineHeight: 20,
    },
});

export default OrderCancellationInfo;
