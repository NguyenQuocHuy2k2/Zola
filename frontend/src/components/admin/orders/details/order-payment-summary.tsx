import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Order } from '@/services/order.service';
import { formatPrice } from '@/utils/format';

interface OrderPaymentSummaryProps {
    order: Order;
}

const OrderPaymentSummary: React.FC<OrderPaymentSummaryProps> = ({ order }) => {
    return (
        <View style={styles.menuCard}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#1D1D1D" />
                <Text style={styles.cardTitle}>Thanh toán & Tổng cộng</Text>
            </View>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Phương thức</Text>
                <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
            </View>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Tạm tiền</Text>
                <Text style={styles.summaryValue}>{formatPrice(order.totalAmount)}</Text>
            </View>
            <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                <Text style={styles.summaryValue}>{formatPrice(0)}</Text>
            </View>
            <Divider style={[styles.divider, { marginVertical: 12 }]} />
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalValue}>{formatPrice(order.totalAmount)}</Text>
            </View>
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
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#777',
    },
    summaryValue: {
        fontSize: 14,
        color: '#1D1D1D',
        fontWeight: '500',
    },
    divider: {
        backgroundColor: '#F0F0F0',
        height: 1,
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#E53935',
    },
});

export default OrderPaymentSummary;
