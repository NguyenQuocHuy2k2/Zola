import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, RadioButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaymentMethod } from '@/services/order.service';

interface CheckoutPaymentProps {
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
}

export const CheckoutPayment = ({
    paymentMethod,
    setPaymentMethod
}: CheckoutPaymentProps) => {
    const theme = useTheme();

    return (
        <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            </View>
            
            <RadioButton.Group onValueChange={newValue => setPaymentMethod(newValue as PaymentMethod)} value={paymentMethod}>
                <TouchableOpacity style={styles.radioRow} onPress={() => setPaymentMethod('COD')}>
                    <RadioButton value="COD" color={theme.colors.primary} />
                    <View>
                        <Text style={styles.radioLabel}>Thanh toán khi nhận hàng (COD)</Text>
                        <Text style={styles.radioSubLabel}>Thanh toán bằng tiền mặt khi nhận được hàng</Text>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.radioRow} onPress={() => setPaymentMethod('VNPAY')}>
                    <RadioButton value="VNPAY" color={theme.colors.primary} />
                    <View>
                        <Text style={styles.radioLabel}>Thanh toán qua VNPay</Text>
                        <Text style={styles.radioSubLabel}>Thanh toán an toàn qua cổng VNPAY</Text>
                    </View>
                </TouchableOpacity>
            </RadioButton.Group>
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
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    radioLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E1E1E',
    },
    radioSubLabel: {
        fontSize: 12,
        color: '#8A8D9F',
        marginTop: 2,
    },
});
