import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import {
    Text,
    Button,
    ActivityIndicator,
} from 'react-native-paper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { orderService, Order, OrderItem } from '@/services/order.service';
import { reviewService, CreateReviewRequest } from '@/services/review.service';
import StatusModal from '@/components/ui/status-modal';

// Modular Components
import ReviewHeader from '@/components/review/review-header';
import OrderReviewItem from '@/components/review/order-review-item';
import AllReviewedStatus from '@/components/review/all-reviewed-status';

interface ItemReviewState {
    rating: number;
    comment: string;
    reviewed: boolean;
    submitting: boolean;
}

export default function ReviewScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

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
                data.items.forEach((item: OrderItem) => {
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
            (item: OrderItem) => !itemStates[item.id]?.reviewed
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
        (item: OrderItem) => !itemStates[item.id]?.reviewed
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

            <ReviewHeader
                orderCode={order.orderCode}
                onBack={() => router.back()}
            />

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    !hasUnreviewed && { flexGrow: 1, justifyContent: 'center' }
                ]}
            >
                {hasUnreviewed ? (
                    <>
                        {order.items.map((item: OrderItem) => {
                            const state = itemStates[item.id];
                            if (!state) return null;

                            return (
                                <OrderReviewItem
                                    key={item.id}
                                    item={item}
                                    rating={state.rating}
                                    comment={state.comment}
                                    reviewed={state.reviewed}
                                    onRatingChange={(rating) => setRating(item.id, rating)}
                                    onCommentChange={(text) => setComment(item.id, text)}
                                />
                            );
                        })}

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
                    </>
                ) : (
                    <AllReviewedStatus onBack={() => router.back()} />
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
    scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
    submitBtn: {
        borderRadius: 14,
        marginTop: 8,
    },
});
