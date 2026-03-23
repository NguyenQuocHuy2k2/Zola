import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ReviewHeaderProps {
    orderCode: string;
    onBack: () => void;
}

export default function ReviewHeader({ orderCode, onBack }: ReviewHeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#222" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
                <Text style={styles.headerSub}>#{orderCode}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});
