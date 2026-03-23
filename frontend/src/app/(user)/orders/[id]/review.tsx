import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {
    Text,
    Button,
    ActivityIndicator,
    useTheme,
} from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { orderService, Order, OrderItem } from '@/services/order.service';
import { reviewService, CreateReviewRequest } from '@/services/review.service';
import StatusModal from '@/components/ui/status-modal';

interface ItemReviewState {
    rating: number;
    comment: string;
    reviewed: boolean;
    submitting: boolean;
}

export default function ReviewScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const theme = useTheme();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [itemStates, setItemStates] = useState<Record<string, ItemReviewState>>({});
    const [submittingAll, setSubmittingAll] = useState(false);
    const [statusModal, setStatusModal] = useState<{
        visible: boolean;
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({ visible: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        if (id) loadOrder();
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const data = await orderService.getOrderById(id);
            setOrder(data);
            if (data) {
                const states: Record<string, ItemReviewState> = {};
                data.items.forEach(item => {
                    states[item.id] = {
                        rating: 5,
                        comment: '',
                        reviewed: item.reviewed ?? false,
                        submitting: false,
                    };
                });
                setItemStates(states);
            }
        } catch (error) {
            console.error('Load order failed', error);
        } finally {
            setLoading(false);
        }
    };

    const setRating = (itemId: string, rating: number) => {
        setItemStates(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], rating },
        }));
    };

    const setComment = (itemId: string, comment: string) => {
        setItemStates(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], comment },
        }));
    };

    const submitAll = async () => {
        if (!order) return;
        setSubmittingAll(true);
        const unreviewedItems = order.items.filter(
            item => !itemStates[item.id]?.reviewed
        );

        if (unreviewedItems.length === 0) {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Thông báo',
                message: 'Tất cả sản phẩm đã được đánh giá.',
            });
            setSubmittingAll(false);
            return;
        }

        let successCount = 0;
        let failCount = 0;

        for (const item of unreviewedItems) {
            const state = itemStates[item.id];
            try {
                const payload: CreateReviewRequest = {
                    orderItemId: item.id,
                    rating: state.rating,
                    comment: state.comment.trim() || undefined,
                };
                await reviewService.createReview(payload);
                setItemStates(prev => ({
                    ...prev,
                    [item.id]: { ...prev[item.id], reviewed: true },
                }));
                successCount++;
            } catch (error: any) {
                const msg: string = error?.response?.data?.message || '';
                if (msg.includes('đã được đánh giá')) {
                    setItemStates(prev => ({
                        ...prev,
                        [item.id]: { ...prev[item.id], reviewed: true },
                    }));
                } else {
                    failCount++;
                }
            }
        }

        setSubmittingAll(false);

        if (failCount === 0) {
            setStatusModal({
                visible: true,
                type: 'success',
                title: 'Cảm ơn bạn!',
                message: `Đã gửi ${successCount} đánh giá thành công.`,
            });
        } else {
            setStatusModal({
                visible: true,
                type: 'error',
                title: 'Lỗi',
                message: `${successCount} thành công, ${failCount} thất bại.`,
            });
        }
    };

    const hasUnreviewed = order?.items.some(
        item => !itemStates[item.id]?.reviewed
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.center}>
                <Text>Không tìm thấy đơn hàng</Text>
                <Button onPress={() => router.back()} style={{ marginTop: 16 }}>
                    Quay lại
                </Button>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#222" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
                    <Text style={styles.headerSub}>#{order.orderCode}</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    !hasUnreviewed && { flexGrow: 1, justifyContent: 'center' }
                ]}
            >
                {hasUnreviewed && order.items.map((item, idx) => {
                    const state = itemStates[item.id];
                    if (!state) return null;

                    return (
                        <View key={item.id} style={styles.card}>
                            {/* Product Info */}
                            <View style={styles.productRow}>
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={styles.productImage}
                                    resizeMode="cover"
                                />
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={2} style={styles.productName}>
                                        {item.productName}
                                    </Text>
                                    <Text style={styles.productQty}>Số lượng: {item.quantity}</Text>
                                </View>
                            </View>

                            {state.reviewed ? (
                                <View style={styles.reviewedBadge}>
                                    <MaterialCommunityIcons name="check-circle" size={16} color="#10B981" />
                                    <Text style={styles.reviewedText}>Đã đánh giá</Text>
                                </View>
                            ) : (
                                <>
                                    {/* Star Rating */}
                                    <View style={styles.ratingRow}>
                                        <Text style={styles.ratingLabel}>Đánh giá:</Text>
                                        <View style={styles.stars}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <TouchableOpacity
                                                    key={star}
                                                    onPress={() => setRating(item.id, star)}
                                                    activeOpacity={0.7}
                                                    style={styles.starBtn}
                                                >
                                                    <MaterialCommunityIcons
                                                        name={star <= state.rating ? 'star' : 'star-outline'}
                                                        size={32}
                                                        color={star <= state.rating ? '#F59E0B' : '#D1D5DB'}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Comment */}
                                    <TextInput
                                        style={styles.commentInput}
                                        placeholder="Nhận xét của bạn (tuỳ chọn)..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        value={state.comment}
                                        onChangeText={text => setComment(item.id, text)}
                                        textAlignVertical="top"
                                    />
                                </>
                            )}
                        </View>
                    );
                })}

                {/* Submit Button */}
                {hasUnreviewed && (
                    <Button
                        mode="contained"
                        buttonColor="#F59E0B"
                        style={styles.submitBtn}
                        labelStyle={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}
                        icon="send"
                        loading={submittingAll}
                        disabled={submittingAll}
                        onPress={submitAll}
                    >
                        Gửi Đánh Giá
                    </Button>
                )}

                {!hasUnreviewed && (
                    <View style={styles.allReviewedContainer}>
                        <MaterialCommunityIcons name="check-circle-outline" size={48} color="#10B981" />
                        <Text style={styles.allReviewedText}>
                            Bạn đã đánh giá tất cả sản phẩm trong đơn hàng này!
                        </Text>
                        <Button
                            mode="outlined"
                            onPress={() => router.back()}
                            style={{ marginTop: 16, borderRadius: 12 }}
                        >
                            Quay lại
                        </Button>
                    </View>
                )}
            </ScrollView>

            <StatusModal
                visible={statusModal.visible}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => {
                    setStatusModal(prev => ({ ...prev, visible: false }));
                    if (statusModal.type === 'success') router.back();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: { marginRight: 12, padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1D1D1D' },
    headerSub: { fontSize: 12, color: '#8A8D9F', marginTop: 2 },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    productRow: { flexDirection: 'row', marginBottom: 16 },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        marginRight: 12,
    },
    productName: { fontSize: 14, fontWeight: '600', color: '#222', marginBottom: 4 },
    productQty: { fontSize: 12, color: '#8A8D9F' },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingLabel: { fontSize: 14, color: '#444', marginRight: 12 },
    stars: { flexDirection: 'row', gap: 4 },
    starBtn: { padding: 2 },
    commentInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#222',
        minHeight: 44,
        maxHeight: 120,
        backgroundColor: '#FAFAFA',
    },
    reviewedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
    },
    reviewedText: { color: '#10B981', fontWeight: '600', fontSize: 14 },
    submitBtn: {
        borderRadius: 14,
        marginTop: 8,
    },
    allReviewedContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 12,
    },
    allReviewedText: {
        fontSize: 15,
        color: '#444',
        textAlign: 'center',
        lineHeight: 22,
    },
});
