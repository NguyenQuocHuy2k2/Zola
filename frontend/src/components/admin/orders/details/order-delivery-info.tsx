import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Order } from '@/services/order.service';

interface OrderDeliveryInfoProps {
    order: Order;
}

const OrderDeliveryInfo: React.FC<OrderDeliveryInfoProps> = ({ order }) => {
    return (
        <View style={styles.menuCard}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="truck-delivery-outline" size={22} color="#1D1D1D" />
                <Text style={styles.cardTitle}>Thông tin giao hàng</Text>
            </View>
            
            <View style={styles.deliveryContent}>
                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="account-outline" size={20} color="#666" style={styles.infoIcon} />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Khách hàng</Text>
                        <Text style={styles.infoValue}>{order.customerName || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="phone-outline" size={20} color="#666" style={styles.infoIcon} />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Số điện thoại</Text>
                        <Text style={styles.infoValue}>{order.phoneNumber}</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" style={styles.infoIcon} />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Địa chỉ nhận hàng</Text>
                        <Text style={styles.infoValue}>{order.shippingAddress}</Text>
                    </View>
                </View>

                {order.notes && (
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="note-text-outline" size={20} color="#666" style={styles.infoIcon} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Ghi chú</Text>
                            <Text style={styles.infoValue}>{order.notes}</Text>
                        </View>
                    </View>
                )}
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
    deliveryContent: {
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: '#8A8D9F',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: '#1D1D1D',
        fontWeight: '500',
        lineHeight: 20,
    },
});

export default OrderDeliveryInfo;
