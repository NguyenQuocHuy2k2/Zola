import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OrderItem } from '@/services/order.service';
import { formatPrice } from '@/utils/format';

interface OrderItemsListProps {
    items: OrderItem[];
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({ items }) => {
    return (
        <View style={styles.menuCard}>
            <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="package-variant-closed" size={20} color="#1D1D1D" />
                <Text style={styles.cardTitle}>Sản phẩm ({items?.length || 0})</Text>
            </View>
            {items?.map((item, index) => (
                <View key={item.id}>
                    {index > 0 && <Divider style={styles.divider} />}
                    <View style={styles.itemRow}>
                        <Image 
                            source={{ uri: item.imageUrl }} 
                            style={styles.itemImage}
                            resizeMode="cover"
                        />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                            <Text style={styles.itemPrice}>
                                {formatPrice(item.price)} x {item.quantity}
                            </Text>
                        </View>
                        <Text style={styles.itemTotal}>
                            {formatPrice(item.price * item.quantity)}
                        </Text>
                    </View>
                </View>
            ))}
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
    divider: {
        backgroundColor: '#F0F0F0',
        height: 1,
        marginVertical: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1D1D1D',
    },
    itemPrice: {
        fontSize: 13,
        color: '#777',
        marginTop: 4,
    },
    itemTotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1D1D1D',
    },
});

export default OrderItemsList;
