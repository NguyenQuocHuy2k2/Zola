import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { formatPrice } from '@/utils/format';

interface OrderDetailSummaryProps {
    totalAmount: number;
}

const OrderDetailSummary: React.FC<OrderDetailSummaryProps> = ({ totalAmount }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiền hàng:</Text>
                <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                <Text style={styles.summaryValue}>{formatPrice(0)}</Text>
            </View>
            <Divider style={{ marginVertical: 12, backgroundColor: '#EAEAEA' }} />
            <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Thành tiền:</Text>
                <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#8A8D9F',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
});

export default OrderDetailSummary;
