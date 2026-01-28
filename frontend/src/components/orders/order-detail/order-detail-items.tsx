import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { OrderItem } from '@/services/order.service';
import { formatPrice } from '@/utils/format';

interface OrderDetailItemsProps {
    items: OrderItem[];
}

const OrderDetailItems: React.FC<OrderDetailItemsProps> = ({ items }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
            {items.map((item, idx) => (
                <View key={idx} style={[styles.itemRow, idx === items.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]}>
                    <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="cover" />
                    <View style={styles.itemContent}>
                        <Text numberOfLines={2} style={styles.itemName}>{item.productName}</Text>
                        <Text style={styles.itemVariant}>Phân loại: Mặc định</Text>
                        <View style={styles.itemSubRow}>
                            <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                        </View>
                    </View>
                </View>
            ))}
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
    itemRow: {
        flexDirection: 'row',
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
        marginBottom: 4,
    },
    itemVariant: {
        fontSize: 12,
        color: '#8A8D9F',
        marginBottom: 8,
    },
    itemSubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#222',
    },
    itemQuantity: {
        fontSize: 13,
        color: '#8A8D9F',
        fontWeight: '600',
    },
});

export default OrderDetailItems;
