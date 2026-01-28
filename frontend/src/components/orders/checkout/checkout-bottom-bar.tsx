import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { formatPrice } from '@/utils/format';

interface CheckoutBottomBarProps {
    finalTotal: number;
    submitting: boolean;
    onCheckout: () => void;
}

export const CheckoutBottomBar = ({
    finalTotal,
    submitting,
    onCheckout
}: CheckoutBottomBarProps) => {
    return (
        <View style={styles.bottomBar}>
            <View style={styles.totalContainer}>
                <Text style={styles.totalBarLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalBarValue}>{formatPrice(finalTotal)}</Text>
            </View>
            <Button
                mode="contained"
                onPress={onCheckout}
                loading={submitting}
                disabled={submitting}
                style={styles.checkoutBtn}
                contentStyle={styles.checkoutBtnContent}
                labelStyle={styles.checkoutBtnLabel}
            >
                ĐẶT HÀNG NGAY
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 16,
    },
    totalContainer: {
        flex: 1,
    },
    totalBarLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    totalBarValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    checkoutBtn: {
        flex: 1.2,
        borderRadius: 12,
        elevation: 0,
    },
    checkoutBtnContent: {
        height: 48,
    },
    checkoutBtnLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
