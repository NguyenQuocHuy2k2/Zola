import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Text, IconButton, useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import voucherService, { Voucher } from '@/services/voucher.service';
import { VoucherCard } from './voucher-card';

interface VoucherSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (voucher: Voucher) => void;
    selectedVoucherId?: string;
    orderTotal: number;
}

export const VoucherSelectionModal = ({
    visible,
    onClose,
    onSelect,
    selectedVoucherId,
    orderTotal
}: VoucherSelectionModalProps) => {
    const theme = useTheme();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            loadVouchers();
        }
    }, [visible]);

    const loadVouchers = async () => {
        setLoading(true);
        try {
            const data = await voucherService.getMyVouchers();
            setVouchers(data);
        } catch (error) {
            console.error('Failed to load vouchers', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Chọn Voucher</Text>
                        <IconButton icon="close" size={24} onPress={onClose} />
                    </View>
                    <Divider />

                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={vouchers}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                const isEligible = orderTotal >= item.minOrderAmount;
                                return (
                                    <View style={!isEligible && styles.ineligibleContainer}>
                                        <VoucherCard
                                            voucher={item}
                                            onSelect={onSelect}
                                            isSelected={item.id === selectedVoucherId}
                                            disabled={!isEligible}
                                        />
                                        {!isEligible && (
                                            <Text style={styles.ineligibleText}>
                                                Chưa đạt giá trị đơn hàng tối thiểu
                                            </Text>
                                        )}
                                    </View>
                                );
                            }}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <IconButton icon="ticket-outline" size={60} iconColor="#CCC" />
                                    <Text style={styles.emptyText}>Bạn chưa có voucher nào khả dụng</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
    },
    ineligibleContainer: {
        marginBottom: 8,
    },
    ineligibleText: {
        fontSize: 10,
        color: '#F44336',
        marginLeft: 8,
        marginTop: -4,
        marginBottom: 8,
    }
});
