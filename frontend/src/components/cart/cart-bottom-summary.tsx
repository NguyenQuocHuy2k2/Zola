import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { formatPrice } from '@/utils/format';

interface CartBottomSummaryProps {
    totalPrice: number;
    selectedCount: number;
    onCheckout: () => void;
    primaryColor: string;
}

export default function CartBottomSummary({
    totalPrice,
    selectedCount,
    onCheckout,
    primaryColor
}: CartBottomSummaryProps) {
    return (
        <View style={styles.bottomContainer}>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tiền hàng</Text>
                <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                <Text style={styles.summaryValue}>Miễn phí</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.summaryRow, { marginBottom: 24 }]}>
                <Text style={styles.subtotalLabel}>Tổng cộng</Text>
                <Text style={styles.subtotalValue}>{formatPrice(totalPrice)}</Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.checkoutButton, 
                    { backgroundColor: primaryColor }, 
                    selectedCount === 0 && { opacity: 0.5 }
                ]}
                onPress={onCheckout}
                disabled={selectedCount === 0}
            >
                <Text style={styles.checkoutText}>Thanh toán ngay ({selectedCount})</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 28,
        paddingTop: 32,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryLabel: {
        fontSize: 15,
        color: '#777',
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#222',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 16,
    },
    subtotalLabel: {
        fontSize: 16,
        color: '#222',
        fontWeight: '500',
    },
    subtotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    checkoutButton: {
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 8,
    },
    checkoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
