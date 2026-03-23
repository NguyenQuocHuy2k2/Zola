import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Order } from '@/services/order.service';
import { formatPrice } from '@/utils/format';
import { getStatusLabel, getStatusColor } from '@/utils/order';

interface OrderItemCardProps {
    item: Order;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => {
    const router = useRouter();
    const itemCount = item.items.reduce((sum, current) => sum + current.quantity, 0);

    return (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push(`/orders/${item.id}`)}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.orderIdText}>{item.orderCode}</Text>
                <Text style={styles.orderDateText}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>

            {item.items.length > 0 && (
                <View style={styles.productSummaryContainer}>
                    {item.items.map((orderItem, index) => (
                        <View key={index} style={[styles.summaryItemRow, index < item.items.length - 1 && styles.summaryItemDivider]}>
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
                                <Text style={styles.summaryItemVariant}>Phân loại: Mặc định</Text>
                                <View style={styles.summaryItemPriceRow}>
                                    <Text style={styles.summaryItemPrice}>{formatPrice(orderItem.price)}</Text>
                                    <Text style={styles.summaryItemQuantity}>x{orderItem.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.cardInfoRow}>
                <View style={styles.rowLeft}>
                    <Text style={styles.infoLabel}>Số lượng:</Text>
                    <Text style={[styles.infoValue, { marginLeft: 8 }]}>{itemCount}</Text>
                </View>
                <View style={styles.rowRight}>
                    <Text style={styles.infoLabel}>Tổng tiền:</Text>
                    <Text style={styles.subtotalValue}>{formatPrice(item.totalAmount)}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {getStatusLabel(item.status).toUpperCase()}
                </Text>
                <View style={styles.footerActions}>
                    {item.status === 'RECEIVED' && item.items.some(i => !i.reviewed) && (
                        <TouchableOpacity
                            style={styles.reviewBtn}
                            onPress={() => router.push(`/orders/${item.id}/review`)}
                        >
                            <Text style={styles.reviewBtnText}>Đánh giá</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.detailsBtn}
                        onPress={() => router.push(`/orders/${item.id}`)}
                    >
                        <Text style={styles.detailsBtnText}>Chi tiết</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    productSummaryContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 4,
        marginBottom: 16,
    },
    summaryItemRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    summaryItemDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    summaryItemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        marginRight: 12,
    },
    summaryItemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    summaryItemTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    summaryItemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#222',
        flex: 1,
    },
    summaryItemVariant: {
        fontSize: 12,
        color: '#8A8D9F',
        marginBottom: 4,
    },
    summaryItemPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryItemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#222',
    },
    summaryItemQuantity: {
        fontSize: 14,
        color: '#8A8D9F',
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    orderDateText: {
        fontSize: 14,
        color: '#8A8D9F',
        marginTop: 2,
    },
    cardInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#8A8D9F',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
        marginLeft: 8,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtotalValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailsBtn: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        backgroundColor: 'white',
    },
    detailsBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
    },
    footerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    reviewBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F59E0B',
    },
    reviewBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
    }
});

export default OrderItemCard;
