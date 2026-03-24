import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface, useTheme, Icon } from 'react-native-paper';
import { Voucher, DiscountType, VoucherStatus } from '@/services/voucher.service';
import { formatPrice } from '@/utils/format';

interface VoucherCardProps {
    voucher: Voucher;
    onSelect?: (voucher: Voucher) => void;
    isSelected?: boolean;
    disabled?: boolean;
}

export const VoucherCard = ({ voucher, onSelect, isSelected, disabled }: VoucherCardProps) => {
    const theme = useTheme();

    const isExpired = new Date(voucher.expiryDate) < new Date();
    const isInactive = voucher.status !== VoucherStatus.ACTIVE || isExpired;

    const handlePress = () => {
        if (!disabled && !isInactive && onSelect) {
            onSelect(voucher);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} disabled={disabled || isInactive} activeOpacity={0.7}>
            <Surface style={[
                styles.container,
                { backgroundColor: isSelected ? theme.colors.primaryContainer : '#FFFFFF' },
                isInactive && styles.disabledContainer
            ]} elevation={isSelected ? 2 : 1}>
                
                <View style={[styles.leftSection, { backgroundColor: isInactive ? '#9E9E9E' : theme.colors.primary }]}>
                    <Icon source="ticket-percent" size={32} color="#FFFFFF" />
                </View>

                <View style={styles.rightSection}>
                    <View style={styles.header}>
                        <Text style={[styles.code, { color: isInactive ? '#757575' : theme.colors.primary }]}>
                            {voucher.code}
                        </Text>
                        {isExpired && (
                            <Text style={styles.expiredLabel}>Hết hạn</Text>
                        )}
                    </View>
                    
                    <Text style={styles.description} numberOfLines={2}>
                        {voucher.description}
                    </Text>

                    <View style={styles.footer}>
                        <Text style={styles.expiryText}>
                            HSD: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}
                        </Text>
                        <Text style={[styles.minOrderText, { color: theme.colors.primary }]}>
                            Đơn từ {formatPrice(voucher.minOrderAmount)}
                        </Text>
                    </View>
                </View>

                {isSelected && (
                    <View style={styles.selectedIcon}>
                        <Icon source="check-circle" size={24} color={theme.colors.primary} />
                    </View>
                )}
            </Surface>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    disabledContainer: {
        opacity: 0.6,
        borderColor: '#E0E0E0',
    },
    leftSection: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    rightSection: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    code: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#424242',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expiryText: {
        fontSize: 12,
        color: '#757575',
    },
    minOrderText: {
        fontSize: 12,
        fontWeight: '500',
    },
    expiredLabel: {
        fontSize: 10,
        color: '#D32F2F',
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    selectedIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    }
});
