import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { formatPrice } from '@/utils/format';

interface CheckoutSummaryProps {
    totalItemPrice: number;
    discountAmount: number;
    finalTotal: number;
}

export const CheckoutSummary = ({
    totalItemPrice,
    discountAmount,
    finalTotal
}: CheckoutSummaryProps) => {
    const theme = useTheme();

    return (
        <View style={styles.card}>
                <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiền hàng:</Text>
                <Text style={styles.summaryValue}>{formatPrice(totalItemPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                <Text style={styles.summaryValue}>{formatPrice(0)}</Text>
            </View>
            {discountAmount > 0 && (
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Giảm giá:</Text>
                    <Text style={[styles.summaryValue, { color: theme.colors.error }]}>-{formatPrice(discountAmount)}</Text>
                </View>
            )}
            <Divider style={{ marginVertical: 12, backgroundColor: '#EAEAEA' }} />
            <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Thành tiền:</Text>
                <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 13,
        color: '#8A8D9F',
    },
    summaryValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#222',
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
    },
    totalValue: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
});
