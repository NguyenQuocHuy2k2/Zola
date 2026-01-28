import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getPaymentMethodLabel } from '@/utils/order';
import { PaymentMethod } from '@/services/order.service';

interface OrderDetailInfoProps {
    paymentMethod: PaymentMethod;
    phoneNumber: string;
    shippingAddress: string;
}

const OrderDetailInfo: React.FC<OrderDetailInfoProps> = ({ paymentMethod, phoneNumber, shippingAddress }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
            <View style={styles.infoRow}>
                <MaterialCommunityIcons name="truck-delivery-outline" size={20} color="#666" style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Phương thức thanh toán</Text>
                    <Text style={styles.infoValueDark}>{getPaymentMethodLabel(paymentMethod)}</Text>
                </View>
            </View>
            <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Địa chỉ nhận hàng</Text>
                    <Text style={styles.infoValueDark}>{phoneNumber}</Text>
                    <Text style={styles.infoValueDark}>{shippingAddress}</Text>
                </View>
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
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    infoIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#8A8D9F',
        marginBottom: 4,
    },
    infoValueDark: {
        fontSize: 14,
        color: '#222',
        fontWeight: '500',
        lineHeight: 20,
    },
});

export default OrderDetailInfo;
