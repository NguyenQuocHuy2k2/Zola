import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatPrice } from '@/utils/format';
import { getProductPrimaryImage } from '@/services/product.service';
import { CartItem } from '@/services/cart.service';
import { Voucher } from '@/services/promotion.service';

interface CheckoutItemsProps {
    cartItems: CartItem[];
    voucherCode: string;
    setVoucherCode: (code: string) => void;
    handleApplyVoucher: () => void;
    applyingVoucher: boolean;
    appliedVoucher: { discount: number; voucher: Voucher } | null;
}

export const CheckoutItems = ({
    cartItems,
    voucherCode,
    setVoucherCode,
    handleApplyVoucher,
    applyingVoucher,
    appliedVoucher
}: CheckoutItemsProps) => {
    const theme = useTheme();

    return (
        <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
                <MaterialCommunityIcons name="basket-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>Sản phẩm trong giỏ</Text>
            </View>
            
            {cartItems.map((item, idx) => (
                <View key={idx} style={[styles.itemRow, idx === cartItems.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]}>
                    <Image source={{ uri: getProductPrimaryImage(item.product) }} style={styles.itemImage} resizeMode="cover" />
                    <View style={styles.itemContent}>
                        <Text numberOfLines={1} style={styles.itemName}>{item.product.name}</Text>
                        <Text style={styles.itemVariant}>Phân loại: Mặc định</Text>
                        <View style={styles.itemSubRow}>
                            <Text style={styles.itemPrice}>{formatPrice(item.product.basePrice)}</Text>
                            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                        </View>
                    </View>
                </View>
            ))}

            <Divider style={styles.divider} />

            <View style={styles.voucherContainer}>
                <TextInput
                    mode="outlined"
                    placeholder="Mã giảm giá (ZOLA100...)"
                    value={voucherCode}
                    onChangeText={setVoucherCode}
                    style={styles.voucherInput}
                    outlineColor="#EAEAEA"
                    activeOutlineColor={theme.colors.primary}
                    autoCapitalize="characters"
                    dense
                />
                <Button
                    mode="contained"
                    onPress={handleApplyVoucher}
                    loading={applyingVoucher}
                    style={styles.applyBtn}
                    labelStyle={{ fontWeight: 'bold', fontSize: 12 }}
                >
                    Áp dụng
                </Button>
            </View>

            {appliedVoucher && (
                <View style={styles.discountRow}>
                    <Text style={styles.discountLabel}>Giảm giá ({appliedVoucher.voucher.code}):</Text>
                    <Text style={styles.discountValue}>-{formatPrice(appliedVoucher.discount)}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222',
    },
    itemRow: {
        flexDirection: 'row',
        paddingBottom: 12,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        marginRight: 12,
    },
    itemContent: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#222',
        marginBottom: 4,
    },
    itemVariant: {
        fontSize: 11,
        color: '#8A8D9F',
        marginBottom: 4,
    },
    itemSubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#222',
    },
    itemQuantity: {
        fontSize: 12,
        color: '#8A8D9F',
        fontWeight: '600',
    },
    divider: {
        marginVertical: 12,
        backgroundColor: '#F0F0F0',
    },
    voucherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    voucherInput: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        fontSize: 13,
    },
    applyBtn: {
        borderRadius: 8,
        height: 44,
        justifyContent: 'center',
    },
    discountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    discountLabel: {
        fontSize: 13,
        color: '#388E3C',
        fontWeight: '500',
    },
    discountValue: {
        fontSize: 13,
        color: '#388E3C',
        fontWeight: 'bold',
    },
});
