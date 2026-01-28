import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStatusLabel, getStatusColor } from '@/utils/order';
import { OrderStatus } from '@/services/order.service';

interface OrderDetailHeaderProps {
    orderCode: string;
    createdAt: string;
    status: OrderStatus;
}

const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({ orderCode, createdAt, status }) => {
    const router = useRouter();
    
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{orderCode}</Text>
                    <Text style={styles.headerSubtitle}>{new Date(createdAt).toLocaleString('vi-VN')}</Text>
                </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '15' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                    {getStatusLabel(status).toUpperCase()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTextContainer: {
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#8A8D9F',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default OrderDetailHeader;
