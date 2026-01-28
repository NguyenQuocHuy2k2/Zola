import { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, useTheme, Card, Avatar, Switch, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { adminFeedbackService, AdminFeedback } from '@/services/admin.service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function StarRating({ rating }: { rating: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(s => (
                <MaterialCommunityIcons
                    key={s}
                    name={s <= rating ? 'star' : 'star-outline'}
                    size={14}
                    color={s <= rating ? '#F59E0B' : '#ccc'}
                />
            ))}
        </View>
    );
}

function FeedbackCard({
    feedback,
    onToggleHide,
    onDelete,
}: {
    feedback: AdminFeedback;
    onToggleHide: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const handleDelete = () => {
        Alert.alert('Xóa đánh giá', 'Bạn có chắc muốn xóa đánh giá này?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Xóa', style: 'destructive', onPress: () => onDelete(feedback.id) },
        ]);
    };

    return (
        <Card style={[styles.card, feedback.isHidden && styles.hiddenCard]}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Avatar.Text
                        size={36}
                        label={feedback.customerName.charAt(0).toUpperCase()}
                        style={{ backgroundColor: '#528F72' }}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text variant="bodyMedium" style={{ fontWeight: '700' }}>
                            {feedback.customerName}
                        </Text>
                        <Text variant="bodySmall" style={{ color: '#888' }}>
                            {new Date(feedback.createdAt).toLocaleDateString('vi-VN')}
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        <View style={styles.switchRow}>
                            <MaterialCommunityIcons
                                name={feedback.isHidden ? 'eye-off-outline' : 'eye-outline'}
                                size={16}
                                color={feedback.isHidden ? '#aaa' : '#528F72'}
                            />
                            <Switch
                                value={!feedback.isHidden}
                                onValueChange={() => onToggleHide(feedback.id)}
                                color="#528F72"
                            />
                        </View>
                        <IconButton
                            icon="delete-outline"
                            iconColor="#EF4444"
                            size={20}
                            onPress={handleDelete}
                            style={{ margin: 0 }}
                        />
                    </View>
                </View>

                <View style={styles.productRow}>
                    <MaterialCommunityIcons name="shopping-outline" size={14} color="#888" />
                    <Text variant="bodySmall" style={{ marginLeft: 4, color: '#666' }} numberOfLines={1}>
                        {feedback.productName}
                    </Text>
                </View>

                <View style={styles.ratingRow}>
                    <StarRating rating={feedback.rating} />
                    {feedback.isHidden && (
                        <View style={styles.hiddenBadge}>
                            <Text style={styles.hiddenBadgeText}>Đã ẩn</Text>
                        </View>
                    )}
                </View>

                <Text variant="bodyMedium" style={styles.comment}>
                    "{feedback.comment}"
                </Text>
            </Card.Content>
        </Card>
    );
}

export default function AdminFeedbacks() {
    const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);

    const load = useCallback(() => {
        setFeedbacks(adminFeedbackService.getAll());
    }, []);

    useFocusEffect(load);

    const handleToggleHide = (id: string) => {
        adminFeedbackService.toggleHide(id);
        load();
    };

    const handleDelete = (id: string) => {
        adminFeedbackService.delete(id);
        load();
    };

    const avgRating = feedbacks.length
        ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
        : '-';
    const visibleCount = feedbacks.filter(f => !f.isHidden).length;
    const hiddenCount = feedbacks.filter(f => f.isHidden).length;

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text variant="headlineSmall" style={styles.title}>Đánh giá</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="star" size={20} color="#F59E0B" />
                        <Text style={styles.statValue}>{avgRating}</Text>
                        <Text style={styles.statLabel}>Trung bình</Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="eye-outline" size={20} color="#528F72" />
                        <Text style={styles.statValue}>{visibleCount}</Text>
                        <Text style={styles.statLabel}>Hiển thị</Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="eye-off-outline" size={20} color="#aaa" />
                        <Text style={styles.statValue}>{hiddenCount}</Text>
                        <Text style={styles.statLabel}>Đã ẩn</Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons name="comment-multiple-outline" size={20} color="#3B82F6" />
                        <Text style={styles.statValue}>{feedbacks.length}</Text>
                        <Text style={styles.statLabel}>Tổng số</Text>
                    </View>
                </View>

                <FlatList
                    data={feedbacks}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <FeedbackCard
                            feedback={item}
                            onToggleHide={handleToggleHide}
                            onDelete={handleDelete}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    container: { flex: 1, padding: 16 },
    title: { fontWeight: 'bold', marginBottom: 12 },
    statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    statCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 12,
        padding: 10, alignItems: 'center', gap: 4,
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4,
    },
    statValue: { fontSize: 18, fontWeight: '700' },
    statLabel: { fontSize: 10, color: '#888', textAlign: 'center' },
    card: { marginBottom: 12, borderRadius: 12 },
    hiddenCard: { opacity: 0.6 },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
    actions: { flexDirection: 'row', alignItems: 'center' },
    switchRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    hiddenBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
    hiddenBadgeText: { fontSize: 11, color: '#888' },
    comment: { fontStyle: 'italic', color: '#444', lineHeight: 20 },
});
