import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OrderItem } from '@/services/order.service';

interface OrderReviewItemProps {
    item: OrderItem;
    rating: number;
    comment: string;
    reviewed: boolean;
    onRatingChange: (rating: number) => void;
    onCommentChange: (comment: string) => void;
}

export default function OrderReviewItem({
    item,
    rating,
    comment,
    reviewed,
    onRatingChange,
    onCommentChange,
}: OrderReviewItemProps) {
    return (
        <View style={styles.card}>
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

            {reviewed ? (
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
                                    onPress={() => onRatingChange(star)}
                                    activeOpacity={0.7}
                                    style={styles.starBtn}
                                >
                                    <MaterialCommunityIcons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={32}
                                        color={star <= rating ? '#F59E0B' : '#D1D5DB'}
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
                        value={comment}
                        onChangeText={onCommentChange}
                        textAlignVertical="top"
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
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
});
