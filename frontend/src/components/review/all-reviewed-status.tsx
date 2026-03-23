import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AllReviewedStatusProps {
    onBack: () => void;
}

export default function AllReviewedStatus({ onBack }: AllReviewedStatusProps) {
    return (
        <View style={styles.allReviewedContainer}>
            <MaterialCommunityIcons name="check-circle-outline" size={48} color="#10B981" />
            <Text style={styles.allReviewedText}>
                Bạn đã đánh giá tất cả sản phẩm trong đơn hàng này!
            </Text>
            <Button
                mode="outlined"
                onPress={onBack}
                style={{ marginTop: 16, borderRadius: 12 }}
            >
                Quay lại
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    allReviewedContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 12,
        flex: 1,
        justifyContent: 'center',
    },
    allReviewedText: {
        fontSize: 15,
        color: '#444',
        textAlign: 'center',
        lineHeight: 22,
    },
});
