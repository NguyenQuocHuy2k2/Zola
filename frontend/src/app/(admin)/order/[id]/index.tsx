import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Divider, ActivityIndicator, Menu, Button } from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { adminOrderService, AdminOrder, AdminOrderStatus } from '@/services/admin.service';
import { formatPrice } from '@/utils/format';

const STATUS_FLOW: AdminOrderStatus[] = ['NEW', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'];

const STATUS_LABEL: Record<AdminOrderStatus, string> = {
    NEW: 'Mới', CONFIRMED: 'Xác nhận', PREPARING: 'Chuẩn bị',
    DELIVERING: 'Đang giao', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy',
};

const STATUS_COLOR: Record<AdminOrderStatus, string> = {
    NEW: '#3B82F6', CONFIRMED: '#8B5CF6', PREPARING: '#F59E0B',
    DELIVERING: '#06B6D4', DELIVERED: '#388E3C', CANCELLED: '#D32F2F',
};


export default function AdminOrderDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [order, setOrder] = useState<AdminOrder | null>(null);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        if (id) setOrder(adminOrderService.getById(id) ?? null);
    }, [id]);

    const handleUpdateStatus = (status: AdminOrderStatus) => {
        if (!order) return;
        adminOrderService.updateStatus(order.id, status);
        setOrder(adminOrderService.getById(order.id) ?? null);
        setMenuVisible(false);
    };

    const handleCancel = () => {
        Alert.alert('Hủy đơn hàng', 'Bạn có chắc muốn hủy đơn hàng này?', [
            { text: 'Không', style: 'cancel' },
            {
                text: 'Có, hủy đơn', style: 'destructive',
                onPress: () => handleUpdateStatus('CANCELLED'),
            },
        ]);
    };

    if (!order) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const nextStatuses = STATUS_FLOW.filter(s => s !== order.status && s !== 'CANCELLED');
    const canUpdate = order.status !== 'DELIVERED' && order.status !== 'CANCELLED';
    const orderNum = order.id.replace('order_admin_', '').padStart(4, '0');

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Order #{orderNum}</Text>
                        <Text style={styles.headerSub}>
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[order.status] + '18' }]}>
                    <Text style={[styles.statusText, { color: STATUS_COLOR[order.status] }]}>
                        {STATUS_LABEL[order.status].toUpperCase()}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Customer Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="account-outline" size={20} color="#666" style={styles.infoIcon} />
                        <View>
                            <Text style={styles.infoLabel}>Khách hàng</Text>
                            <Text style={styles.infoValue}>{order.customerName}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="phone-outline" size={20} color="#666" style={styles.infoIcon} />
                        <View>
                            <Text style={styles.infoLabel}>Điện thoại</Text>
                            <Text style={styles.infoValue}>{order.customerPhone}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialCommunityIcons name="map-marker-outline" size={20} color="#666" style={styles.infoIcon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoLabel}>Địa chỉ giao hàng</Text>
                            <Text style={styles.infoValue}>{order.address}</Text>
                        </View>
                    </View>
                </View>

                {/* Items */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
                    {order.items.map((item, idx) => (
                        <View
                            key={idx}
                            style={[styles.itemRow, idx === order.items.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]}
                        >
                            <Image source={{ uri: item.product.images?.[0]?.imageUrl }} style={styles.itemImage} resizeMode="cover" />
                            <View style={styles.itemContent}>
                                <Text numberOfLines={2} style={styles.itemName}>{item.product.name}</Text>
                                <View style={styles.itemSubRow}>
                                    <Text style={styles.itemPrice}>{formatPrice(item.product.basePrice)}</Text>
                                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Payment Summary */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Tiền hàng:</Text>
                        <Text style={styles.summaryValue}>{formatPrice(order.total)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                        <Text style={styles.summaryValue}>{formatPrice(0)}</Text>
                    </View>
                    <Divider style={{ marginVertical: 10, backgroundColor: '#EAEAEA' }} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Thành tiền:</Text>
                        <Text style={styles.totalValue}>{formatPrice(order.total)}</Text>
                    </View>
                </View>

                {/* Status Update */}
                {canUpdate && (() => {
                    const STEP_ORDER: AdminOrderStatus[] = ['NEW', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED'];
                    const currentIdx = STEP_ORDER.indexOf(order.status);
                    const nextStep = STEP_ORDER[currentIdx + 1] as AdminOrderStatus | undefined;
                    return (
                        <View style={styles.card}>
                            <Text style={styles.sectionTitle}>Cập nhật trạng thái</Text>

                            {/* Stepper */}
                            <View style={styles.stepper}>
                                {STEP_ORDER.map((s, idx) => {
                                    const done = idx < currentIdx;
                                    const active = idx === currentIdx;
                                    const isLast = idx === STEP_ORDER.length - 1;
                                    return (
                                        <View key={s} style={styles.stepWrapper}>
                                            <View style={[
                                                styles.stepDot,
                                                done && styles.stepDotDone,
                                                active && { backgroundColor: STATUS_COLOR[s], borderColor: STATUS_COLOR[s] },
                                            ]}>
                                                {done
                                                    ? <MaterialCommunityIcons name="check" size={12} color="#fff" />
                                                    : <View style={[
                                                        styles.stepInner,
                                                        active && { backgroundColor: '#fff' },
                                                    ]} />
                                                }
                                            </View>
                                            <Text style={[
                                                styles.stepLabel,
                                                active && { color: STATUS_COLOR[s], fontWeight: '700' },
                                                done && { color: '#528F72' },
                                            ]} numberOfLines={1}>
                                                {STATUS_LABEL[s]}
                                            </Text>
                                            {!isLast && (
                                                <View style={[
                                                    styles.stepLine,
                                                    done && { backgroundColor: '#528F72' },
                                                ]} />
                                            )}
                                        </View>
                                    );
                                })}
                            </View>

                            {/* Next step button */}
                            {nextStep && (
                                <TouchableOpacity
                                    style={[styles.nextBtn, { backgroundColor: STATUS_COLOR[nextStep] }]}
                                    onPress={() => handleUpdateStatus(nextStep)}
                                    activeOpacity={0.85}
                                >
                                    <MaterialCommunityIcons name="arrow-right-circle-outline" size={20} color="#fff" />
                                    <Text style={styles.nextBtnText}>
                                        Chuyển sang: {STATUS_LABEL[nextStep]}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Cancel link */}
                            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                                <MaterialCommunityIcons name="close-circle-outline" size={15} color="#D32F2F" />
                                <Text style={styles.cancelBtnText}>Hủy đơn hàng</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F8F9FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 12,
        backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    backBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#FAFAFA',
        borderWidth: 1, borderColor: '#EAEAEA', justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#222' },
    headerSub: { fontSize: 12, color: '#8A8D9F', marginTop: 2 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
    statusText: { fontSize: 12, fontWeight: '700' },
    scroll: { padding: 16, paddingBottom: 32 },
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16,
        marginBottom: 16, elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8,
    },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 14 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    infoIcon: { marginRight: 12, marginTop: 2 },
    infoLabel: { fontSize: 12, color: '#8A8D9F', marginBottom: 2 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#222' },
    itemRow: {
        flexDirection: 'row', paddingBottom: 14, marginBottom: 14,
        borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
    },
    itemImage: { width: 70, height: 70, borderRadius: 10, backgroundColor: '#f0f0f0' },
    itemContent: { flex: 1, marginLeft: 12, justifyContent: 'center' },
    itemName: { fontSize: 14, fontWeight: '600', color: '#222', lineHeight: 20 },
    itemSubRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    itemPrice: { fontSize: 14, color: '#528F72', fontWeight: '700' },
    itemQty: { fontSize: 14, color: '#888' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 14, color: '#8A8D9F' },
    summaryValue: { fontSize: 14, color: '#222' },
    totalLabel: { fontSize: 15, fontWeight: '700', color: '#222' },
    totalValue: { fontSize: 16, fontWeight: '800', color: '#528F72' },
    // Stepper
    stepper: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, marginTop: 4 },
    stepWrapper: { flex: 1, alignItems: 'center', position: 'relative' },
    stepDot: {
        width: 24, height: 24, borderRadius: 12,
        borderWidth: 2, borderColor: '#D1D5DB', backgroundColor: '#fff',
        justifyContent: 'center', alignItems: 'center', zIndex: 1,
    },
    stepDotDone: { backgroundColor: '#528F72', borderColor: '#528F72' },
    stepInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB' },
    stepLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
    stepLine: {
        position: 'absolute', top: 12, left: '50%', right: '-50%',
        height: 2, backgroundColor: '#E5E7EB', zIndex: 0,
    },
    // Next button
    nextBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 14, borderRadius: 14, marginBottom: 12,
    },
    nextBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
    // Cancel
    cancelBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingVertical: 13, borderRadius: 14,
        borderWidth: 1.5, borderColor: '#FECACA', backgroundColor: '#FEF2F2',
        marginTop: 4,
    },
    cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#D32F2F' },
});
