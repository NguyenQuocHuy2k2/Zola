import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { Review } from "@/services/review.service";

interface ProductReviewsProps {
    reviews: Review[];
    isExpanded: boolean;
    onToggle: () => void;
}

export default function ProductReviews({
    reviews,
    isExpanded,
    onToggle,
}: ProductReviewsProps) {
    return (
        <View>
            <TouchableOpacity
                style={[styles.accordionHeader, { marginTop: 16 }]}
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={styles.sectionTitle}>Đánh giá ({reviews.length})</Text>
                <IconButton
                    icon={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    style={{ margin: 0 }}
                />
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.accordionContent}>
                    {reviews.length === 0 ? (
                        <Text style={{ opacity: 0.6, marginTop: 8 }}>
                            Chưa có đánh giá nào.
                        </Text>
                    ) : (
                        reviews.map((rev) => (
                            <View key={rev.id} style={styles.reviewItem}>
                                <View style={styles.reviewItemHeader}>
                                    <Image
                                        source={{
                                            uri: rev.userAvatarUrl || "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg",
                                        }}
                                        style={styles.reviewAvatar}
                                    />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={styles.reviewUserName}>
                                            {rev.userFullName || 'Khách hàng'}
                                        </Text>
                                        <Text style={styles.reviewStars}>
                                            {"★".repeat(rev.rating)}
                                            <Text style={{ color: "#E0E0E0" }}>
                                                {"★".repeat(5 - rev.rating)}
                                            </Text>
                                        </Text>
                                    </View>
                                    <Text style={styles.reviewTimeText}>
                                        {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                                    </Text>
                                </View>
                                <Text style={styles.reviewCommentText}>{rev.comment}</Text>
                            </View>
                        ))
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    accordionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1E1E1E" },
    accordionContent: { paddingTop: 16 },
    reviewItem: { marginBottom: 24 },
    reviewItemHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    reviewAvatar: { width: 40, height: 40, borderRadius: 20 },
    reviewUserName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1E1E1E",
        marginBottom: 2,
    },
    reviewStars: { fontSize: 12, color: "#439775" },
    reviewTimeText: { fontSize: 12, color: "#C0C0C0" },
    reviewCommentText: { fontSize: 14, color: "#666666", lineHeight: 20 },
});
