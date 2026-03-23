import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Order } from '@/services/order.service';
import { formatPrice } from '@/utils/format';
import { STATUS_LABEL, STATUS_COLOR } from '@/constants/order';

interface OrderCardProps {
    order: Order;
    onPress: () => void;
}

export default function OrderCard({ order, onPress }: OrderCardProps) {
    const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

    return (
        <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.8}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <Text style={styles.orderIdText}>
                    Order #{order.orderCode}
                </Text>
                <Text style={styles.orderDateText}>
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            </View>

            {/* Product summary */}
            {order.items && order.items.length > 0 && (
                <View style={styles.productSummaryContainer}>
                    {order.items.map((orderItem, index) => (
                        <View key={index} style={[styles.summaryItemRow, index < order.items.length - 1 && styles.summaryItemDivider]}>
                            <Image
                                source={{ uri: orderItem.imageUrl }}
                                style={styles.summaryItemImage}
                                resizeMode="cover"
                            />
                            <View style={styles.summaryItemContent}>
                                <View style={styles.summaryItemTitleRow}>
                                    <Text numberOfLines={1} style={styles.summaryItemName}>
                                        {orderItem.productName}
                                    </Text>
                                </View>
                                <View style={styles.summaryItemPriceRow}>
                                    <Text style={styles.summaryItemPrice}>{formatPrice(orderItem.price)}</Text>
                                    <Text style={styles.summaryItemQuantity}>x{orderItem.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Customer info */}
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Khách hàng:</Text>
                <Text style={styles.infoValue}>{order.customerName || 'N/A'}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Điện thoại:</Text>
                <Text style={styles.infoValue}>{order.phoneNumber}</Text>
            </View>
            <View style={styles.cardInfoRow}>
                <Text style={styles.infoLabel}>Địa chỉ:</Text>
                <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>
                    {order.shippingAddress}
                </Text>
            </View>

            <View style={styles.separator} />

            {/* Quantity + Total */}
            <View style={styles.cardInfoRow}>
                <View style={styles.rowLeft}>
                    <Text style={styles.infoLabel}>Số lượng:</Text>
                    <Text style={[styles.infoValue, { marginLeft: 8 }]}>{itemCount}</Text>
                </View>
                <View style={styles.rowRight}>
                    <Text style={styles.infoLabel}>Tổng:</Text>
                    <Text style={styles.subtotalValue}>{formatPrice(order.totalAmount)}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
                <Text style={[styles.statusText, { color: STATUS_COLOR[order.status] }]}>
                    {STATUS_LABEL[order.status].toUpperCase()}
                </Text>
                <View style={styles.detailsBtn}>
                    <Text style={styles.detailsBtnText}>Chi tiết</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 12,
    },
    orderIdText: { fontSize: 16, fontWeight: 'bold', color: '#222' },
    orderDateText: { fontSize: 14, color: '#8A8D9F', marginTop: 2 },
    cardInfoRow: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 8,
    },
    infoLabel: { fontSize: 14, color: '#8A8D9F' },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#222', marginLeft: 8 },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    rowRight: { flexDirection: 'row', alignItems: 'center' },
    subtotalValue: { fontSize: 15, fontWeight: 'bold', color: '#222', marginLeft: 8 },
    separator: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
    cardFooter: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 4,
    },
    statusText: { fontSize: 14, fontWeight: '600' },
    detailsBtn: {
        paddingHorizontal: 20, paddingVertical: 8,
        borderRadius: 20, borderWidth: 1,
        borderColor: '#EAEAEA', backgroundColor: '#fff',
    },
    detailsBtnText: { fontSize: 14, fontWeight: '600', color: '#222' },

    // Product summary styles
    productSummaryContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 4,
        marginBottom: 12,
    },
    summaryItemRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    summaryItemDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    summaryItemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FFF',
        marginRight: 10,
    },
    summaryItemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    summaryItemTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryItemName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#222',
        flex: 1,
    },
    summaryItemPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    summaryItemPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#222',
    },
    summaryItemQuantity: {
        fontSize: 12,
        color: '#8A8D9F',
    },
});
