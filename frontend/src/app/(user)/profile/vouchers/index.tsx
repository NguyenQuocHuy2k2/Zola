import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { Stack, useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import voucherService, { Voucher } from '@/services/voucher.service';
import { VoucherCard } from '@/components/voucher/voucher-card';

export default function VouchersScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadVouchers = async () => {
        try {
            const data = await voucherService.getMyVouchers();
            setVouchers(data);
        } catch (error) {
            console.error('Failed to load vouchers', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadVouchers();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadVouchers();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8F9FA' }]} edges={['top', 'left', 'right']}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <View style={styles.header}>
                <IconButton icon="chevron-left" size={28} onPress={() => router.back()} style={styles.backBtn} />
                <Text style={styles.headerTitle}>Kho voucher</Text>
                <View style={{ width: 44 }} />
            </View>

            <FlatList
                data={vouchers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <VoucherCard voucher={item} disabled />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <IconButton icon="ticket-outline" size={80} iconColor="#CCC" />
                        <Text style={styles.emptyText}>Bạn chưa có voucher nào</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: {
        backgroundColor: '#F8F9FA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 8,
    },
});
